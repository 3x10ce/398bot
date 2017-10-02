'use strict'


const SakuyaBot = class {
  constructor (twitter) {
    this.client = twitter
  }
  
  start () {
    console.log(`Hello World!`)
    this.client.stream('user', (stream) => {
      stream.on('data', this.read)
  
      stream.on('error', function(error) {
        console.log(error)
      })
  
      stream.on('event', this.receive)
    })
    // this.tweet(`Hello World! My name is ${this.name}. start up.`);
  }

  read (tweet) {
    console.dir(tweet)
  }

  receive (event) {
    console.dir(event)
  }
}

module.exports = SakuyaBot