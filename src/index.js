import mqtt from 'mqtt'
import { EventEmitter } from 'events'

export default class Adapter extends EventEmitter {
  constructor(client) {
    super()
    this.client = client
    this.options = client.options
  }

  connect(cb) {
    let { brokerUrl } = this.options
    this.mqttClient = mqtt.connect(brokerUrl, this.options)

    let client = this.client

    this.mqttClient.on('reconnect', () => {
      client.emit('reconnect')
    })

    this.mqttClient.on('error', (err) => {
      client.emit('error', err)
    })

    this.mqttClient.on('message', (topic, message) => {
      client.emit('message', topic, message)
    })

    cb && cb()
  }

  end(cb) {
    this.mqttClient.end(cb)
  }

  /**
   * 
   * @see https://github.com/mqttjs/MQTT.js#publish
   * @param {*} topic 
   * @param {*} message 
   * @param {*} options 
   * @param {*} cb 
   */
  publish(topic, message, options, cb) {
    this.mqttClient.publish(topic, message, options, cb)
  }

  /**
   * topic = 'single_topic' | ['topic_1', 'topic_2'] | {'test1': {qos: 0}, 'test2': {qos: 1}}
   * 
   * @see https://github.com/mqttjs/MQTT.js#subscribe
   * @param {*} topic
   * @param {*} message 
   * @param {*} options 
   * @param {*} cb 
   */
  subscribe(topic, options, cb) {
    this.mqttClient.subscribe(topic, options, cb)
  }

  /**
   * 
   * @see @see https://github.com/mqttjs/MQTT.js#unsubscribe
   * @param {*} topic 
   * @param {*} cb 
   */
  unsubscribe(topic, cb) {
    this.mqttClient.unsubscribe(topic, cb)
  }
}