const { Sequelize, Op } = require("sequelize");
const { Sensor, SensorInfo } = require("../models/sensorModel");

//insert sensor data
async function insertSensorData(chipid, temperature, humidity, pressure) {
  try {
    const sensor = await Sensor.create({
      chipid,
      temperature,
      humidity,
      pressure,
    });
    return { success: true, sensor };
  } catch (error) {
    console.error("Error inserting sensor data:", error);
    throw new Error("Error inserting data");
  }
}

//get sensor data by chipid and include SensorInfo
async function getSensorDataByChipId(chipid, limit) {
  if (!limit) limit = 1;
  if (limit > 100) limit = 100;
  if (isNaN(limit)) limit = 1;
  try {
    const sensor = await Sensor.findAll({
      where: {
        chipid,
      },
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      include: {
        model: SensorInfo,
        attributes: ["name", "location"],
      },
    });

    //if sensor not found or empty
    if (!sensor || sensor.length === 0) {
      return { success: false, error: "Sensor not found" };
    }

    return { success: true, sensor };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw new Error("Error getting data");
  }
}

//get latest data from all sensors grouped by ChipId
async function getLatestData() {
  try {
    const query = `SELECT Sensors.chipid, temperature, humidity, Sensors.createdAt, Sensors.updatedAt, SensorInfo.name, SensorInfo.location
      FROM Sensors
      INNER JOIN SensorInfos AS SensorInfo ON Sensors.chipid = SensorInfo.chipid
      WHERE (Sensors.chipid, Sensors.createdAt) IN (
        SELECT Sensors.chipid, MAX(Sensors.createdAt)
        FROM Sensors
        GROUP BY Sensors.chipid
      )`;

    const sensor = await Sensor.sequelize.query(query, {
      type: Sequelize.QueryTypes.SELECT,
    });

    //if sensor not found or empty
    if (!sensor || sensor.length === 0) {
      return { success: false, error: "Sensor not found" };
    }

    return { success: true, sensor };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw new Error("Error getting data");
  }
}

//get all sensor data grouped by sensorInfo
async function getAllSensors() {
  try {
    const sensorInfo = await SensorInfo.findAll({
      include: [
        {
          model: Sensor,
          as: "sensorData",
          order: [["createdAt", "DESC"]],
          limit: 1000,
        },
      ],
    });

    return { success: true, sensorInfo };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw new Error("Error getting data");
  }
}

//get all sensor data between dates grouped by sensorInfo
async function getAllSensorsBetweenDates(dateFrom, dateTo = new Date()) {
  try {
    const sensorInfo = await SensorInfo.findAll({
      include: [
        {
          model: Sensor,
          as: "sensorData",
          where: {
            createdAt: {
              [Op.between]: [dateFrom, dateTo],
            },
          },
          order: [["createdAt", "DESC"]],
          limit: 1000,
        },
      ],
    });

    return { success: true, sensorInfo };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw new Error("Error getting data");
  }
}

//get sensor data from between dates by chip id, iclude sensor info, if second date is not provided, it will be set to now
async function getSensorDataByChipIdBetweenDates(
  chipid,
  dateFrom,
  dateTo = new Date()
) {
  try {
    const sensor = await Sensor.findAll({
      where: {
        chipid,
        createdAt: {
          [Op.between]: [dateFrom, dateTo],
        },
      },
      order: [["createdAt", "DESC"]],
      include: {
        model: SensorInfo,
        attributes: ["name", "location"],
      },
    });

    //if sensor not found or empty
    if (!sensor || sensor.length === 0) {
      return { success: false, error: "Sensor not found" };
    }

    return { success: true, sensor };
  } catch (error) {
    console.error("Error getting sensor data:", error);
    throw new Error("Error getting data");
  }
}

//create sensor
async function insertSensorInfo(chipid, name, location) {
  try {
    //check if sensor already exists
    const sensorInfo = await SensorInfo.findOne({
      where: {
        chipid,
      },
    });
    if (sensorInfo) {
      return { success: false, error: "Sensor already exists" };
    }

    //create sensor
    const sensor = await SensorInfo.create({
      chipid,
      name,
      location,
    });
    return { success: true, sensor };
  } catch (error) {
    console.error("Error inserting sensor info:", error);
    throw new Error("Error inserting data");
  }
}

//update sensor info
async function updateSensorInfo(chipid, name, location) {
  try {
    //check if sensor exists
    const sensorInfo = await SensorInfo.findOne({
      where: {
        chipid,
      },
    });
    if (!sensorInfo) {
      return { success: false, error: "Sensor not found" };
    }

    //update sensor
    const sensor = await SensorInfo.update(
      {
        name,
        location,
      },
      {
        where: {
          chipid,
        },
      }
    );
    return { success: true, sensor };
  } catch (error) {
    console.error("Error updating sensor info:", error);
    throw new Error("Error updating data");
  }
}

//get sensors info
async function getSensorsInfo() {
  try {
    const sensor = await SensorInfo.findAll({
      attributes: ["chipid", "name", "location"],
    });

    //if sensor not found or empty
    if (!sensor || sensor.length === 0) {
      return { success: false, error: "Sensors not found" };
    }

    return { success: true, sensor };
  } catch (error) {
    console.error("Error getting sensors data:", error);
    throw new Error("Error getting data");
  }
}

//delete sensor info
async function deleteSensorInfo(chipid) {
  try {
    //check if sensor exists
    const sensorInfo = await SensorInfo.findOne({
      where: {
        chipid,
      },
    });
    if (!sensorInfo) {
      return { success: false, error: "Sensor not found" };
    }

    //delete sensor
    const sensor = await SensorInfo.destroy({
      where: {
        chipid,
      },
    });
    return { success: true, sensor };
  } catch (error) {
    console.error("Error deleting sensor info:", error);
    throw new Error("Error deleting data");
  }
}

module.exports = {
  insertSensorData,
  getSensorDataByChipId,
  insertSensorInfo,
  getLatestData,
  getSensorDataByChipIdBetweenDates,
  updateSensorInfo,
  getSensorsInfo,
  deleteSensorInfo,
  getAllSensors,
  getAllSensorsBetweenDates,
};
