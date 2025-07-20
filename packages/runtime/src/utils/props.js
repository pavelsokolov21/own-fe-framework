export const extractPropsAndEvents = (vdom) => {
  const { on: events = {}, ...props } = vdom;

  return { props, events };
};
