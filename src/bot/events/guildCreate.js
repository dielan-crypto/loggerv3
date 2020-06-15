const createGuild = require('../../db/interfaces/postgres/create').createGuild
const cacheGuild = require('../utils/cacheGuild')
const statAggregator = require('../modules/statAggregator')

module.exports = {
  name: 'guildCreate',
  type: 'on',
  handle: async guild => {
    await createGuild(guild) // Create guild document in database
    await cacheGuild(guild.id) // Create a guildsettings object and cache it
    guild.members.limit = 0 // Set the collection limit to 0 to avoid putting members into cache
    statAggregator.incrementEvent('guildCreate')
  }
}
