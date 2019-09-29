"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AudioPlayerCore =
/*#__PURE__*/
function () {
  // Configuraciones globales
  // Variables de instancias de los reproductores
  function AudioPlayerCore(configs) {
    _classCallCheck(this, AudioPlayerCore);

    _defineProperty(this, "_configs", void 0);

    _defineProperty(this, "_player_one", void 0);

    _defineProperty(this, "_player_two", void 0);

    _defineProperty(this, "muteValue", false);

    _defineProperty(this, "_playerCounter", document.getElementById("playerCounter"));

    _defineProperty(this, "_playerCounterTwo", document.getElementById("playerCounterTwo"));

    _defineProperty(this, "_playerTimer", void 0);

    _defineProperty(this, "_time", 0);

    // Configuracions globales
    this._configs = configs.PlayerConfigurations; // URLs

    this._URL_ONE = configs.URL_ONE;
    this._URL_TWO = configs.URL_TWO; // Llamar al metodo para crear los reproductores

    this._createPlayer();
  }

  _createClass(AudioPlayerCore, [{
    key: "_timer",
    value: function _timer() {
      var _this = this;

      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (e) {
        this._time = 0;
        this._playerCounter.innerHTML = "00:00";
        clearInterval(this._playerTimer);
      } else {
        // Timer
        this._playerTimer = setInterval(function () {
          _this._time++;
          var minutes = "".concat(Math.floor(_this._time / 60)),
              seconds = "".concat(_this._time - minutes * 60);
          var minutesFormat = minutes.length <= 1 ? "0".concat(minutes) : minutes,
              secondsFormat = seconds.length <= 1 ? "0".concat(seconds) : seconds; // Actualizar valor en HTML

          _this._playerCounter.innerHTML = "-".concat(minutesFormat, ":").concat(secondsFormat);
          _this._playerCounterTwo.innerHTML = "-".concat(minutesFormat, ":").concat(secondsFormat);
        }, 1000);
      }
    } // Metodo para crear las instancias "Paraleles" de los reproductores

  }, {
    key: "_createPlayer",
    value: function _createPlayer() {
      var _this2 = this;

      // Variable de control
      var control = false;
      var control_2 = false; // Crear primera instancia del reproductor

      this._player_one = new Howl({ ...this._configs,
        onplay: function onplay() {
          document.getElementById("LoaderPlayerC").classList.add("hidde");
          document.getElementById("btnPlay").classList.remove("hidde");
          document.getElementById("btnPlay").innerHTML = "stop";

          _this2._timer();
        },
        onstop: function onstop() {
          document.getElementById("btnPlay").innerHTML = "play_arrow";

          _this2._timer(true);
        },
        src: this._URL_ONE,
        onloaderror: function onloaderror(e) {
          console.log("Hola23232");
          control = true;

          if (_this2._player_two) {
            _this2._player_one.unload();
          }
        },
        onload: function onload(e) {
          document.getElementById("serverName").innerText = "UANL";
          document.getElementById("LoaderPlayerC").classList.add("hidde");
          document.getElementById("btnPlay").classList.remove("hidde");
          control = false;
          if (_this2._player_two) _this2._player_two.unload();
        }
      }); // Crear segunda instancias del reproductor

      this._player_two = new Howl({ ...this._configs,
        onplay: function onplay() {
          document.getElementById("btnPlay").innerHTML = "stop";
          document.getElementById("LoaderPlayerC").classList.add("hidde");
          document.getElementById("btnPlay").classList.remove("hidde");

          _this2._timer();
        },
        onstop: function onstop() {
          document.getElementById("btnPlay").innerHTML = "play_arrow";

          _this2._timer(true);
        },
        src: this._URL_TWO,
        onload: function onload(e) {
          document.getElementById("serverName").innerText = "Global";
          document.getElementById("LoaderPlayerC").classList.add("hidde");
          document.getElementById("btnPlay").classList.remove("hidde");
        },
        onloaderror: function onloaderror(e) {
          if (control) {
            console.log("Reintentando en 6 segundos");
            document.getElementById("serverName").innerText = "Buscando";
            setTimeout(function () {
              _this2._createPlayer();
            }, 6000);
          }
        }
      });
    }
  }, {
    key: "_who",
    value: function _who() {
      return (this._player_one.state() === "loaded" ? this._player_one : false) || (this._player_two.state() === "loaded" ? this._player_two : false);
    }
  }, {
    key: "play_stop",
    value: function play_stop() {
      if (this._who().playing()) {
        this._who().stop();

        return false;
      } else {
        document.getElementById("LoaderPlayerC").classList.remove("hidde");
        document.getElementById("btnPlay").classList.add("hidde");

        this._who().play();

        return true;
      }
    }
  }, {
    key: "volume",
    value: function volume() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      this._who().volume(e / 100);
    }
  }, {
    key: "mute",
    value: function mute() {
      if (this.muteValue) {
        this.muteValue = false;

        this._who().mute(false);
      } else {
        this.muteValue = true;

        this._who().mute(true);
      }
    }
  }]);

  return AudioPlayerCore;
}();

var AudioPlayerControlsInterface =
/*#__PURE__*/
function (_AudioPlayerCore) {
  _inherits(AudioPlayerControlsInterface, _AudioPlayerCore);

  function AudioPlayerControlsInterface(cfgs) {
    var _this3;

    _classCallCheck(this, AudioPlayerControlsInterface);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(AudioPlayerControlsInterface).call(this, cfgs));

    _defineProperty(_assertThisInitialized(_this3), "btnPlay", document.getElementById("btnPlay"));

    _defineProperty(_assertThisInitialized(_this3), "btnVolume", document.getElementById("btnVolume"));

    _defineProperty(_assertThisInitialized(_this3), "iconVolume", document.getElementById("iconVolume"));

    _this3.btnPlay.addEventListener("click", function () {
      _this3.play_stop();
    });

    _this3.btnVolume.addEventListener("change", function (e) {
      _this3.volume(_this3.btnVolume.value);

      _this3.iconVolume.innerHTML = _this3.getVolumeIconName();
    });

    _this3.iconVolume.addEventListener("click", function () {
      _this3.mute();

      if (_this3.muteValue) {
        _this3.iconVolume.innerHTML = "volume_off";
      } else {
        _this3.iconVolume.innerHTML = _this3.getVolumeIconName();
      }
    });

    return _this3;
  }

  _createClass(AudioPlayerControlsInterface, [{
    key: "getVolumeIconName",
    value: function getVolumeIconName() {
      switch (true) {
        case this.btnVolume.value < 33.33:
          return "volume_mute";

        case this.btnVolume.value >= 33.33 && this.btnVolume.value < 66.66:
          return "volume_down";

        case this.btnVolume.value >= 66.66:
          return "volume_up";
      }
    }
  }]);

  return AudioPlayerControlsInterface;
}(AudioPlayerCore);

var AudioPlayer =
/*#__PURE__*/
function (_AudioPlayerControlsI) {
  _inherits(AudioPlayer, _AudioPlayerControlsI);

  function AudioPlayer(cfgs) {
    _classCallCheck(this, AudioPlayer);

    return _possibleConstructorReturn(this, _getPrototypeOf(AudioPlayer).call(this, cfgs));
  }

  return AudioPlayer;
}(AudioPlayerControlsInterface);

window.addEventListener("DOMContentLoaded", function () {
  // Crear reproductor
  new AudioPlayer({
    PlayerConfigurations: {
      html5: true,
      autoplay: true,
      format: ["aac"]
    },
    URL_ONE: "http://148.234.33.156/stream-he?type=.aac",
    URL_TWO: "http://us4.internet-radio.com:8066/stream?type=.aac"
  });
});