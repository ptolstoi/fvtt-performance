Hooks.once("init", () => {
  game.settings.register("Performance", "enabledGPU", {
    name: "Reduce GPU usage (Reload required)",
    default: true,
    type: Boolean,
    scope: "client",
    config: true,
    hint: "Reduces GPU usage to draw only when actual changes happen. (Not compatible with some modules)",
  });
});

let HasteTimer;
let isMouseDown = false;
let isCtrl = false;

function ActivateRendering(duration = 2000) {
  if (isMouseDown === false) {
    clearTimeout(HasteTimer);

    canvas.app.start();

    HasteTimer = window.setTimeout(function () {
      if (isMouseDown === false) {
        canvas.app.ticker.maxFPS = 30;

        canvas.app.stop();
      }
    }, duration);
  }
}

Hooks.once("canvasReady", () => {
  if (game.settings.get("Performance", "enabledGPU")) {
    ActivateRendering(3000);

    Hooks.on("hoverToken", () => {
      ActivateRendering();
    });
    Hooks.on("hoverNote", () => {
      ActivateRendering();
    });

    Hooks.on("hoverDoor", () => {
      ActivateRendering();
    });

    Hooks.on("createToken", () => {
      ActivateRendering();
    });
    Hooks.on("deleteActor", () => {
      ActivateRendering();
    });
    Hooks.on("deleteToken", () => {
      ActivateRendering();
    });
    Hooks.on("updateToken", () => {
      ActivateRendering();
    });
    Hooks.on("updateScene", () => {
      ActivateRendering();
    });
    Hooks.on("updateUser", () => {
      ActivateRendering();
    });
    Hooks.on("canvasPan", () => {
      ActivateRendering();
    });

    window.addEventListener("keyup", () => {
      ActivateRendering();
    });

    window.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      isCtrl = e.ctrlKey;
      canvas.app.start();
    });
    window.addEventListener("mouseup", (e) => {
      isMouseDown = false;
      if (isCtrl === false) {
        ActivateRendering(1000);
      }
    });

    game.socket.on("modifyEmbeddedDocument", () => {
      ActivateRendering();
    });
    game.socket.on("userActivity", () => {
      ActivateRendering();
    });

    game.socket.on("ActivateRendering", () => {
      ActivateRendering();
    });
  }
});
