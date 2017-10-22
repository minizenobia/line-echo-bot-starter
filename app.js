let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'i+YjNG5UG99IY7voXApOZP8rKO6rjVfQWfbhUO5mOGvIFUKa7bcUXQJjjtEPEQDGgR3NoIwCjeiK2n3F0z3mPYejaoEj74ILayJeaPdzGg/vlf7Qq1qetl8wxu2KyHsKI5hL1KfmzhCtNf4a03hOZQdB04t89/1O/w1cDnyilFU='
//Your_Channel_Access_Token from line develope page
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {    //line only need post / , not like facebook need get and post "/"
    console.log(JSON.stringify(req.body, null, 2)) //print req body

    let events = req.body.events;
    events.forEach((event) => {    //使用以下這個群族取出回應資料
        let replyToken = event.replyToken
        let type = event.message.type
        if (type === 'text') {
            let text = event.message.text
            sendMessage(replyToken, text)
        } else {
            sendMessage(replyToken, type)
        }
    })
    res.send()
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
