const sensorController = require("../controllers/sensorController");

async function dataRoute(fastify, options) {
  //post data from sensor
  fastify.post("/postData", async (request, reply) => {
    const { chipid, temperature, humidity, pressure } = request.body;
    try {
      const result = await sensorController.insertSensorData(
        chipid,
        temperature,
        humidity,
        pressure
      );
      reply.send(result);
    } catch (error) {
      console.error("Error inserting sensor data:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //create sensor info
  fastify.post("/create", {
    schema: {
      body: {
        type: "object",
        properties: {
          chipid: { type: "number" },
          name: { type: "string" },
          location: { type: "string" },
        },
        required: ["chipid", "name", "location"],
      },
    },
    handler: async (request, reply) => {
      const { chipid, name, location } = request.body;
      try {
        const result = await sensorController.insertSensorInfo(
          chipid,
          name,
          location
        );
        reply.send(result);
      } catch (error) {
        console.error("Error inserting sensor info:", error);
        reply.code(500).send({ success: false, error: error.message });
      }
    },
  });

  //update sensor info
  fastify.post("/update", async (request, reply) => {
    const { chipid, name, location } = request.body;
    try {
      const result = await sensorController.updateSensorInfo(
        chipid,
        name,
        location
      );
      reply.send(result);
    } catch (error) {
      console.error("Error updating sensor info:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //get sensors infos
  fastify.get("/sensors", async (request, reply) => {
    try {
      const result = await sensorController.getSensorsInfo();
      reply.send(result);
    } catch (error) {
      console.error("Error getting sensors info:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //delete sensor info
  fastify.delete("/delete/:chipid", async (request, reply) => {
    const { chipid } = request.params;
    try {
      const result = await sensorController.deleteSensorInfo(chipid);
      reply.send(result);
    } catch (error) {
      console.error("Error deleting sensor info:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //get data from specific sensor by ChipId
  fastify.get("/sensor/:chipid/:limit", async (request, reply) => {
    const { chipid, limit } = request.params;
    try {
      const result = await sensorController.getSensorDataByChipId(
        chipid,
        limit
      );
      reply.send(result);
    } catch (error) {
      console.error("Error getting sensor data:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //get latest data from all sensors grouped by ChipId
  fastify.get("/latest", async (request, reply) => {
    try {
      const result = await sensorController.getLatestData();
      reply.send(result);
    } catch (error) {
      console.error("Error getting latest data:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //getAllSensors
  fastify.get("/sensors/all", async (request, reply) => {
    try {
      const result = await sensorController.getAllSensors();
      reply.send(result);
    } catch (error) {
      console.error("Error getting all sensors:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //getAllSensorsBetweenDates
  fastify.get("/sensors/all/:dateFrom/:dateTo", async (request, reply) => {
    const { dateFrom, dateTo } = request.params;
    try {
      const result = await sensorController.getAllSensorsBetweenDates(
        dateFrom,
        dateTo
      );
      reply.send(result);
    } catch (error) {
      console.error("Error getting all sensors between dates:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });

  //get sensor data from between dates by chip id, iclude sensor info, if second date is not provided, it will be set to now
  fastify.get("/sensor/:chipid/:dateFrom/:dateTo", async (request, reply) => {
    const { chipid, dateFrom, dateTo } = request.params;
    try {
      const result = await sensorController.getSensorDataByChipIdBetweenDates(
        chipid,
        dateFrom,
        dateTo
      );
      reply.send(result);
    } catch (error) {
      console.error("Error getting sensor data:", error);
      reply.code(500).send({ success: false, error: error.message });
    }
  });
}

module.exports = dataRoute;
