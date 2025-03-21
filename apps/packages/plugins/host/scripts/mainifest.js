import fs from "node:fs";
import path from "node:path";
import pkg from "../package.json" assert { type: 'json' };

export const createMainifest = async (main) => {
  const mainifest = {
    name: pkg.name,
    displayName: pkg.displayName,
    version: pkg.version,
    description: pkg.description,
    preview: pkg.preview,
    main: main ?? pkg.main,
    homepage: pkg.homepage,
    customApi: pkg.preload,

    author: pkg.author,
    email: pkg.email,
    categories: pkg.categories,
    tags: pkg.tags,
    icon: pkg.icon,
  };

  // eslint-disable-next-line no-undef
  await fs.promises.writeFile(
    path.join(import.meta.dirname, "../dist/mainifest.json"),
    JSON.stringify(mainifest, null, 2),
    "utf8"
  );
};
