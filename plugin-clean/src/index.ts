import { CleanPluginOptions } from "./types";

console.log("start");

export default function (options = {} as CleanPluginOptions) {
  console.log("options", options);
  return {
    name: "@timly/plugin-clean",
    load() {
      // code : load就是插件对象特有的属性，这里可以放一些逻辑

      console.log(options);
    },
    transform(code: string) {
      // const Reg = /console\.log\(.*\)/gi;
      console.log(">>>>>>>>>>>>>");
      // return code.replace(Reg, "");
      return code;
    }
  };
}
