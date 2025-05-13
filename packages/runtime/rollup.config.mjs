import cleanup from "rollup-plugin-cleanup";
import filesize from "rollup-plugin-filesize";

/**
 * @type {import('rollup').MergedRollupOptions}
 */
export default {
  input: "src/index.js",
  plugins: [cleanup()],
  output: [
    {
      file: "dist/own-fe-framework.js",
      format: "esm",
      plugins: [filesize()],
    },
  ],
};
