// models/mysql/WordFamily.js (Nên đặt tên file là số ít)
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Word_Families = sequelize.define("Word_Families", {
  family_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  family_description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'Word_Families',
  timestamps: false
});

export default Word_Families;