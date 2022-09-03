console.log("start");

export default function () {
  return {
    name: "@timly/plugin-copy",
    load() {
      // code : load就是插件对象特有的属性，这里可以放一些逻辑

      console.log("dddddd");
    },
    transform(code: string) {
      // const Reg = /console\.log\(.*\)/gi;
      console.log(">>>>>>>>copy>>>>>");
      // return code.replace(Reg, "");
      return code;
    }
  };
}
