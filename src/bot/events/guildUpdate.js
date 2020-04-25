const send = require('../modules/webhooksender')

const checkExempt = [
  'afk_channel_id',
  'default_message_notifications',
  'system_channel_id',
  'afk_timeout'
]

module.exports = {
  name: 'guildUpdate',
  type: 'on',
  handle: async (newGuild, oldGuild) => {
    if (!newGuild.members.get(global.bot.user.id).permission.json.viewAuditLogs || !newGuild.members.get(global.bot.user.id).permission.json.manageWebhooks) return
    const fields = []
    newGuild.getAuditLogs(1, null, 1).then((log) => {
      if (!log) return
      const user = log.users[0]
      const member = newGuild.members.get(user.id)
      let arr
      if (Object.keys(log.entries[0].before) > Object.keys(log.entries[0].after)) {
        arr = Object.keys(log.entries[0].before)
      } else {
        arr = Object.keys(log.entries[0].after)
      }
      arr.forEach((key) => {
        if (oldGuild[key] !== newGuild[key] || checkExempt.includes(key)) { // if both guilds have the property and they don't equal eachother
          const data = handle(key, log)
          fields.push(data)
        }
      })
      if (fields.length === 0) return // if the bot doesn't have any changes recorded, then why log?
      send({
        guildID: newGuild.id,
        eventName: 'guildUpdate',
        embed: {
          author: {
            name: `${user.username}#${user.discriminator} ${member && member.nick ? `(${member.nick})` : ''}`,
            icon_url: user.avatarURL
          },
          thumbnail: {
            url: user.avatarURL
          },
          description: 'The guild was updated',
          fields: fields,
          color: 3553599
        }
      })
    }).catch(() => {})
    function handle (name, log) {
      let after = 'None'
      let before = 'None'
      switch (name) {
        case 'system_channel_id':
          if (log.entries[0].before.system_channel_id) {
            before = newGuild.channels.get(log.entries[0].before.system_channel_id).name
          }
          if (log.entries[0].after.system_channel_id) {
            after = newGuild.channels.get(log.entries[0].after.system_channel_id).name
          }
          return {
            name: 'Welcome Message Channel',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'afk_timeout':
          if (log.entries[0].before.afk_timeout) {
            before = log.entries[0].before.afk_timeout / 60
          }
          if (log.entries[0].after.afk_timeout) {
            after = log.entries[0].after.afk_timeout / 60
          }
          return {
            name: 'AFK Timeout',
            value: `Now: ${after} minutes\nWas: ${before} minutes`
          }
        case 'default_message_notifications':
          if (log.entries[0].before.default_message_notifications) {
            before = log.entries[0].before.default_message_notifications === 0 ? 'All Messages' : 'Mentions'
          }
          if (log.entries[0].after.default_message_notifications) {
            after = log.entries[0].after.default_message_notifications === 0 ? 'All Messages' : 'Mentions'
          }
          return {
            name: 'Message Notifications',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'afk_channel_id':
          if (!newGuild.channels.get(log.entries[0].before.afk_channel_id)) {
            before = 'None'
          } else {
            before = newGuild.channels.get(log.entries[0].before.afk_channel_id).name
          }
          if (!newGuild.channels.get(log.entries[0].after.afk_channel_id)) {
            after = 'None'
          } else {
            after = newGuild.channels.get(log.entries[0].after.afk_channel_id).name
          }
          return {
            name: 'AFK Channel',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'name':
          before = log.entries[0].before.name
          after = log.entries[0].after.name
          return {
            name: 'Name',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'region':
          before = log.entries[0].before.region
          after = log.entries[0].after.region
          return {
            name: 'Region',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'icon':
          before = 'Not Available'
          after = newGuild.icon ? `[This](\`https://cdn.discordapp.com/icons/${newGuild.id}/${newGuild.icon}.jpg\`)` : 'None'
          return {
            name: 'Icon',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'features':
          before = 'Not Available'
          after = 'Not Available'
          return {
            name: 'Features ⚠ WARNING: This isn\'t changed very often!',
            value: `Now: ${after}\nWas: ${before}`
          }
        case 'splash':
          before = 'Not Available'
          after = 'Not Available'
          return {
            name: 'Splash Image ⚠ WARNING: This isn\'t changed very often',
            value: `Now: ${after}\nWas: ${before}`
          }
      }
    }
  }
}
