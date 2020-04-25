const setEventLogs = require('../../db/interfaces/postgres/update').setEventsLogId
const setAllOneID = require('../../db/interfaces/postgres/update').setAllEventsOneId
const cacheGuild = require('../utils/cacheGuild')
const eventList = require('../utils/constants').ALL_EVENTS

module.exports = {
  func: async (message, suffix) => {
    if (!message.channel.guild.members.get(global.bot.user.id).permission.json.sendMessages) {
      return
    }
    let events = suffix.split(', ')
    if (events.length === 0) events = suffix.split(',')
    events = cleanArray(events)
    if (events.length === 0 && suffix) {
      message.channel.createMessage(`<@${message.author.id}>, none of the provided events are valid. Look at ${process.env.GLOBAL_BOT_PREFIX}help to see what is valid OR visit the dashboard at <https://logger.bot>`)
    } else if (events.length === 0 && !suffix) {
      await setAllOneID(message.channel.guild.id, '')
      await cacheGuild(message.channel.guild.id)
      message.channel.createMessage(`<@${message.author.id}>, no events will be logged to this channel anymore.`)
    } else {
      await setEventLogs(message.channel.guild.id, '', events)
      await cacheGuild(message.channel.guild.id)
      message.channel.createMessage(`<@${message.author.id}>, it has been done. Visit the dashboard at <https://logger.bot> for easier configuration!`)
    }
  },
  name: 'stoplogging',
  description: 'Use this in a log channel to stop me from logging to here. Used without any text after it, all events will cease to be logged in the channel it was sent in. You can pass event names like setchannel to individually unset events too.',
  type: 'admin',
  category: 'Logging'
}

function cleanArray (events) {
  const tempEvents = []
  events.forEach(event => {
    if (!eventList.includes(event)) return []
    eventList.forEach(validEvent => {
      const lowerEvent = validEvent.toLowerCase()
      const upperEvent = validEvent.toUpperCase()
      if (event === lowerEvent || event === upperEvent || event === validEvent) {
        tempEvents.push(validEvent)
      }
    })
  })
  return tempEvents
}
