const net = require("net");
const server = net.createServer();
const validator = require("./lib/validator");
const watcher = require("./lib/watcher.js");

server.on("connection", (clientToProxySocket) => {
  console.log("\n[YorProxy] Client has Connected");
  // We need only the data once the starting packet
  clientToProxySocket.once("data", (data) => {
    let isTLSConnection = data.toString().indexOf("CONNECT") !== -1;

    //Considering Port as 80 by default
    let serverPort = 80;
    let serverAddress;
    if (isTLSConnection) {
      serverPort = 443;
      serverAddress = data
        .toString()
        .split("CONNECT")[1]
        .split(" ")[1]
        .split(":")[0];
    } else {
      // Parsing HOST from HTTP
      serverAddress = data.toString().split("Host: ")[1].split("\r\n")[0];
    }

    if (validator.validateReqAddress(serverAddress)) {
      console.log(
        "[YorProxy] Creating connection for: " +
          serverAddress +
          ":" +
          serverPort
      );
      let proxyToServerSocket = net.createConnection(
        {
          host: serverAddress,
          port: serverPort,
        },
        () => {
          console.log(
            "[YorProxy] Connection Established for " +
              serverAddress +
              ":" +
              serverPort
          );

          let today = new Date();

          watcher.writeHistory(
            "./log/access-" + today.getDate() + "-" + today.getMonth() + ".log",
            `\n [YorProxy] Client ${
              proxyToServerSocket.remoteAddress
            } opened ${serverAddress} at ${new Date(
              Date.now()
            ).toLocaleString("en-US", { timeZone: "America/New_York" })}`,
            () => {}
          );

          if (isTLSConnection) {
            //Send Back OK to HTTPS CONNECT Request
            clientToProxySocket.write("HTTP/1.1 200 OK\r\n\n");
          } else {
            proxyToServerSocket.write(data);
          }
          // Piping the sockets
          clientToProxySocket.pipe(proxyToServerSocket);
          proxyToServerSocket.pipe(clientToProxySocket);
          proxyToServerSocket.on("error", (err) => {
            console.log("[YorProxy] Proxy Error");
            console.log(err);
          });
        }
      );
    } else {
      watcher.writeHistory(
        "./log/access-" + today.getDate() + "-" + today.getMonth() + ".log",
        `\n [YorProxy] Blocked Client ${
          proxyToServerSocket.remoteAddress
        } opened ${serverAddress} at ${new Date(
          Date.now()
        ).toLocaleString("en-US", { timeZone: "America/New_York" })}`,
        () => {}
      );

      proxyToServerSocket.write(
        Buffer.from(
          "!!!!!!!!!!!!!!!!!!!!!! CONTENT BLOCKED BY FIREWALL !!!!!!!!!!!!!!!!!!!!!!!!!!!!"
        )
      );
      proxyToServerSocket.end();
    }

    clientToProxySocket.on("error", (err) => {
      console.log("[YorProxy] Client Error");
      console.log(err);
    });
  });
});

server.on("error", (err) => {
  console.log("[YorProxy] Server Error");
  console.log(err);
});

server.on("close", () => {
  console.log("[YorProxy] Client Disconnected\n");
});

server.listen(8124, () => {
  console.log("[YorProxy] Server runnig at localhost:" + 8124 + "\n");
});
