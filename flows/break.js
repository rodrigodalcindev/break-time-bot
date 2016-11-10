'use strict'

module.exports = (slapp) => {

  let help = `Break Time is pretty simple to use. If you feel like inviting co-workers to take a fun break type the \`/break\` command.`

  slapp.command('/break', /^\s*help\s*$/, (msg) => {
    msg.respond(help)
  })

  slapp.event('bb.team_added', function (msg) {
    slapp.client.im.open({ token: msg.meta.bot_token, user: msg.meta.user_id }, (err, data) => {
      if (err) {
        return console.error(err)
      }
      let channel = data.channel.id

      msg.say({ channel: channel, text: 'Thanks for adding me to your team!' })
      msg.say({ channel: channel, text: help })
    })
  })
}