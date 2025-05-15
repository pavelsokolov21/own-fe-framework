export const withoutNulls = (arr) => {
  return arr.filter((e) => e !== null);
};

export const withoutNullish = (arr) => {
  return arr.filter((e) => e !== null && e !== undefined);
};
