const CATCH_ALL_ROUTE = "*";

const routeHasParams = ({ path }) => {
  return path.includes(":");
};

const extractQuery = (path) => {
  const queryIndex = path.indexOf("?");

  if (queryIndex === -1) {
    return {};
  }

  const search = new URLSearchParams(path.slice(queryIndex + 1));

  return Object.fromEntries(search.entries());
};

const makeRouteWithoutParamsRegex = ({ path }) => {
  if (path === CATCH_ALL_ROUTE) {
    return new RegExp("^.*$");
  }

  return new RegExp(`^${path}$`);
};

const makeRouteWithParamsRegex = ({ path }) => {
  const regex = path.replace(
    /:([^/]+)/g,
    (_, paramName) => `(?<${paramName}>[^/]+)`
  );

  return new RegExp(`^${regex}$`);
};

const makeMatcherWithParams = (route) => {
  const regex = makeRouteWithParamsRegex(route);
  const isRedirect = typeof route.redirect === "string";

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path);
    },
    extractParams(path) {
      const { groups } = regex.exec(path);

      return groups;
    },
    extractQuery,
  };
};

const makeMatcherWithoutParams = (route) => {
  const regex = makeRouteWithoutParamsRegex(route);
  const isRedirect = typeof route.redirect === "string";

  return {
    route,
    isRedirect,
    checkMatch(path) {
      return regex.test(path);
    },
    extractParams() {
      return {};
    },
    extractQuery,
  };
};

export const makeRouteMatcher = (route) => {
  return routeHasParams(route)
    ? makeMatcherWithParams(route)
    : makeMatcherWithoutParams(route);
};
