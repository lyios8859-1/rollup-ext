import clean from "@timly/plugin-clean";

const input = "src/index.ts";

export default [
  {
    input,
    output: [
      {
        format: "es",
        dir: "./dest/es",
        entryFileNames: "[name].mjs",
        chunkFileNames: "[name].mjs"
      }
    ],
    plugins: [
      clean({
        verbose: true
      })
    ]
  },
  {
    input,
    output: {
      format: "cjs",
      dir: "./dest/cjs",
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name].cjs"
    },

    plugins: [clean()]
  },
  {
    input,
    output: {
      format: "umd",
      dir: "./dest/umd",
      entryFileNames: "[name].umd.js",
      name: "test",
      plugins: [clean()],
      sourcemap: true
    }
  }
];
