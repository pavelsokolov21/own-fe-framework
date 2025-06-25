export const isNotEmptyString = (str) => {
  return str !== "";
};

export const isNotBlankOrEmptyString = (str) => {
  return isNotEmptyString(str.trim());
};
