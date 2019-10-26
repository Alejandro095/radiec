class AudioPlayerCore {
  // Configuraciones globales
  _configs;

  // Variables de instancias de los reproductores
  _player_one;
  _player_two;

  muteValue = false;

  _playerCounter = document.getElementById("playerCounter");
  _playerCounterTwo = document.getElementById("playerCounterTwo");
  _playerTimer;
  _time = 0;

  constructor(configs) {
    // Configuracions globales
    this._configs = configs.PlayerConfigurations;
    // URLs
    this._URL_ONE = configs.URL_ONE;
    this._URL_TWO = configs.URL_TWO;

    // Llamar al metodo para crear los reproductores
    this._createPlayer();
  }

  _timer(e = false) {
    if (e) {
      this._time = 0;
      this._playerCounter.innerHTML = "00:00";
      clearInterval(this._playerTimer);
    } else {
      // Timer
      this._playerTimer = setInterval(() => {
        this._time++;

        let minutes = `${Math.floor(this._time / 60)}`,
          seconds = `${this._time - minutes * 60}`;

        let minutesFormat = minutes.length <= 1 ? `0${minutes}` : minutes,
          secondsFormat = seconds.length <= 1 ? `0${seconds}` : seconds;

        // Actualizar valor en HTML
        this._playerCounter.innerHTML = `-${minutesFormat}:${secondsFormat}`;
        this._playerCounterTwo.innerHTML = `-${minutesFormat}:${secondsFormat}`;
      }, 1000);
    }
  }

  // Metodo para crear las instancias "Paraleles" de los reproductores
  _createPlayer() {
    // Variable de control
    let control = false;

    // Crear primera instancia del reproductor
    this._player_one = new Howl({
      ...this._configs,
      onplay: () => {
        document.getElementById("LoaderPlayerC").classList.add("hidde");
        document.getElementById("btnPlay").classList.remove("hidde");
        document.getElementById("btnPlay").innerHTML = "stop";
        this._timer();
      },
      onstop: () => {
        document.getElementById("btnPlay").innerHTML = "play_arrow";
        this._timer(true);
      },
      src: this._URL_ONE,
      onloaderror: e => {
        control = true;
        if (this._player_two) {
          this._player_one.unload();
        }
      },
      onload: e => {
        document.getElementById("serverName").innerText = "UANL";
        document.getElementById("LoaderPlayerC").classList.add("hidde");
        document.getElementById("btnPlay").classList.remove("hidde");
        control = false;
        if (this._player_two) this._player_two.unload();
      },
      onplayerror: function() {
        this._player_one.once("unlock", function() {
          this._player_one.play();
        });
      }
    });

    // Crear segunda instancias del reproductor
    this._player_two = new Howl({
      ...this._configs,
      onplay: () => {
        document.getElementById("btnPlay").innerHTML = "stop";
        document.getElementById("LoaderPlayerC").classList.add("hidde");
        document.getElementById("btnPlay").classList.remove("hidde");
        this._timer();
      },
      onstop: () => {
        document.getElementById("btnPlay").innerHTML = "play_arrow";
        this._timer(true);
      },
      src: this._URL_TWO,
      onload: e => {
        document.getElementById("serverName").innerText = "Global";
        document.getElementById("LoaderPlayerC").classList.add("hidde");
        document.getElementById("btnPlay").classList.remove("hidde");
      },
      onloaderror: e => {
        if (control) {
          console.log("Reintentando en 6 segundos");
          document.getElementById("serverName").innerText = "Buscando";
          setTimeout(() => {
            this._createPlayer();
          }, 6000);
        }
      },
      onplayerror: function() {
        this._player_two.once("unlock", function() {
          this._player_two.play();
        });
      }
    });
  }

  _who() {
    return (
      (this._player_one.state() === "loaded" ? this._player_one : false) ||
      (this._player_two.state() === "loaded" ? this._player_two : false)
    );
  }

  play_stop() {
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

  volume(e = 1) {
    this._who().volume(e / 100);
  }

  mute() {
    if (this.muteValue) {
      this.muteValue = false;
      this._who().mute(false);
    } else {
      this.muteValue = true;
      this._who().mute(true);
    }
  }
}

class AudioPlayerControlsInterface extends AudioPlayerCore {
  btnPlay = document.getElementById("btnPlay");
  btnVolume = document.getElementById("btnVolume");
  iconVolume = document.getElementById("iconVolume");

  constructor(cfgs) {
    super(cfgs);

    this.btnPlay.addEventListener("click", () => {
      this.play_stop();
    });

    this.btnVolume.addEventListener("change", e => {
      this.volume(this.btnVolume.value);
      this.iconVolume.innerHTML = this.getVolumeIconName();
    });

    this.iconVolume.addEventListener("click", () => {
      this.mute();
      if (this.muteValue) {
        this.iconVolume.innerHTML = "volume_off";
      } else {
        this.iconVolume.innerHTML = this.getVolumeIconName();
      }
    });
  }

  getVolumeIconName() {
    switch (true) {
      case this.btnVolume.value < 33.33:
        return "volume_mute";
      case this.btnVolume.value >= 33.33 && this.btnVolume.value < 66.66:
        return "volume_down";
      case this.btnVolume.value >= 66.66:
        return "volume_up";
    }
  }
}

class AudioPlayer extends AudioPlayerControlsInterface {
  constructor(cfgs) {
    super(cfgs);
  }
}

window.addEventListener("DOMContentLoaded", () => {
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
