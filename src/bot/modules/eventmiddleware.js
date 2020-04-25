// I generally hate middleware associated with events, but this could potentially save
// a whole lot on resources and audit log fetching if pulled off correctly.
module.exports = async (event, type) => {
  if (type === 'on') {
    global.bot.on(event.name, async (...args) => {
      const guildId = getGuildIdByEvent(event.name, args)
      if (!guildId) {
        global.logger.error(`While executing event ${event.name}, a guild ID was not returned!`)
      } else {
        const guildSettingsCache = global.bot.guildSettingsCache[guildId]
        if (guildSettingsCache && !guildSettingsCache.getEventLogRaw()[event.name]) return
        await event.handle.apply(this, args) // variable number of arguments.
      }
    })
  } else if (type === 'once') {
    global.bot.once(event.name, async (...args) => {
      await event.handle.apply(this, args)
    })
  }
}

// Return the id of the guild to prevent event processing if not configured by the user.
// IDs get checked for the presence of a configuration, while true is executed without a settings check.
function getGuildIdByEvent (type, args) {
  switch (type) {
    case 'channelCreate':
    case 'channelDelete':
    case 'channelUpdate': {
      return args[0].guild.id // Channel.Guild.id
    }
    case 'guildBanAdd':
    case 'guildBanRemove':
    case 'guildEmojisUpdate':
    case 'guildMemberAdd':
    case 'guildMemberRemove':
    case 'guildMemberUpdate':
    case 'guildRoleCreate':
    case 'guildRoleDelete':
    case 'guildRoleUpdate':
    case 'guildUpdate':
    case 'inviteCreate':
    case 'inviteDelete': {
      return args[0].id // Guild.id
    }
    case 'voiceChannelJoin':
    case 'voiceChannelLeave':
    case 'voiceChannelSwitch':
    case 'voiceStateUpdate': {
      return args[0].guild.id // Member.Guild.id
    }
    case 'messageDeleteBulk': {
      return args[0][0] ? args[0][0].channel.guild.id : true // Messages[0].Channel.Guild.id
    }
    default: {
      return true
    }
  }
}
