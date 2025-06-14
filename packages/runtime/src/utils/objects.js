export const objectsDiff = (obj1, obj2) => {
  const [firstKeys, secondKeys] = [obj1, obj2].map((obj) => Object.keys(obj));

  return {
    added: secondKeys.filter((key) => !Object.hasOwn(obj1, key)),
    removed: firstKeys.filter((key) => !Object.hasOwn(obj2, key)),
    updated: secondKeys.filter((key) => {
      return Object.hasOwn(obj1, key) && obj1[key] !== obj2[key];
    }),
  };
};
