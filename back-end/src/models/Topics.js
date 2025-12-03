// models/mysql/Topic.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Topics = sequelize.define("Topics", {
  topic_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  topic_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  difficulty: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Topics', // 👈 Chỉ rõ tên bảng
  timestamps: false
});

export default Topics;