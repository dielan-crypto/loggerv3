module.exports = {
  func: async (message, suffix) => {
    if (!suffix) {
      message.channel.createMessage('USAGE: debug <guildid>')
      return
    }
    const msg = await message.channel.createMessage({
      embed: {
        description: 'Working...',
        color: 19455
      }
    })
    let guild
    try {
      guild = await global.bot.getRESTGuild(suffix)
    } catch (_) {
      msg.edit({
        embed: {
          description: ':x: NOT a guild id or I\'m not a member',
          color: 16711680
        }
      })
      return
    }
    msg.edit({
      embed: {
        description: `✅ found guild ${guild.name}`,
        color: 65280
      }
    })

    const guildSettingsCache = global.bot.guildSettingsCache[guild.id]
    const botGuildMember = await global.bot.getRESTGuildMember(guild.id, global.bot.user.id)
    const botPerms = botGuildMember.permission.json
    const fields = []
    fields.push({
      name: 'Guild', // lol consistency
      value: `${botPerms.viewAuditLogs ? '✅' : ':x:'} viewAuditLogs
      ${botPerms.manageWebhooks ? '✅' : ':x:'} manageWebhooks
      ${botPerms.sendMessages ? '✅' : '⚠️'} sendMessages
      ${botPerms.readMessages ? '✅' : '⚠️'} readMessages`
    })
    const channelIds = []
    const eventLog = guildSettingsCache.getEventLogRaw()
    for (const event in eventLog) {
      if (eventLog[event] && !channelIds.includes(eventLog[event])) channelIds.push(eventLog[event])
    }
    const guildChannels = await global.bot.getRESTGuildChannels(guild.id)
    channelIds.forEach(async channelId => {
      const channel = guildChannels.find(c => c.id === channelId)
      if (!channel) {
        const eventsMatchingId = []
        for (const event in eventLog) {
          if (eventLog[event] === channelId) eventsMatchingId.push(event)
        }
        fields.push({
          name: '⚠️UKNOWN CHANNEL⚠️',
          value: eventsMatchingId.join(', ') + '<#' + channelId + '>'
        })
        return
      }
      const botPermsChannel = channel.permissionsOf(global.bot.user.id) ? channel.permissionsOf(global.bot.user.id).json : null
      if (botPermsChannel) {
        const eventsMatchingId = []
        for (const event in eventLog) {
          if (eventLog[event] === channelId) eventsMatchingId.push(event)
        }
        const permString = `${eventsMatchingId.join(', ')}\n
        ${botPermsChannel.manageWebhooks ? '✅' : ':x:'} manageWebhooks
        ${botPermsChannel.readMessages ? '✅' : '⚠️'} readMessages
        ${botPermsChannel.sendMessages ? '✅' : '⚠️'} sendMessages`
        fields.push({
          name: `Channel ${channel.name}`,
          value: permString
        })
      } else {
        fields.push({
          name: `Channel ${channel.name}`,
          value: '⚠️Couldn\'t find permissions for the bot in this channel⚠️'
        })
      }
    })
    msg.edit({
      embed: {
        description: `✅ found guild ${guild.name}`,
        color: 65280,
        fields: fields
      }
    })
  },
  name: 'debug',
  description: 'Debug command',
  type: 'creator',
  hidden: true
}
