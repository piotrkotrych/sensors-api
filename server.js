require("dotenv").config();
const fastify = require("fastify")({
  logger: {},
});
const cors = require("@fastify/cors");
const db = require("./db");

//cors
fastify.register(cors, {
  origin: "*",
});

//routes
fastify.register(require("./routes/data"));

db.sync();

// Run the server!
fastify.listen({ port: 666 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
