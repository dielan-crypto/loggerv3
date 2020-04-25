const send = require('../modules/webhooksender')
const cacheGuild = require('../utils/cacheGuild')

module.exports = {
  name: 'guildMemberUpdate',
  type: 'on',
  handle: async (guild, member, oldMember) => {
    if (!guild.members.get(global.bot.user.id).permission.json.viewAuditLogs || !guild.members.get(global.bot.user.id).permission.json.manageWebhooks) return
    if (oldMember && oldMember.nick !== member.nick) {
      await handleMemberNickUpdate(guild, member, oldMember)
    } else {
      guild.getAuditLogs(1).then(async (log) => {
        if (!log.entries[0]) return
        const auditEntryDate = new Date((log.entries[0].id / 4194304) + 1420070400000)
        if (new Date().getTime() - auditEntryDate.getTime() < 3000) {
          if (log.entries[0].actionType === 25) await handleMemberRoleUpdate(guild, member, log.entries[0])
          else if (log.entries[0].actionType === 24) await handleMemberNickUpdate(guild, member, oldMember, log.entries[0])
        }
      }).catch(() => {})
    }
  }
}

async function handleMemberNickUpdate (guild, member, oldMember, log) {
  const guildMemberNickUpdate = {
    guildID: guild.id,
    eventName: 'guildMemberNickUpdate',
    embed: {
      author: {
        name: `${member.username}#${member.discriminator}`,
        icon_url: member.avatarURL
      },
      thumbnail: {
        url: member.avatarURL
      },
      description: `${member.username}#${member.discriminator} ${member.mention} ${member.nick ? `(${member.nick})` : ''} was renamed`,
      fields: [{
        name: 'Changes',
        value: 'Unknown. Look at the footer to see who updated the affected user.'
      }],
      footer: log ? { // if an audit log entry is passed, add the perpetrator. Otherwise, pass null so the webhook sender can pick it up and add bot info.
        icon_url: log.user.avatarURL,
        text: `${log.user.username}#${log.user.discriminator}`
      }
        : null
    }
  }
  guildMemberNickUpdate.embed.fields[0] = ({
    name: 'New name',
    value: `${member.nick ? member.nick : member.username}#${member.discriminator}`,
    inline: true
  })
  if (oldMember) {
    guildMemberNickUpdate.embed.fields.push({
      name: 'Old name',
      value: `${oldMember.nick ? oldMember.nick : member.username}#${member.discriminator}`,
      inline: true
    })
  }
  guildMemberNickUpdate.embed.fields.push({
    name: 'ID',
    value: `\`\`\`ini\nUser = ${member.id}\`\`\``
  })
  await send(guildMemberNickUpdate)
}

async function handleMemberRoleUpdate (guild, member, log) {
  const guildMemberUpdate = {
    guildID: guild.id,
    eventName: 'guildMemberUpdate',
    embed: {
      author: {
        name: `${member.username}#${member.discriminator}`,
        icon_url: member.avatarURL
      },
      thumbnail: {
        url: member.avatarURL
      },
      description: `${member.username}#${member.discriminator} ${member.mention} ${member.nick ? `(${member.nick})` : ''} was updated`,
      fields: [{
        name: 'Changes',
        value: 'Unknown. Look at the footer to see who updated the affected user.'
      }]
    }
  }
  const user = log.user
  if (!global.bot.guildSettingsCache[guild.id]) {
    await cacheGuild(guild.id)
  }
  if (user.bot && global.bot.guildSettingsCache[guild.id].isLogBots()) {
    await processRoleChange()
  } else if (!user.bot) {
    await processRoleChange()
  }
  async function processRoleChange () {
    const added = []
    const removed = []
    let roleColor
    if (log.after.$add) {
      if (log.after.$add.length !== 0) log.after.$add.forEach(r => added.push(r))
    }
    if (log.after.$remove) {
      if (log.after.$remove.length !== 0) log.after.$remove.forEach(r => removed.push(r))
    }
    if (added.length !== 0) {
      roleColor = guild.roles.find(r => r.id === added[0].id).color
    } else if (removed.length !== 0) {
      roleColor = guild.roles.find(r => r.id === removed[0].id).color
    }
    // Add a + or - emoji when roles are manipulated for a user, stringify it, and assign a field value to it.
    guildMemberUpdate.embed.fields[0].value = `${added.map(role => `➕ **${role.name}**`).join('\n')}${removed.map((role, i) => `${i === 0 && added.length !== 0 ? '\n' : ''}\n:x: **${role.name}**`).join('\n')}`
    guildMemberUpdate.embed.color = roleColor
    guildMemberUpdate.embed.footer = {
      text: `${user.username}#${user.discriminator}`,
      icon_url: `${user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`}`
    }
    guildMemberUpdate.embed.fields.push({
      name: 'ID',
      value: `\`\`\`ini\nUser = ${member.id}\nPerpetrator = ${user.id}\`\`\``
    })
    await send(guildMemberUpdate)
  }
}
