/**
 * host文件写入
 */

import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import getPathOfSystemHosts from "./getPathOfSystemHostsPath";
import { exec } from "@vscode/sudo-prompt";

const CONTENT_START = "# --- gy_imensional_space START ---";
const CONTENT_END = "# --- gy_imensional_space END ---";

/**
 * 检查权限
 */
const checkAccess = async (fn: string): Promise<boolean> => {
  try {
    await fs.promises.access(fn, fs.constants.W_OK);
    return true;
  } catch (e) {
    // console.error(e)
  }
  return false;
};

const writeWithSudo = (sys_hosts_path: string, content: string) =>
  new Promise<void>((resolve, reject) => {
    const tmp_fn = path.join(
      os.tmpdir(),
      `swh_${new Date().getTime()}_${Math.random()}.txt`
    );
    fs.writeFileSync(tmp_fn, content, "utf-8");

    const cmd = `${process.platform == 'win32' ? 'type' : 'cat'} "${tmp_fn}" > ${sys_hosts_path}`

    exec(
      cmd,
      {
        name: "GY Tools Host Save",
        // icns: '/Applications/Electron.app/Contents/Resources/Electron.icns', // (optional)
      },
      function (error, stdout, stderr) {
        // command output is in stdout
        console.log("error", error);
        console.log("stdout", stdout);
        console.log("stderr", stderr);

        if (fs.existsSync(tmp_fn)) {
          fs.unlinkSync(tmp_fn);
        }

        if (!error) {
          console.log("success.");

          resolve();
        } else {
          console.log("fail!");
          reject(new Error(stderr?.toString() ?? error.message ?? 'failed'));
        }
      }
    );
  });

const write = async (content: string): Promise<void> => {
  const sys_hosts_path = await getPathOfSystemHosts();

  try {
    await fs.promises.readFile(sys_hosts_path, "utf-8");
  } catch (e) {
    console.error(e);
  }

  const has_access = await checkAccess(sys_hosts_path);
  console.log("has_access: ", has_access);
  if (!has_access) {
    const platform = process.platform;
    if (platform === "darwin" || platform === "linux") {
      await writeWithSudo(sys_hosts_path, content);
      return;
    }

    throw new Error("not permitted");
  }

  try {
    await fs.promises.writeFile(sys_hosts_path, content, "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error(e);
    if (e.code === "EPERM" || e.message.include("operation not permitted")) {
      await writeWithSudo(sys_hosts_path, content);
      return;
    }

    throw e;
  }
};

const makeAppendContent = async (content: string): Promise<string> => {
  const sys_hosts_path = await getPathOfSystemHosts();
  const old_content = await fs.promises.readFile(sys_hosts_path, "utf-8");

  const index = old_content.indexOf(CONTENT_START);
  const indexEnd = old_content.lastIndexOf(CONTENT_END);
  const pre = index > -1 ? old_content.substring(0, index).trimEnd() : ''
  const end = indexEnd > -1 ? old_content.substring(indexEnd + CONTENT_END.length).trimStart() : ''
  console.log('end', indexEnd, end)
  let new_content = (pre ? pre : old_content.trimEnd()) + '\n'
  if (content) new_content += `\n${CONTENT_START}\n${content.trim()}\n${CONTENT_END}\n`
  if (end) new_content += `\n${end}`

  return new_content;
};

const setSystemHosts = async (content: string): Promise<void> => {
  content = await makeAppendContent(content);
  await write(content);
  console.log(content)
};

export default setSystemHosts;
