import clean from "@timly/plugin-clean";
import copy from "@timly/plugin-copy";

const input = "src/index.ts";

// console.log("clean", clean());
// console.log("copy", copy());

export default [
  {
    input,
    output: [
      {
        format: "es",
        dir: "./dist/es",
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name].mjs"
      }
    ],
    plugins: [clean(), copy()]
  },
  {
    input,
    output: {
      format: "cjs",
      dir: "./dist/cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name].cjs"
    },

    plugins: [clean(), copy()]
  }
];
