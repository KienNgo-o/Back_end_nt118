import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
// Import các model từ file index.js chứa quan hệ
import { Pronunciation, Word } from "../models/index.js"; 

export const gradePronunciation = async (req, res) => {
  try {
    // 1. KIỂM TRA INPUT
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng gửi file ghi âm (user_audio)." });
    }

    const { word_id } = req.body;
    if (!word_id) {
        // Xóa file tạm ngay nếu thiếu thông tin
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Thiếu word_id của từ cần kiểm tra." });
    }

    // 2. LẤY DỮ LIỆU TỪ DATABASE
    // Chúng ta cần 2 thứ: 
    // - Từ vựng (Text) để Whisper AI kiểm tra độ chính xác.
    // - Link Audio (URL) để thuật toán DSP kiểm tra ngữ điệu.

    // a. Lấy thông tin từ vựng (Word)
    const wordRecord = await Word.findByPk(word_id);
    if (!wordRecord) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Không tìm thấy từ vựng này trong hệ thống." });
    }

    // b. Lấy thông tin phát âm (Pronunciation)
    const pronuncRecord = await Pronunciation.findOne({ where: { word_id: word_id } });
    
    // Kiểm tra xem có link audio mẫu không
    if (!pronuncRecord || !pronuncRecord.audio_file_url) {
        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Từ này chưa có file phát âm mẫu để so sánh." });
    }

    // Chuẩn bị dữ liệu
    // Giả sử cột chứa chữ trong bảng Word là 'word' (hoặc 'word_text' tùy database của bạn)
    const correctText = wordRecord.word || wordRecord.word_text || ""; 
    const refAudioUrl = pronuncRecord.audio_file_url;

    // 3. GỬI SANG PYTHON SERVICE
    const formData = new FormData();
    
    // - File ghi âm của user (Stream)
    formData.append('user_audio', fs.createReadStream(req.file.path));
    
    // - Text đúng (Để Whisper chấm điểm Accuracy)
    formData.append('correct_word', correctText);
    
    // - URL file mẫu (Để Librosa/DTW chấm điểm Intonation)
    formData.append('ref_audio_url', refAudioUrl);

    console.log(`📡 Đang gửi sang Python...`);
    console.log(`   - Word: ${correctText}`);
    console.log(`   - Ref Audio: ${refAudioUrl}`);

    // Gọi API Python (Timeout 60s để AI kịp load model nếu cần)
    const pythonResponse = await axios.post('http://127.0.0.1:5002/grade', formData, {
      headers: { ...formData.getHeaders() },
      timeout: 60000 
    });

    // 4. DỌN DẸP FILE TẠM (Quan trọng)
    if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    // 5. TRẢ KẾT QUẢ CHO CLIENT
    // Python trả về: { score, details: { accuracy_score, intonation_score, detected_text }, feedback }
    const result = pythonResponse.data;

    return res.status(200).json({
      success: true,
      data: {
        word_id: parseInt(word_id),
        word_text: correctText,
        ...result // Bung toàn bộ dữ liệu từ Python ra (score, details, feedback)
      }
    });

  } catch (error) {
    // Xử lý lỗi
    console.error("❌ Lỗi Controller gradePronunciation:", error.message);

    // Dọn dẹp file nếu lỗi
    if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
    }

    // Phân loại lỗi
    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({ 
            message: "Dịch vụ AI chấm điểm đang bảo trì (Python Service chưa bật)." 
        });
    }
    
    if (error.response) {
        // Lỗi do Python trả về (ví dụ 400, 500)
        return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Lỗi hệ thống nội bộ." });
  }
};