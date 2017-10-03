'use strict'

const SakuyaBot = class {
  constructor (client) {
    this.client = client
  }
  
  start () {
    console.log(`Hello World!`)
    this.client.openUserStream({
      data: this.read,
      error: (error) => console.log(error),
      event: this.receive
    })
  }

  read (tweet) {
    console.dir(tweet)
  }

  receive (event) {
    console.dir(event)
  }
}

module.exports = SakuyaBot