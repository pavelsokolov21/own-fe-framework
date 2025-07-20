import { h, defineComponent } from "own-fe-framework";

const ListItem = defineComponent({
  render() {
    const { value } = this.props;

    return h("li", {}, [value]);
  },
});

const List = defineComponent({
  render() {
    const { items } = this.props;

    return h(
      "ul",
      {},
      items.map((v) => {
        return h(ListItem, { value: v });
      })
    );
  },
});

const list = new List({ items: ["foo", "bar", "bazz"] });

list.mount(document.querySelector("body"));
