'use strict'

module.exports = (slapp) => {

  let help = `Break Time is pretty simple to use. If you feel like inviting co-workers to take a fun break type the \`/break\` command.`

  let breakers = []

  function limitReached(breakers,breakActivity) {
    switch (breakActivity) {
      case "playing foos":
        breakers.length == 2
        break
      case "playing shuffleboard":
        breakers.length == 1
        break
      case "playing Snakes & Ladders":
        breakers.length == 1
        break
      default:
        false
    }
  }

  slapp.command('/break', /^\s*help\s*$/, (msg) => {
    msg.respond(help)
  })

  slapp.command('/break', /.*/, (msg, text, match1) => {
    msg.respond({
      text: 'What would you like to do?',
      response_type: 'ephemeral',
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
    msg.say({
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
    var breakParticipant = msg.body.user.name
    var breakActivity = val.split(' with ')[0]
    var breakProponent = val.split(' with ')[1]

    if (breakParticipant == breakProponent) {
      msg.respond({
        text: "This break was originally requested by you.",
        response_type: 'ephemeral',
        "replace_original": false
      })
    } else if (breakers.indexOf(breakParticipant) != -1) {
      msg.respond({
        text: "You've already joined this break.",
        response_type: 'ephemeral',
        "replace_original": false
      })
    } else {
      breakers.push(breakParticipant)

      if (limitReached(breakers,breakActivity)) {
        breakParticipants = '@' + breakProponent

        for (var i = 0; i < breakers.length; i++) {
          if (i == (breakers.length - 1)) {
            breakParticipants += (' and ' + breakers[i])
          } else {
            breakParticipants += (', @' + breakers[i])
          }
        }

        msg.respond({
          text: breakParticipants + " are " + breakActivity + ". Enjoy! :smile:",
          response_type: 'in_channel',
          "replace_original": true
        })
      } else {
        var newAttachment = {
          text: '@' + breakParticipant + ' joined the break.'
        }
        orig.attachments.push(newAttachment)
        msg.respond(msg.body.response_url, orig)
      }
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