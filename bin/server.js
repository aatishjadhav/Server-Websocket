`use strict`;

const { InitialValues } = require("../utils/constants");
const {
  getUpdateValues,
  getInitialData,
  totalIntervalsIn96Hours,
} = require("../utils/utils");
const { WebSocketServer } = require("ws");
const fs = require("fs");

const updateIntervalMs = 60 * 1000;

module.exports = (server) => {
  const wss = new WebSocketServer({ server });

  // Broadcast data to clients
  const broadcastData = () => {
    const formattedData = getUpdateValues();
    const jsonData = JSON.stringify(formattedData);
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(jsonData);
      }
    });
  };

  wss.on("connection", function connection(ws) {
    const data = getInitialData();
    const jsonData = JSON.stringify(data);
    return ws.send(jsonData);
  });

  // if (process.env.NODE_ENV === "dev") {
  //   fs.writeFileSync(
  //     __dirname + "/../utils/statistic.json",
  //     JSON.stringify(InitialValues)
  //   );
  // }

  // Update and broadcast periodically
  //   updateData();
  setInterval(() => {
    broadcastData();
  }, updateIntervalMs);

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("Shutting down...");
    wss.clients.forEach((client) => client.close());
    server.close(() => process.exit(0));
  });
};
