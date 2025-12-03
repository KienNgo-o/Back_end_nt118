// models/mysql/SynonymGroup.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Synonym_Groups = sequelize.define("Synonym_Groups", {
  group_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  group_description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Synonym_Groups',
  timestamps: false
});

export default Synonym_Groups;