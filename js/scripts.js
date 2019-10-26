// Dipatch Event Function
let fireEvent = e =>
  window.dispatchEvent(new CustomEvent("PlayerLoad", { detail: e }));

// Query Selector Function
let $ = e =>
  e.charAt(0) === "#"
    ? document.getElementsByClassName(e.substr(1))
    : document.getElementById(e);

// ----------------------------------------------------------------

let UI = {
  Play: function() {
    this.Load();
    if (howl_one.playing() || howl_two.playing()) {
      $("btnPlay").innerText = "stop";
    } else {
      $("btnPlay").innerText = "play_arrow";
    }
  },

  Load: () => {
    howl_one.state() == "loaded" || howl_two.state() == "loaded"
      ? [
          $("LoaderPlayerC").classList.add("hidde"),
          $("btnPlay").classList.remove("hidde")
        ]
      : [
          $("LoaderPlayerC").classList.remove("hidde"),
          $("btnPlay").classList.add("hidde")
        ];
  },

  Server: server_id => {
    const servers = ["Global", "UANL"];
    $("serverName").innerText = servers[server_id];
  },

  Volume: () => {}
};

// Links de streaming
const keys = {
  key_one: () =>
    window.atob(
      "aHR0cHM6Ly93d3cucmFkaWFudG1lZGlhcGxheWVyLmNvbS9tZWRpYS9iYmItMzYwcC5tcDQ="
    ),
  key_two: () =>
    window.atob(
      "aHR0cHM6Ly93d3cucmFkaWFudG1lZGlhcGxheWVyLmNvbS9tZWRpYS9iYmItMzYwcC5tcDQ="
    )
};

let howl_one,
  howl_two,
  playerErrors = new Array();

let cfg = {
  Global: {
    html5: true,
    autoplay: true,
    volume: 0.5,
    format: ["aac"],
    onplay: function() {
      UI.Play();
    },
    onstop: function() {
      UI.Play(false);
    }
  },
  PlayerOne: {
    src: "http://us4.internet-radio.com:8066/stream?type=.aac",
    onloaderror: function() {
      // Eliminar de cache esta misma instacia
      howl_one.unload();
      // Disparar el evento de error en el Player 1
      fireEvent({
        Type: "Error",
        Content: { Player: 1, Message: "Error to load" }
      });
      // Activar el spinner (Loader)
      UI.Load();
    },
    onload: function() {
      // Eliminar de cache esta misma instacia
      howl_two.unload();
      // Eliminar el spinner (Loader)
      UI.Load(false);
    },
    onplay: function() {
      // Heredar funciones
      cfg.Global.onplay();
      // Actualizar servidor
      UI.Server(1);
    }
  },
  PlayerTwo: {
    src: "http://us4.internet-radio.com:8066/stream?type=.aac",
    onloaderror: function() {
      // Eliminar de cache esta misma instacia
      howl_two.unload();
      // Dispara el evento de error en la segunda instancia
      fireEvent({
        Type: "Error",
        Content: { Player: 2, Message: "Error to load" }
      });
      // Activar el spinner
      UI.Load();
    },
    onload: function() {
      // Desactivar el spinner
      UI.Load(false);
    },
    onplay: function() {
      // Heredar funciones
      cfg.Global.onplay();
      // Actualizar servidor
      UI.Server(0);
    }
  }
};

let createPlayer = e => {
  // Disparar evento para reiniciar el array de errores
  fireEvent({ Type: "Reset" });
  // Crear primera instancia del reproductor
  howl_one = new Howl({ ...e.Global, ...e.PlayerOne });

  // Crear segunda instancia del reproductor
  howl_two = new Howl({ ...e.Global, ...e.PlayerTwo });
};

window.addEventListener("PlayerLoad", e => {
  //  Comprobar el tipo de error
  if (e.detail.Type === "Error") {
    // Agregarlo al array
    playerErrors.push(e.detail);
    // Comprobar la cantidad de errores
    if (playerErrors.length >= 2) {
      console.log("Reintentando en 6 segundos");
      // Activar spinner
      UI.Load();
      // Volver a ejecutar la misma funcion (CreatePlayer) despues de 6 segundos
      setTimeout(() => {
        createPlayer(cfg);
      }, 6000);
    }
  }
  // Limpiar el array de errores
  if (e.detail.Type === "Reset") playerErrors = [];
});

// onplay: () => {},
//     onstop: () => {},
//     onload: () => {},
//     onloaderror: () => {},
//     onplayerror: () => {}

// Init
createPlayer(cfg);

// Volume Functions
$("btnVolume").addEventListener("change", function(e) {
  save_volume(this.value / 100);

  (howl_one || howl_two).volume(this.value / 100);
});

window.addEventListener("DOMContentLoaded", () => {
  $("btnVolume").value = get_volume();

  $("btnPlay").addEventListener("click", e => {
    if ((howl_one || howl_two).playing()) {
      (howl_one || howl_two).stop();
    } else {
      $("LoaderPlayerC").classList.remove("hidde");
      $("btnPlay").classList.add("hidde");
      (howl_one || howl_two).play();
    }
  });
});

let get_volume = () =>
  (JSON.parse(localStorage.getItem("volume_config")).volume || 1) * 100;

let save_volume = volume_data => {
  let data_LocalStorage =
    JSON.parse(localStorage.getItem("volume_config")) || false;
  if (data_LocalStorage) {
    data_LocalStorage.volume = volume_data;
    localStorage.setItem("volume_config", JSON.stringify(data_LocalStorage));
  } else {
    localStorage.setItem(
      "volume_config",
      JSON.stringify({ volume: volume_data })
    );
  }
};
