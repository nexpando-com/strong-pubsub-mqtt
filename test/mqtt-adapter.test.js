import 'babel-polyfill'
import Client from 'strong-pubsub'
import Adapter from '../src/index'
import { promisify } from 'util'
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

client.asyncConnect = promisify(client.connect)

describe("Connect to broker", async function() {
  
  // trigger event connect
  client.on('connect', () => {

    const { clientId } = client.adapter.mqttClient.options
    
    console.log('===========[Connected] [mqtt_client_id]: ', clientId)
    console.log('View full information at http://localhost/haproxy')
    
    // subscribe topic 'test'
    client.subscribe('test')
    
    // simulate event publish to topic every 1234s
    setInterval(() => {
      client.publish('test', `[From ${clientId}] - now: ${Date.now()}`)
    }, 1234)
  })
  
  // Connect to server
  try {
    await client.asyncConnect()
  } catch (e) {
    console.log('[error]', e)
  }
  
  client.on('error', (err) => {
    console.log(err)
  })

  // catch message
  client.on('message', function(topic, message, packet) {
    console.log(`[Incoming message][${topic}]: ${message.toString()}`)
  })
})