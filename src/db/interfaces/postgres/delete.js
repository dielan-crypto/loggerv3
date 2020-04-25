const pool = require('../../clients/postgres')

exports.deleteGuild = async function (guildID) {
  await pool.query('DELETE FROM guilds WHERE id=$1', [guildID])
}

exports.deleteUser = async function (userID) {
  await pool.query('DELETE FROM users WHERE id=$1', [userID])
}

exports.deleteMessage = async function (messageID) {
  await pool.query('DELETE FROM messages WHERE id=$1', [messageID])
}
