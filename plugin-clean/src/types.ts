export type CleanPluginOptions = {
  targets?: string | string[];
  pluginName?: string;
  deleteOnce?: boolean;
  outputPlugin?: boolean;
  verbose?: boolean;
  runOnce?: boolean;
} & string &
  string[];
