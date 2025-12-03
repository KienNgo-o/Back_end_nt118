// models/mysql/Definition.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Definition = sequelize.define("Definition", {
  definition_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word_id: { // 👈 Khóa ngoại
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pos_id: { // 👈 Khóa ngoại
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  definition_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  translation_text: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Definition',
  timestamps: false
});

export default Definition;