// models/mysql/POS.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const POS = sequelize.define("POS", {
  pos_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  pos_name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  pos_abbreviation: {
    type: DataTypes.TEXT
  },
  pos_name_vie: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'POS',
  timestamps: false
});

export default POS;