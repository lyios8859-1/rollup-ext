import { InputOptions, PluginHooks } from "rollup";
import { CleanPluginOptions } from "./types";

export default function (opt = {} as CleanPluginOptions) {
  return {
    name: "@timly/plugin-clean",
    opetons(options: InputOptions) {
      //
      if (!opt.targets) {
        console.log(options);
      }
    }
  } as Partial<PluginHooks>;
}
