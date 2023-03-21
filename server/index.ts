import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ip as ipv4 } from "address";
import crypto from "crypto";
import rls from "readline-sync";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
const settings = require("./settings.json");

const key: string = crypto.randomBytes(8).toString("hex");

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

interface File {
  path: string;
  data: Buffer;
}

try {
  mkdirSync(settings?.output || "output");
} catch (error) {}

io.on("connection", (socket: Socket) => {
  let loggedIn = false;

  socket.once("auth", (pass: string) => {
    if (
      pass == key &&
      rls.keyInYN(`connection from ${socket.handshake.address} accept? `)
    ) {
      loggedIn = true;
      socket.emit("succes");
    }
  });

  socket.on("folder", (path: string) => {
    if (loggedIn) {
      try {
        mkdirSync(join(".", settings.output || "output", path));
      } catch (error) {
        console.error(path + " alredy exist!");
      }
    }
  });
  socket.on("file", (data: File) => {
    if (loggedIn) {
      try {
        writeFileSync(
          join(".", settings.output || "output", data.path),
          data.data.toString("utf8")
        );
      } catch (error) {
        console.error(data.path + " alredy exist!");
      }
    }
  });

  socket.on("transfer", (cb: Function) => {
    cb(
      loggedIn &&
        rls.keyInYN(`transfer from ${socket.handshake.address} accept?`)
    );
  });

  socket.once("end", process.exit);
});

const ip = ipv4();
const port: number = settings.port || 9090;

const adress = `${ip}:${port}`;

httpServer.listen(port, ip, () => {
  console.clear();

  console.log("server registered!\n\n");
  console.log(`adress: ${adress}`);
  console.log(`key:  ${key}\n`);
  console.log("waiting for connection...");

  writeFileSync(
    "./auth_config.json",
    JSON.stringify({ adress: `${adress}`, key: key })
  );
});
