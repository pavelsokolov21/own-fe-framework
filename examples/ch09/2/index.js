import { h, defineComponent } from "own-fe-framework";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FlyingButton = defineComponent({
  state({ width, height }) {
    return {
      width,
      height,
      x: getRandomInt(0, innerWidth - width),
      y: getRandomInt(0, innerHeight - height),
    };
  },

  render() {
    const { x, y, width, height } = this.state;

    return h(
      "button",
      {
        on: {
          click: () => {
            this.updateState({
              x: getRandomInt(0, innerWidth - width),
              y: getRandomInt(0, innerHeight - height),
            });
          },
        },
        style: {
          position: "absolute",
          top: `${y}px`,
          left: `${x}px`,
          transition: "all 0.8s cubic-bezier( 0.68, -0.55, 0.265, 1.55 )",
        },
      },
      ["Move"]
    );
  },
});

const flyingButton = new FlyingButton({ width: 50, height: 30 });

flyingButton.mount(document.querySelector("body"));
