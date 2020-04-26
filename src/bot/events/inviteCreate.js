const send = require('../modules/webhooksender')

module.exports = {
  name: 'inviteCreate',
  type: 'on',
  handle: async (guild, invite) => {
    let embedDescription
    let embedAuthor
    let embedThumbnail
    const fields = []
    if (!invite.inviter) {
      embedDescription = 'An invite has been created'
      let inviteAge
      switch (invite.maxAge) {
        case 0:
          inviteAge = 'forever'
          break
        case 1800:
          inviteAge = 'for 30 minutes'
          break
        default:
          inviteAge = `for ${Math.floor(invite.maxAge / 3600)} hour(s)`
      }
      fields.push({
        name: 'Info',
        value: `Invite \`${invite.code}\` with ${invite.maxUses ? invite.maxUses : 1} use(s) max`
      }, {
        name: 'Valid for',
        value: `Valid ${inviteAge} ${invite.temporary ? '(temporary membership)' : ''}`
      })
      await send({
        guildID: guild.id,
        eventName: 'inviteCreate',
        embed: {
          description: embedDescription,
          fields: fields.concat({
            name: 'ID',
            value: `\`\`\`ini\nInviter = ???\nChannel = ${invite.channel.id}\`\`\``
          }),
          color: 3553599
        }
      })
    } else if (invite.inviter.system) {
      embedDescription = 'An invite has been created by the system.'
      embedAuthor = {
        name: 'System',
        icon_url: 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png' // Discord icon on branding page
      }
      fields.push({
        name: 'Info',
        value: `Invite \`${invite.code}\` leading to ${invite.channel.name} (${invite.channel.mention})`
      })
      embedThumbnail = {
        url: 'https://discordapp.com/assets/2c21aeda16de354ba5334551a883b481.png'
      }
    } else {
      embedDescription = `${invite.inviter.username}#${invite.inviter.discriminator} ${invite.inviter.mention} created an invite`
      embedAuthor = {
        name: `${invite.inviter.username}#${invite.inviter.discriminator}`,
        icon_url: invite.inviter.avatarURL
      }
      let inviteAge
      switch (invite.maxAge) {
        case 0:
          inviteAge = 'forever'
          break
        case 1800:
          inviteAge = 'for 30 minutes'
          break
        default:
          inviteAge = `for ${Math.floor(invite.maxAge / 3600)} hour(s)`
      }
      fields.push({
        name: 'Info',
        value: `Invite \`${invite.code}\` with ${invite.maxUses ? invite.maxUses : 1} use(s) max`
      }, {
        name: 'Valid for',
        value: `Valid ${inviteAge} ${invite.temporary ? '(temporary membership)' : ''}`
      })
      embedThumbnail = {
        url: invite.inviter.avatarURL
      }
    }
    await send({
      guildID: guild.id,
      eventName: 'inviteCreate',
      embed: {
        author: embedAuthor,
        description: embedDescription,
        thumbnail: embedThumbnail,
        fields: fields.concat({
          name: 'ID',
          value: `\`\`\`ini\nInviter = ${embedAuthor.text === 'System' ? 'System' : invite.inviter.id}\nChannel = ${invite.channel.id}\`\`\``
        }),
        color: 3553599
      }
    })
  }
}
