'use strict'

module.exports = (slapp) => {

  let help = `Break Time is pretty simple to use. If you feel like inviting co-workers to take a fun break type the \`/break\` command.`

  slapp.command('/break', /^\s*help\s*$/, (msg) => {
    msg.respond(help)
  })

  slapp.command('/break', /.*/, (msg, text, match1) => {
    msg.respond({
      text: 'What would you like to do?',
      response_type: 'in_channel',
      attachments: [
        {
          text: '',
          callback_id: 'what_would_you_like_to_do',
          actions: [
            {
              "name": "answer",
              "text": "Play Foos",
              "type": "button",
              "value": "foos"
            },
            {
              "name": "answer",
              "text": "Play Snakes & Ladders",
              "type": "button",
              "value": "snakes"
            },
            {
              "name": "answer",
              "text": "Play Shuffleboard",
              "type": "button",
              "value": "shuffleboard"
            }
          ]
        }
      ]
    })
  })

  slapp.action('what_would_you_like_to_do', 'answer', (msg, val) => {
    msg.respond(msg.body.user.name + ' wants to play' + val)
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