"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mqtt = _interopRequireDefault(require("mqtt"));

var _events = require("events");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

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
      var brokerUrl = this.options.brokerUrl;
      this.mqttClient = _mqtt["default"].connect(brokerUrl, this.options);
      var client = this.client;
      this.mqttClient.on('reconnect', function () {
        client.emit('reconnect');
      });
      this.mqttClient.on('error', function (err) {
        client.emit('error', err);
      });
      this.mqttClient.on('message', function (topic, message) {
        client.emit('message', topic, message);
      });
      cb && cb();
    }
  }, {
    key: "end",
    value: function end(cb) {
      this.mqttClient.end(cb);
    }
    /**
     * 
     * @see https://github.com/mqttjs/MQTT.js#publish
     * @param {*} topic 
     * @param {*} message 
     * @param {*} options 
     * @param {*} cb 
     */

  }, {
    key: "publish",
    value: function publish(topic, message, options, cb) {
      this.mqttClient.publish(topic, message, options, cb);
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

  }, {
    key: "subscribe",
    value: function subscribe(topic, options, cb) {
      this.mqttClient.subscribe(topic, options, cb);
    }
    /**
     * 
     * @see @see https://github.com/mqttjs/MQTT.js#unsubscribe
     * @param {*} topic 
     * @param {*} cb 
     */

  }, {
    key: "unsubscribe",
    value: function unsubscribe(topic, cb) {
      this.mqttClient.unsubscribe(topic, cb);
    }
  }]);

  return Adapter;
}(_events.EventEmitter);

exports["default"] = Adapter;