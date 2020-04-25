const send = require('../modules/webhooksender')
const inviteJoinBroker = require('../modules/invitejoinbroker')

module.exports = {
  name: 'inviteDelete',
  type: 'on',
  handle: async (guild, invite) => {
    const collectionToMembers = guild.members.map(o => o)
    collectionToMembers.sort((m1, m2) => m2.joinedAt - m1.joinedAt) // turn into normal array because collections good xd xd
    const candidateMember = Math.abs(new Date().getTime() - collectionToMembers[0].joinedAt) < 2000 ? collectionToMembers[0] : null
    if (candidateMember) {
      inviteJoinBroker.offer(candidateMember.id, invite.code) // It seems that inviteDelete is called before member join very consistently.
    }
    const thumbnail = {}
    if (candidateMember) {
      thumbnail.url = candidateMember.avatarURL
    }
    await send({
      ...thumbnail,
      ...{
        guildID: guild.id,
        eventName: 'inviteDelete',
        embed: {
          description: `Invite \`${invite.code}\` was ${candidateMember ? `deleted from use by ${candidateMember.username}#${candidateMember.discriminator} ${candidateMember.mention}` : 'deleted'}`,
          // thumbnail: embedThumbnail
          color: 3553599
        }
      }
    })
  }
}
