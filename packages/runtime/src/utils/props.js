export const extractPropsAndEvents = (vdom) => {
  const { on: events = {}, ...props } = vdom;

  delete props.key;

  return { props, events };
};
