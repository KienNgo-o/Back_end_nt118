import express from "express";
import dotenv from "dotenv";
<<<<<<< HEAD
import { connectDB } from "./libs/mongoDB.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import topicRoute from "./routes/topicRoute.js";
import { protectedRoute, adminAuthen } from "./middlewares/authMiddleware.js";
import { connectsupabase } from "./libs/posgre.js";
import wordRoute from "./routes/wordRoute.js";
import quizRoute from "./routes/quizRoute.js";
import adminRoute from "./routes/adminRoute.js"
import pronunciationRoute from "./routes/pronunciationRoute.js"
=======
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import topicRoute from "./routes/topicRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import { connectSQLite } from "./libs/sqlite.js";
import wordRoute from "./routes/wordRoute.js";

>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

<<<<<<< HEAD
=======
// Cấu hình CORS (nên đặt trước các routes)
// app.use(cors({
//   origin: [
//   process.env.CLIENT_URL,
//     //"http://localhost:5001",
// // IP này rất QUAN TRỌNG cho Android Emulator
//     // Bạn có thể cần thêm IP LAN của máy bạn, ví dụ: "http://192.168.1.10:5001"
//   ],
//   credentials: true 
//   // credentials: true vẫn có thể giữ lại, 
//   // dù không dùng cookie nhưng nó cần cho một số cấu hình CORS phức tạp.
//   // Nếu bạn không dùng cookie, có thể set là false.
// }));
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7

// middlewares
app.use(express.json()); // kiểm tra xem dữ liệu gửi qua có phải là json không
// public routes
app.use("/api/auth", authRoute);

// private routes
app.use(protectedRoute); // Bất kỳ route nào khai báo SAU dòng này sẽ được bảo vệ

<<<<<<< HEAD
app.use("/api/users", userRoute);
app.use("/api/topics", topicRoute);
app.use("/api/words", wordRoute);
app.use("/api/topics", quizRoute);
app.use("/api/pronun",pronunciationRoute);
app.use(adminAuthen);
app.use("/api/admin", adminRoute);
connectDB().then(() => {
  // Thêm từ khóa 'async' vào đầu hàm này 👇
  connectsupabase().then(async () => {

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`server bắt đầu trên cổng ${PORT}`);
    });

=======
app.use("/api/users", userRoute); // <-- THAY ĐỔI: Bỏ comment dòng này
/// <-- THAY ĐỔI: Bỏ comment dòng này
app.use("/api/topics", topicRoute);
app.use("/api/words", wordRoute);
connectDB().then(() => {
  connectSQLite().then(() => {
    app.listen(PORT, "0.0.0.0", () => { // "0.0.0.0" là đúng để máy ảo có thể truy cập
      console.log(`server bắt đầu trên cổng ${PORT}`);
    });
>>>>>>> 73fa3a001cfbcdbb44df21759a1ae5fd55eaa2b7
  });
});