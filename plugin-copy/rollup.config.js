import path from "path";
import fs from "fs";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import isBuiltinModule from "is-builtin-module";
import filesize from "rollup-plugin-filesize";
import { terser } from "rollup-plugin-terser";

import camelCase from "lodash/camelCase";

// const pkg = JSON.parse(fs.readFileSync("./package.json"));
import pkg from "./package.json";
const input = [];

const threePartsFilenameTest = /(.*)\.(.*)\.(.*)/g;
const twoPartsFilenameTest = /(.*)\.(.*)/g;

const dest = "dist";

if (typeof pkg.name !== "string") {
  console.error(`expecting name to be a string in package.json`);
  process.exit(-1);
}

if (!Array.isArray(pkg.files)) {
  console.error(`expecting files to be an array in package.json`);
  process.exit(-1);
}

if (!pkg.files.includes(dest)) {
  console.warn(`no ${dest} in files in package.json`);
}

if (typeof pkg.exports !== "object") {
  console.error("expecting exports object in package.json");
  process.exit(-1);
}

if (
  typeof pkg.umd !== "string" &&
  new RegExp(threePartsFilenameTest, "g").test(pkg.umd)
) {
  console.warn(
    `expecting module field as a string in format name.extension.js in package.json`
  );
}

for (const id in pkg.exports) {
  if (typeof pkg.exports[id] !== "object") {
    console.error(`expecting exports['${id}'] object in package.json`);
    process.exit(-1);
  }
  if (typeof pkg.exports[id].require !== "string") {
    console.error(`expecting exports['${id}'].require string in package.json`);
    process.exit(-1);
  }
  const filename = path.basename(pkg.exports[id].require);
  const filnameParts = new RegExp(twoPartsFilenameTest, "g").exec(filename);

  if ((id == "." ? "index" : path.basename(id)) !== filnameParts[1]) {
    console.error(
      `expecting exports['${id}'].require to reference the same file as exports key`
    );
    process.exit(-1);
  }

  const modernFilename = path.basename(pkg.exports[id].default);
  const modernFilnameParts = new RegExp(twoPartsFilenameTest, "g").exec(
    modernFilename
  );

  if (modernFilnameParts[2] !== "mjs") {
    console.error(`expecting exports['${id}'].default to use [name].mjs name`);
    process.exit(-1);
  }

  if (filnameParts[1] !== "index") {
    if (!fs.existsSync(filnameParts[1])) {
      console.warn(
        `submodule '${filnameParts[1]}' need a directory for package.json`
      );
    }

    if (!pkg.files.includes(filnameParts[1])) {
      console.warn(
        `submodule '${filnameParts[1]}' need to be included in files property for publishing`
      );
    }

    if (!fs.existsSync(`${filnameParts[1]}/package.json`)) {
      console.warn(`submodule '${filnameParts[1]}' need a package.json`);
    }

    const submodulePkg = JSON.parse(
      fs.readFileSync(`${filnameParts[1]}/package.json`)
    );
    if (submodulePkg.types !== `../${dest}/${filnameParts[1]}.d.ts`) {
      console.warn(
        `wrong types field ${submodulePkg.types} for ${filnameParts[1]} submodule`
      );
    }
  }

  input.push(`./src/${filnameParts[1]}.ts`);
}

if (typeof pkg.main !== "string") {
  console.warn(`expecting main field as a string in package.json`);
}

if (pkg.main !== pkg.exports["."]?.require) {
  console.warn(
    `expecting main field to be the same as exports['.'].require in package.json`
  );
}

if (typeof pkg.module !== "string") {
  console.warn(`expecting module field as a string in package.json`);
}

if (pkg.module !== pkg.exports["."]?.default) {
  console.warn(
    `expecting module field to be the same as exports['.'].default in package.json`
  );
}

const plugins = [
  babel({
    // exclude: "node_modules/**",
    include: "src/**",
    babelHelpers: "bundled"
  }),
  resolve(),
  commonjs(),
  typescript(),
  json(),
  filesize(),

  process.env.NODE_ENV !== "production" ? null : terser()
].filter(Boolean);

const external = (id) =>
  id.indexOf("node_modules") >= 0 ||
  id.indexOf("@niceties") >= 0 ||
  isBuiltinModule(id);

const common = {
  banner: "/* rollup copy plugin version */",
  footer: "/* follow me on Twitter! */",
  sourcemap: true
};

function getExternalGlobalName(id) {
  if (path.isAbsolute(id)) {
    return getGlobalName(path.relative(__dirname, id));
  }
  return camelCase(id);
}

function getGlobalName(anInput) {
  return camelCase(
    path.join(
      pkg.name,
      path.basename(anInput, ".ts") !== "index"
        ? path.basename(anInput, ".ts")
        : ""
    )
  );
}

function isExternalInput(id, inputs, currentInput) {
  let normalizedPath;
  if (path.isAbsolute(id)) {
    normalizedPath = "./" + path.relative(__dirname, id);
  } else {
    normalizedPath = "./" + path.join("src", id + ".ts");
  }
  return normalizedPath !== currentInput && inputs.includes(normalizedPath);
}

export default [
  {
    input,
    output: {
      format: "es",
      dir: dest,
      entryFileNames: "[name].mjs",
      chunkFileNames: "[name].mjs",
      ...common
    },
    plugins: [...plugins],
    external
  },
  {
    input,
    output: {
      format: "cjs",
      dir: dest,
      entryFileNames: "[name].cjs",
      chunkFileNames: "[name].cjs",
      exports: "auto",
      ...common
    },
    plugins: [...plugins],
    external
  }
];
