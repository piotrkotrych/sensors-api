const { DataTypes } = require("sequelize");
const db = require("../db");

const Sensor = db.define("Sensor", {
  chipid: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  temperature: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  humidity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  pressure: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

const SensorInfo = db.define("SensorInfo", {
  chipid: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

Sensor.belongsTo(SensorInfo, {
  foreignKey: "chipid",
  targetKey: "chipid",
});
SensorInfo.hasMany(Sensor, {
  foreignKey: "chipid",
  sourceKey: "chipid",
  as: "sensorData",
});

module.exports = { Sensor, SensorInfo };
