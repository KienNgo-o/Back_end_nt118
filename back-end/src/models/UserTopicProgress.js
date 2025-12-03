// models/mysql/UserTopicProgress.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
import Topic from "./Topics.js";

const UserTopicProgress = sequelize.define("UserTopicProgress", {
  progress_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  mongoUserId: { // 👈 Liên kết với User (từ MongoDB)
    type: DataTypes.STRING(24),
    allowNull: false,
    index: true,
  },
  topic_id: { // 👈 Liên kết với Topic (từ MySQL)
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Topic,
      key: 'topic_id'
    }
  },
  status: { // 👈 Trạng thái
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'unlocked' // 'unlocked', 'completed'
  }
}, {
  tableName: 'UserTopicProgress',
<<<<<<< HEAD
  timestamps: true // Lần này nên dùng timestamps
=======
  timestamps: false // Lần này nên dùng timestamps
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
});

Topic.hasMany(UserTopicProgress, { foreignKey: 'topic_id' });
UserTopicProgress.belongsTo(Topic, { foreignKey: 'topic_id' });

export default UserTopicProgress;