import 'babel-polyfill'
import Client from 'strong-pubsub'
import Adapter from '../src/index'

/**
 * brokerUrl = 'mqtt://localhost:1883 | mqtts://localhost:8883 | wss://localhost/mqtt
 * options:
 *  - username
 *  - password
 *  - passphrase
 *  - key 
 *  - cert
 *  - ca
 */
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

describe("Connect to broker", async function() {
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
})