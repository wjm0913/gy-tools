import fs from "node:fs";
import path from "node:path";
import pkg from "../package.json" assert { type: 'json' };
import { c } from "tar";

export const pack = async () => {
  c(
    {
      gzip: true,
      cwd: path.join(import.meta.dirname, "../dist"),
    },
    ["html", "preload", "mainifest.json"]
  ).pipe(fs.createWriteStream(`${pkg.name}-v${pkg.version}.gytp`));
};

