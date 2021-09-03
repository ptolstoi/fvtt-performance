import "./style.css";

Hooks.once("init", () => {
  game.settings.register("performance", "enabledGPU", {
    name: "Reduce GPU usage (Reload required)",
    default: true,
    type: Boolean,
    scope: "client",
    config: true,
    hint: "Reduces GPU usage to draw only when actual changes happen. (Not compatible with some modules)",
  });
});

let stopRenderingTimer: number;
let isMouseDown = false;
let isCtrl = false;

const pauseRenderingIn = (duration: number) => {
  const app = canvas && "app" in canvas && canvas.app;

  if (!app) {
    return;
  }

  if (isMouseDown === false) {
    clearTimeout(stopRenderingTimer);

    app.start();

    stopRenderingTimer = window.setTimeout(() => {
      if (isMouseDown === false) {
        app.ticker.maxFPS = 30;

        app.stop();
      }
    }, duration);
  }
};

Hooks.once("canvasReady", () => {
  const { app } = (canvas && canvas.ready && canvas) || {};

  if (game.settings.get("performance", "enabledGPU")) {
    pauseRenderingIn(3000);

    const pauseRendering = () => {
      pauseRenderingIn(2000);
    };

    Hooks.on("hoverToken", pauseRendering);
    Hooks.on("hoverNote", pauseRendering);

    Hooks.on("hoverDoor", pauseRendering);

    Hooks.on("createToken", pauseRendering);
    Hooks.on("deleteActor", pauseRendering);
    Hooks.on("deleteToken", pauseRendering);
    Hooks.on("updateToken", pauseRendering);
    Hooks.on("updateScene", pauseRendering);
    Hooks.on("updateUser", pauseRendering);
    Hooks.on("canvasPan", pauseRendering);

    window.addEventListener("keyup", pauseRendering);

    window.addEventListener("mousedown", (e) => {
      isMouseDown = true;
      isCtrl = e.ctrlKey;
      app?.start();
    });

    window.addEventListener("mouseup", () => {
      isMouseDown = false;
      if (isCtrl === false) {
        pauseRenderingIn(1000);
      }
    });

    window.addEventListener("touchstart", () => {
      isMouseDown = true;
      app?.start();
    });

    window.addEventListener("touchup", () => {
      isMouseDown = false;
      pauseRenderingIn(1000);
    });

    window.addEventListener("pointerdown", () => {
      isMouseDown = true;
      app?.start();
    });

    window.addEventListener("pointerup", () => {
      isMouseDown = false;
      pauseRenderingIn(1000);
    });

    game.socket.on("modifyEmbeddedDocument", pauseRendering);
    game.socket.on("userActivity", pauseRendering);

    game.socket.on("ActivateRendering", pauseRendering);
  }
});
