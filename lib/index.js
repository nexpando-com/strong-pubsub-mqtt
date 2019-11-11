"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _kafkaNode = _interopRequireDefault(require("kafka-node"));

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var defaultConnectRetryOptions = {
  forever: true,
  retries: 5,
  factor: 3,
  minTimeout: 1 * 1000,
  maxTimeout: 60 * 1000,
  randomize: true
};
var kAFKA_CLIENT_ID = process.env.kAFKA_CLIENT_ID || 'strong-pubsub-kafka';
var KAFKA_CONSUMER_GROUP_ID = process.env.KAFKA_CONSUMER_GROUP_ID || 'strong-pubsub-kafka';
var KAFKA_HOSTS = process.env.KAFKA_HOSTS || 'localhost:9092';
var kafkaOptions = {
  kafkaHost: KAFKA_HOSTS,
  clientId: kAFKA_CLIENT_ID,
  autoConnect: true,
  connectRetryOptions: defaultConnectRetryOptions
};
var consumerGroupOptions = {
  kafkaHost: KAFKA_HOSTS,
  groupId: KAFKA_CONSUMER_GROUP_ID,
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  encoding: 'utf8',
  fromOffset: 'latest',
  commitOffsetsOnFirstJoin: true,
  outOfRangeOffset: 'earliest',
  onRebalance: function onRebalance(isAlreadyMember, callback) {
    callback();
  } // or null

}; // Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0

var producerOptions = {
  requireAcks: 1,
  ackTimeoutMs: 100,
  partitionerType: 2
};
var ConsumerGroup = _kafkaNode["default"].ConsumerGroup,
    Producer = _kafkaNode["default"].Producer,
    KafkaClient = _kafkaNode["default"].KafkaClient;

var Adapter =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(Adapter, _EventEmitter);

  function Adapter(client) {
    var _this;

    _classCallCheck(this, Adapter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Adapter).call(this));
    _this.client = client;
    _this.options = client.options;
    return _this;
  }

  _createClass(Adapter, [{
    key: "connect",
    value: function connect(cb) {
      this.kafkaClient = new KafkaClient(_objectSpread({}, kafkaOptions, {}, this.options));
      this.producer = new Producer(this.kafkaClient, _objectSpread({}, producerOptions, {}, this.options));
      this.producer.on('ready', function () {
        cb && cb();
      });
      this.producer.on('error', function (error) {
        cb && cb(error);
      });
    }
  }, {
    key: "end",
    value: function end(cb) {
      this.kafkaClient.close(cb);
    }
  }, {
    key: "publish",
    value: function publish(topic, message, options, cb) {
      // 0: No compression, 1: Compress using GZip, 2: Compress using snappy
      var _options$attributes = options.attributes,
          attributes = _options$attributes === void 0 ? 0 : _options$attributes,
          key = options.key,
          partition = options.partition;
      var timestamp = Date.now();
      var payload = {
        topic: topic,
        messages: [message],
        attributes: attributes,
        timestamp: timestamp
      };
      payload = key ? _objectSpread({}, payload, {
        key: key
      }) : payload;
      payload = partition ? _objectSpread({}, payload, {
        partition: partition
      }) : payload;
      var payloads = [payload];
      this.producer.send(payloads, function (error, data) {
        cb && cb(error, data);
      });
    }
  }, {
    key: "subscribe",
    value: function subscribe(topic, options, cb) {
      var kafkaHost = this.options.kafkaHost;

      var _options = _objectSpread({}, consumerGroupOptions, {
        kafkaHost: kafkaHost
      }, options);

      this.consumerGroup = new ConsumerGroup(_options, topic);
      var client = this.client;
      this.consumerGroup.on('connect', function () {
        client.emit('connect', topic, _options);
      });
      this.consumerGroup.on('message', function (message) {
        var topic = message.topic;
        client.emit('message', topic, message);
      });
      this.consumerGroup.on('error', function (error) {
        cb && cb(error, null);
      });
    }
  }, {
    key: "unsubscribe",
    value: function unsubscribe(topic, cb) {
      this.consumerGroup.close(cb);
    }
  }]);

  return Adapter;
}(_events.EventEmitter);

exports["default"] = Adapter;