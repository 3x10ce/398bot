
let SakuyaBot = require('./src/SakuyaBot')
let Twitter = require('twitter')
let env = require('dotenv').config()

twitter = new Twitter ({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret
})

sakuyaBot = new SakuyaBot(twitter)
sakuyaBot.start()