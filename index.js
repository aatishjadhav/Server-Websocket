`use strict`;

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const serve = require("./bin/server");

const port = process.env.PORT || 5002;
app.use(cors({ origin: "*" }));
app.use(express.json());

// WebSocket Server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

serve(server);
