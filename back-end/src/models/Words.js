// models/mysql/Word.js (bạn có thể đặt tên thư mục tùy ý)
import { DataTypes } from "sequelize";
// Giả sử bạn import sequelize từ file cấu hình
<<<<<<< HEAD
import sequelize from "../libs/posgre.js"; 
=======
import sequelize from "../libs/sqlite.js"; 
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Word = sequelize.define("Words", {
  word_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word_text: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  }
}, {
  tableName: 'Words', // 👈 Chỉ rõ tên bảng (quan trọng!)
  timestamps: false // 👈 Tắt timestamps (vì bảng của bạn không có createdAt)
});

export default Word;