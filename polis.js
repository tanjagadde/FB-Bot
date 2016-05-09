var express = require('express');
//var fulcrumMiddleware = require("./webhook_connect");
var bodyParser = require('body-parser');
//import * as fulcrumMiddleware from "webhook_connect";
var requestHttp = require('request');
var PORT = process.env.PORT || 9000;

var app = express();

function payloadProcessor (payload, done) {
  // Do stuff with payload like update records in a database,
  // send text messages to field staff, email supervisors when
  // task marked complete, etc.

  // After you've processed the payload call done() with no arguments to signal
  // that the webhook has been processed. Call done(), passing an error to return
  // a 500 response to the webhook request, signaling that the request should be
  // tried again later.
  // sendTextMessage('Record id ' + payload.data.id + ' has been updated!', function (error) {
  //   if (error) {
  //     console.log('sendTextMessage failed with: ', error);
  //     done(error);
  //   } else {
  //     done();
  //   }
  // })
    
  console.log('Payload:');
  console.log(payload);
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

//app.use('/', fulcrumMiddleware(fulcrumMiddlewareConfig));
//app.configure(function(){
  //app.use(bodyParser);
  //app.use(app.router);
//});
// app.get('/', function (req, res) {
//   res.send('<html><head><title>Polis.js</title></head><body><h2>polis.js</h2><p>Up and Running!</p></body></html>');
// })
app.get('/', function (req, res) {



  if (req.query['hub.verify_token'] === 'my_token') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('<html><head><title>Polis.js</title></head><body><h2>polis.js</h2><p>Up and Running!</p></body></html>');
  }
});

app.post('/', function (req, res) {
  
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    console.log("sender id is "+sender)
    console.log("sender message "+event.message)
    console.log("sender message text "+event.message.text)
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender
       console.log("message/text echoed back is***** "+text);
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
      "text":"Go ahead click on the below link",
      "buttons":[
          {
            "type":"web_url",
            "url": urlIs,
            "title":"Show Website"
          }
        ]
    }
  }
}
console.log("generic messagedata"+messageData.attachment.payload.buttons[0].url)
  return messageData
}

function sendTextMessage(sender, text) {
  var token = "CAAYtqUxLl28BAOmBNNTlYhMemritNdlXgNLQLEt36UX3ynMoiEr6lesTpRPqWLbZCWmtDgbPlZAVMl5fmcEZCEPlrmZCUGEBytFZBpjPpp7jtHf5CtDvjjZAtHF4mzX9lxV98R7j3DblPQAUZC8IIoNRuNCbMBh8n3ZAAkfrZC93t1XMtnoGeaAnfkgb4Gb42CDgqwEncRtBKvwZDZD";

  // var newText ='';
  //  if (text === 'help') {
  //    newText = "Here I am to help you out follow commands to explore more \n\
  //      1. Wanna know what is MLA is upto type PROGRAMS \n\
  //      2. Found an issue needs to be resloved type ISSUES \n\
  //      3. Kinda a want yourself upto date with your MLA news type NEWS";
  //  } else  {
  //    newText = 'hi there wanna know more hit HELP'
  //  }
  //  messageData = {
  //    text:newText
  //  }

  var newText = '';
  console.log("text is " + text);
  switch (text) {
    case 'help':
      newText = "Here I am to help you out follow commands to explore more \n\
      1. Wanna know what MLA is upto ? type PROGRAMS \n\
      2. Found an issue ? needs to be resloved ? type ISSUES \n\
      3. Kinda a want yourself upto date with your MLA news ? type NEWS";
      messageData = {
          text: newText
        }
        console.log("message is program"+messageData)
      //return;
      break;
    case 'PROGRAMS':
      // messageIS = "\"message\":{\r\n        \"attachment\":{\r\n          \"type\":\"template\",\r\n          \"payload\":{\r\n            \"template_type\":\"generic\",\r\n            \"elements\":[\r\n              {\r\n                \"title\":\"Talk and know your MLA\",\r\n                \"image_url\":\"http://gadderamamohan.com/home_slideshow/SLIDE1032004.jpg\",\r\n                \"subtitle\":\"Meet The man\",\r\n                \"buttons\":[\r\n                  {\r\n                    \"type\":\"web_url\",\r\n                    \"title\":\"View Website\",\r\n                    \"url\":\"http://gadderamamohan.com/programs.php\"\r\n                  },\r\n                  {\r\n                    \"type\":\"postback\",\r\n                    \"title\":\"Start chatting\",\r\n                    \"payload\":\"DEVELOPER_DEFINED_PAYLOAD\"\r\n                  }\r\n                ]\r\n              }\r\n            ]\r\n          }\r\n        }\r\n      }";
      // console.log("message is program"+messageIS);
      messageData = sendGenericMessage("http://gadderamamohan.com/programs.php")
      console.log("message is program"+messageData)
      //return;
      break;
    case 'ISSUES':
      //  messageIS = "\"message\":{\r\n        \"attachment\":{\r\n          \"type\":\"template\",\r\n          \"payload\":{\r\n            \"template_type\":\"generic\",\r\n            \"elements\":[\r\n              {\r\n                \"title\":\"Talk and know your MLA\",\r\n                \"image_url\":\"http://gadderamamohan.com/home_slideshow/SLIDE1032004.jpg\",\r\n                \"subtitle\":\"Meet The man\",\r\n                \"buttons\":[\r\n                  {\r\n                    \"type\":\"web_url\",\r\n                    \"title\":\"View Website\",\r\n                    \"url\":\"http://gadderamamohan.com/post_a_issue.php\"\r\n                  },\r\n                  {\r\n                    \"type\":\"postback\",\r\n                    \"title\":\"Start chatting\",\r\n                    \"payload\":\"DEVELOPER_DEFINED_PAYLOAD\"\r\n                  }\r\n                ]\r\n              }\r\n            ]\r\n          }\r\n        }\r\n      }";

      // console.log("message is issues"+messageIS);
      messageData = sendGenericMessage("http://gadderamamohan.com/post_a_issue.php")
      console.log("message is program"+messageData)
      //return;
      break;
    case 'NEWS':
      //  messageIS = "\"message\":{\r\n        \"attachment\":{\r\n          \"type\":\"template\",\r\n          \"payload\":{\r\n            \"template_type\":\"generic\",\r\n            \"elements\":[\r\n              {\r\n                \"title\":\"Talk and know your MLA\",\r\n                \"image_url\":\"http://gadderamamohan.com/home_slideshow/SLIDE1032004.jpg\",\r\n                \"subtitle\":\"Meet The man\",\r\n                \"buttons\":[\r\n                  {\r\n                    \"type\":\"web_url\",\r\n                    \"title\":\"View Website\",\r\n                    \"url\":\"http://gadderamamohan.com/news.php\"\r\n                  },\r\n                  {\r\n                    \"type\":\"postback\",\r\n                    \"title\":\"Start chatting\",\r\n                    \"payload\":\"DEVELOPER_DEFINED_PAYLOAD\"\r\n                  }\r\n                ]\r\n              }\r\n            ]\r\n          }\r\n        }\r\n      }";

      // console.log("message is news"+messageIS);
      messageData = sendGenericMessage("http://gadderamamohan.com/news.php")
      console.log("message is program"+messageData)
      //return;
      break;
    default:
      newText = 'hi there wanna know more hit HELP'
      messageData = {
        text: newText
      }
      console.log("message is default" + messageData);
  };
  // console.log("message is"+messageIS);

  //var messageData = messageIS;
  console.log("message date json parsed" + messageData);

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

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});
