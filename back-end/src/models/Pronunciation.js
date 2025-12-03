// models/mysql/Pronunciation.js
import { DataTypes } from "sequelize";
// Giả sử bạn import sequelize từ file cấu hình của mình
<<<<<<< HEAD
import sequelize from "../libs/posgre.js"; 
=======
import sequelize from "../libs/sqlite.js"; 
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

const Pronunciation = sequelize.define("Pronunciation", {
  pronunciation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word_id: { // 👈 Khóa ngoại liên kết đến bảng Words
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  phonetic_spelling: { // 👈 Ví dụ: /dɒɡ/
    type: DataTypes.TEXT,
  },
  audio_file_url: { // 👈 Link file .mp3
    type: DataTypes.TEXT,
  },
  region: { // 👈 Ví dụ: 'UK', 'US'
    type: DataTypes.TEXT,
  }
}, {
  tableName: 'Pronunciation', // 👈 Chỉ rõ tên bảng
  timestamps: false // 👈 Bảng của bạn không có createdAt/updatedAt
});

export default Pronunciation;