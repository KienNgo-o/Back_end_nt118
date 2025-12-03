// models/mysql/Example.js
import { DataTypes } from "sequelize";
<<<<<<< HEAD
import sequelize from "../libs/posgre.js";
=======
import sequelize from "../libs/sqlite.js";
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Example = sequelize.define("Example", {
  example_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  definition_id: { // 👈 Khóa ngoại liên kết đến bảng Definition
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  example_sentence: { // 👈 Câu ví dụ bằng tiếng Anh
    type: DataTypes.TEXT,
    allowNull: false,
  },
  translation_sentence: { // 👈 Câu dịch nghĩa (nếu có)
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'Example', // 👈 Chỉ rõ tên bảng
  timestamps: false
});

export default Example;