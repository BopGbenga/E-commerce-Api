const mongoose = require("mongoose");

require("dotenv").config();

const CONNECTION_URL = process.env.DATABASE_URL;

const connect = (url) => {
  mongoose.connect(CONNECTION_URL);

  mongoose.connection.on("connected", () => {
    console.log("connected to mongodb successfulllly");
  });

  mongoose.connection.on("error", (err) => {
    console.log("mongodb connection error");
    console.log(err);
  });
};

module.exports = { connect };
