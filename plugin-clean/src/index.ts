import { CleanPluginOptions } from "./types";

console.log("start");

export default function (
  options = { pluginName: "@timly/plugin-clean" } as CleanPluginOptions
) {
  console.log("options", options);
  return {
    name: options.pluginName,
    load() {
      // code : load就是插件对象特有的属性，这里可以放一些逻辑

      console.log("clean load", options);
    },
    transform(code: string) {
      // const Reg = /console\.log\(.*\)/gi;
      console.log("clean transform");
      // return code.replace(Reg, "");
      return code;
    }
  };
}
