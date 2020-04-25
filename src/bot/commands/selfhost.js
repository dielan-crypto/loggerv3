module.exports = {
  func: async message => {
    await message.channel.createMessage({
      embed: {
        title: 'Selfhosting information',
        description: 'Hey, I\'m glad to see you have some interest in running Logger yourself! Whether you want to modify it, own your own instance, or just want the best possible security, you came to the right place. See the fields below to get started.',
        url: 'https://github.com/caf203/loggerv3',
        color: 3553599,
        timestamp: new Date(),
        footer: {
          icon_url: global.bot.user.avatarURL,
          text: `${global.bot.user.username}#${global.bot.user.discriminator}`
        },
        thumbnail: {
          url: global.bot.user.avatarURL
        },
        author: {
          name: `${message.author.username}#${message.author.discriminator}`,
          icon_url: message.author.avatarURL
        },
        fields: [
          {
            name: 'Difficulty Level',
            value: 'If you are a programmer or savvy at reading code, you can probably selfhost this bot.'
          },
          {
            name: 'Recommended computer resources',
            value: 'I would always recommend using a VPS or some dedicated machine hosted in a data center to host Logger. This way, you have a dedicated, stable uplink to Discord and won\'t have to have your home machine running 24/7. Logger is perfectly capable of running on a Raspberry Pi (3+)'
          },
          {
            name: 'Github Repo',
            value: 'Click [this](https://github.com/caf203/loggerv3) to go to my code'
          },
          {
            name: 'README',
            value: 'Click [here](https://github.com/caf203/loggerv3/blob/development/README.md)'
          },
          {
            name: 'Future',
            value: 'It is on the horizon to have a version of Logger that you can download and run as a GUI on your computer with no requirements needed (like nodejs, postgres, and redis). Join my support server (below) if you want to keep up to date on that.'
          },
          {
            name: 'Help?',
            value: 'Visit my [home server](https://discord.gg/ed7Gaa3) if you need further help.'
          }
        ]
      }
    })
  },
  name: 'selfhost',
  description: 'Want to see information about selfhosting the bot? Use this command!@',
  type: 'any',
  category: 'Information'
}
