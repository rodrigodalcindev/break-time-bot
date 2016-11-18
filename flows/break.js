'use strict'

module.exports = (slapp) => {

  let help = `Break Time is pretty simple to use. If you feel like inviting co-workers to take a fun break type the \`/break\` command.`

  let breakes = []

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
          callback_id: 'handle_break_request',
          actions: [
            {
              "name": "answer",
              "text": "Play Foos",
              "type": "button",
              "value": "playing foos"
            },
            {
              "name": "answer",
              "text": "Play Snakes & Ladders",
              "type": "button",
              "value": "playing Snakes & Ladders"
            },
            {
              "name": "answer",
              "text": "Play Shuffleboard",
              "type": "button",
              "value": "playing shuffleboard"
            },
            {
              "name": "answer",
              "text": "Go for a walk",
              "type": "button",
              "value": "going for a walk"
            }
          ]
        }
      ]
    })
  })

  slapp.action('handle_break_request', 'answer', (msg, val) => {
    msg.respond({
      text: msg.body.user.name + ' feels like taking a break and ' + val + '.',
      response_type: 'in_channel',
      attachments: [
        {
          text: '',
          callback_id: 'join_break_request',
          actions: [
            {
              "name": "answer",
              "text": "Join the break",
              "type": "button",
              "value": val + ' with ' + msg.body.user.name
            }
          ]
        }
      ]
    })
  })

  slapp.action('join_break_request', 'answer', (msg, val) => {
    var orig = msg.body.original_message
    var user = msg.body.user.name
    var breakActivity = val.split(' with ')[0]
    var breakRequester = val.split(' with ')[1]

    if (user == breakRequester) {
      msg.respond({
        text: "This break was originally requested by you.",
        response_type: 'ephemeral',
        "replace_original": false
      })
    } else if (breakers.indexOf(user) > -1) {
      msg.respond({
        text: "You've already joined this break.",
        response_type: 'ephemeral',
        "replace_original": false
      })
    } else {
      var newAttachment = {
        text: '@' + msg.body.user.name + ' joined the break.'
      }
      breakers.push(msg.body.user.name)
      orig.attachments.push(newAttachment)
      msg.respond(msg.body.response_url, orig)
    }
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