var express = require('express');
var bodyParser = require('body-parser');
var requestHttp = require('request');
var PORT = process.env.PORT || 9000;

var app = express();

function payloadProcessor(payload, done) {

  done()
}

var fulcrumMiddlewareConfig = {
  actions: ['record.create', 'record.update'],
  processor: payloadProcessor
};
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.get('/', function(req, res) {

  if (req.query['hub.verify_token'] === 'my_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('<html><head><title>Polis.js</title></head><body><h2>polis.js</h2><p>Up and Running!</p></body></html>');
  }
});

app.post('/', function(req, res) {

  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    console.log("sender id is " + sender)
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
      console.log("message/text echoed back is***** " + text);
      sendTextMessage(sender, text);
    }
  }
  res.sendStatus(200);
});

function sendGenericMessage(urlIs) {
  messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "Go ahead click on the below link",
        "buttons": [{
          "type": "web_url",
          "url": urlIs,
          "title": "Show Website"
        }]
      }
    }
  }
  console.log("generic messagedata" + messageData.attachment.payload.buttons[0].url)
  return messageData
}

function sendTextMessage(sender, text) {
  var token = "CAAYtqUxLl28BAOmBNNTlYhMemritNdlXgNLQLEt36UX3ynMoiEr6lesTpRPqWLbZCWmtDgbPlZAVMl5fmcEZCEPlrmZCUGEBytFZBpjPpp7jtHf5CtDvjjZAtHF4mzX9lxV98R7j3DblPQAUZC8IIoNRuNCbMBh8n3ZAAkfrZC93t1XMtnoGeaAnfkgb4Gb42CDgqwEncRtBKvwZDZD";

  var newText = '';
  console.log("text is " + text);
  switch (text) {
    case 'HELP':
      newText = "Here I am to help you out follow commands to explore more \n\
      1. Wanna know what MLA is upto ? type PROGRAMS \n\
      2. Found an issue ? needs to be resloved ? type ISSUES \n\
      3. Kinda a want yourself upto date with your MLA news ? type NEWS";
      messageData = {
        text: newText
      }
      console.log("message is program" + messageData)
      break;
    case 'PROGRAMS':
      messageData = sendGenericMessage("http://gadderamamohan.com/programs.php")
      break;
    case 'ISSUES':

      messageData = sendGenericMessage("http://gadderamamohan.com/post_a_issue.php")

      break;
    case 'NEWS':

      messageData = sendGenericMessage("http://gadderamamohan.com/news.php")
      break;
    default:
      newText = 'hi there wanna know more hit HELP'
      messageData = {
        text: newText
      }

  };

  requestHttp({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(PORT, function() {
  console.log('Listening on port ' + PORT);
});