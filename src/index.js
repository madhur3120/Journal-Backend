const express = require("express");
const bodyParser = require('body-parser');
const { ServerConfig, DB } = require("./config");
const apiRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Documentation
app.use(`/api-docs`, require(`../api-docs/Swagger`));

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Sucessfully started the server on PORT : ${ServerConfig.PORT}`);
});
