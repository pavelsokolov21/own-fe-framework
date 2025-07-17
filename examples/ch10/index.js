import { h, defineComponent, hFragment } from "own-fe-framework";

const sleep = (ms) => {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, ms);
  });
};

const Root = defineComponent({
  state() {
    return {
      isLoading: false,
      cocktail: null,
    };
  },
  render() {
    const { cocktail, isLoading } = this.state;

    const hasCocktail = !!cocktail;

    const onGetCocktail = () => {
      this.updateState({
        isLoading: true,
      });

      this.loadCocktail()
        .then(({ strDrink, strInstructions, strDrinkThumb }) => {
          this.updateState({
            cocktail: {
              name: strDrink,
              instruction: strInstructions,
              href: strDrinkThumb,
            },
          });
        })
        .finally(() => {
          this.updateState({
            isLoading: false,
          });
        });
    };

    if (isLoading) {
      return h("img", {
        display: "block",
        width: "500px",
        height: "500px",
        src: "https://media1.tenor.com/m/ako25het-18AAAAd/%D0%BA%D0%BE%D1%82-%D0%BA%D1%80%D1%83%D1%82%D0%B8%D1%82%D1%8C%D1%81%D1%8F-%D0%BA%D0%BE%D1%82.gif",
      });
    }

    return hasCocktail
      ? hFragment([
          h("h1", {}, [cocktail.name]),
          h("p", {}, [cocktail.instruction]),
          h("img", {
            src: cocktail.href,
            style: {
              display: "block",
              width: "200px",
              height: "200px",
            },
          }),
          h(
            "button",
            {
              on: {
                click: onGetCocktail,
              },
            },
            ["Get another cocktail"]
          ),
        ])
      : hFragment([
          h("h1", {}, ["Random cocktail"]),
          h(
            "button",
            {
              on: {
                click: onGetCocktail,
              },
            },
            ["Get a cocktail"]
          ),
        ]);
  },
  loadCocktail() {
    return Promise.all([
      // fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // })
      //   .then((res) => res.json())
      //   .then((data) => data.drinks[0]),
      Promise.resolve({
        strDrink: "Билли Джин насрал в кувшин",
        strInstructions: "Возьму кувшин и насри в него",
        strDrinkThumb:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9wm0VDDdumSvPs_JpyG7uM6RtvAZRljOhOQ&s",
      }),
      sleep(3_200),
    ]).then((d) => {
      console.log(d);

      return d[0];
    });
  },
});

const root = new Root();

root.mount(document.querySelector("body"));
