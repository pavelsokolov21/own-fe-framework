import { mountDOM } from "./mount-dom";
import { destroyDOM } from "./destroy-dom";
import { patchDOM } from "./patch-dom";
import { DOM_TYPES, extractChildren } from "./h";
import { hasOwnProperty } from "./objects";
import equal from "fast-deep-equal";
import { Dispatcher } from "./dispatcher";
import { noop } from "./utils/common";

export function defineComponent({
  render,
  state,
  onMounted = noop,
  onUnmounted = noop,
  ...methods
}) {
  class Component {
    #vdom = null;
    #hostEl = null;
    #eventHandlers = null;
    #parentComponent = null;
    #dispatcher = new Dispatcher();
    #subscriptions = [];
    #isMounted = false;

    constructor(props = {}, eventHandlers = {}, parentComponent = null) {
      this.props = props;
      this.state = state ? state(props) : {};
      this.#eventHandlers = eventHandlers;
      this.#parentComponent = parentComponent;
    }

    updateProps(props) {
      const newProps = { ...this.props, ...props };

      if (equal(props, newProps)) {
        return;
      }

      this.props = newProps;
      this.#patch();
    }

    updateState(state) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }

    render() {
      return render.call(this);
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error("Component is already mounted");
      }

      this.#vdom = this.render();
      mountDOM(this.#vdom, hostEl, index, this);
      this.#wireEventHandlers();

      this.#hostEl = hostEl;
      this.#isMounted = true;
    }

    umount() {
      if (!this.#isMounted) {
        throw new Error("Component is not mounted");
      }

      destroyDOM(this.#vdom);
      this.#subscriptions.forEach((unsub) => unsub());

      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
      this.#subscriptions = [];
    }

    emit(eventName, payload) {
      this.#dispatcher.dispatch(eventName, payload);
    }

    onMounted() {
      return Promise.resolve(onMounted.call(this));
    }

    onUnmounted() {
      return Promise.resolve(onUnmounted.call(this));
    }

    #patch() {
      if (!this.#isMounted) {
        throw new Error("Component is not mounted");
      }

      const vdom = this.render();
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    }

    get elements() {
      if (this.#vdom == null) {
        return [];
      }

      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).flatMap(
          ({ el, type, component }) => {
            return type === DOM_TYPES.COMPONENT ? component.elements : [el];
          }
        );
      }

      return [this.#vdom.el];
    }

    #wireEventHandler(eventName, handler) {
      return this.#dispatcher.subscribe(eventName, (payload) => {
        if (this.#parentComponent) {
          handler.call(this.#parentComponent, payload);
        } else {
          handler(payload);
        }
      });
    }

    #wireEventHandlers() {
      this.#subscriptions = Object.entries(this.#eventHandlers).map(
        ([eventName, handler]) => {
          return this.#wireEventHandler(eventName, handler);
        }
      );
    }

    get firstElement() {
      return this.elements[0];
    }

    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return Array.from(this.#hostEl.children).indexOf(this.firstElement);
      }

      return 0;
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      throw new Error(`Method "${methodName}" already exists in the component`);
    }

    Component.prototype[methodName] = methods[methodName];
  }

  return Component;
}
