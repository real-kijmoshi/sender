import { lstatSync, readdirSync, readFileSync } from "fs";
import { join, sep } from "path";
import rls from "readline-sync";
import { io as socket, Socket } from "socket.io-client";
const config = require("./auth_config.json");
const settings = require("./settings.json");

const io: Socket = socket(
  "http://" + (config?.adress ?? rls.question("adress: "))
);

const PATH = process.argv.slice(process.argv.indexOf("-p") + 1).join(" ");
const sendFile = (path: string) => {
  try {
    io.emit("file", {
      name: path.split(sep).at(-1),
      path: path,
      data: readFileSync(path),
    });
  } catch (error) {
    console.log(`can't send ${path}`);
  }
};

const sendFolder = (path: string) => {
  try {
    const files: Array<string> = [];
    const folders: Array<string> = [];

    if (settings.ignore?.some((name: string) => path.includes(name)))
      return console.log("skipped " + path);

    io.emit("folder", path);

    readdirSync(path).forEach((child) => {
      const childPath = join(path, child);
      const stats = lstatSync(childPath);

      if (stats.isDirectory()) {
        folders.push(childPath);
      } else {
        files.push(childPath);
      }
    });

    (() => {
      return new Promise((r) => {
        if (!files[0]) r(0);

        files.forEach((p, i, { length }) => {
          sendFile(p);

          if (i == length - 1) r(0);
        });
      });
    })().then(() => {
      folders.forEach(sendFolder);
    });
  } catch (err) {
    console.log(`can't send ${path}`);
  }
};

io.once("connect", () => {
  io.emit("auth", config.key || rls.question("key: "));
  io.once("succes", () => {
    console.clear();
    console.log("logged in");

    if (rls.keyInYN("start transfer? ")) {
      io.emit("transfer", (accepted: boolean) => {
        if (accepted) {
          sendFolder(PATH);
        } else {
          console.log("transfer declined");
        }
      });
    }
  });
});
