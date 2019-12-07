# strong-pubsub-mqtt
Pubsub adapter for MQTT broker. `strong-pubsub-mqtt` provides a convenient method to create a MQTT client in nodejs. It supports publishing and subscribing to topics.

# Installation

```sh
npm add https://github.com/nexpando-com/strong-pubsub-mqtt.git --save
# or
yarn add https://github.com/nexpando-com/strong-pubsub-mqtt.git
```

# Usage

```javascript
const options = { brokerUrl: 'mqtt://localhost:1883'}

const client = new Client(options, Adapter)

const connect = () => {
  return new Promise((resovle, reject) => {
    client.connect((err) => {
      if (err) reject()
      resovle()
    })
  })
}

const run = async () => {
  client.on('connect', (data) => {
    console.log('Connected...', data)
  })
  await connect()

  client.subscribe('test')

  client.on('error', (err) => {
    console.log(err)
  })


  client.on('message', function(topic, message, packet) {
    console.log('Incoming message...', topic, message.toString())
  })
}

(async() => {
  await run()
})()
```
