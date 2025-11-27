import {
  Quiz,
  Question,
  QuestionOption,
  MatchingPair,
  Topics,
  QuizResult
} from "../models/index.js";
import UserTopicProgress from "../models/UserTopicProgress.js";
import { Op } from "sequelize";
/**
 * API: Lấy đề thi cho một Topic
 * GET /api/topics/:id/quiz
 */
export const getQuizByTopicId = async (req, res) => {
  try {
    const topicId = parseInt(req.params.id, 10);
    const mongoUserId = req.user._id.toString();

    // 1. KIỂM TRA QUYỀN (Unlock Logic)
    // User phải mở khóa topic này (unlocked) hoặc đã hoàn thành (completed) mới được làm quiz
    const access = await UserTopicProgress.findOne({
      where: {
        mongoUserId: mongoUserId,
        topic_id: topicId,
        status: ['unlocked', 'completed']
      }
    });

    if (!access) {
      return res.status(403).json({ message: "Bạn chưa mở khóa bài kiểm tra này." });
    }

    // 2. LẤY DỮ LIỆU QUIZ (Kèm Câu hỏi & Đáp án)
    const quiz = await Quiz.findOne({
      where: { topic_id: topicId },
      attributes: ['quiz_id', 'title', 'passing_score', 'duration_minutes'], // Lấy các trường cần thiết
      include: [
        {
          model: Question,
          attributes: ['question_id', 'question_type', 'prompt', 'image_url', 'audio_url'], 
          // Lưu ý: KHÔNG lấy 'correct_text_answer' (cho dạng điền từ) để bảo mật
          
          include: [
            {
              // Lấy lựa chọn trắc nghiệm (Dạng 1, 2, 3)
              model: QuestionOption,
              // ❗️ QUAN TRỌNG: Loại bỏ 'is_correct' để user không thấy đáp án
              attributes: ['option_id', 'option_text', 'option_image_url'] 
            },
            {
              // Lấy cặp nối (Dạng 4)
              model: MatchingPair,
              attributes: ['pair_id', 'image_url', 'word_text']
              // Với dạng nối, client sẽ nhận cả cặp và tự xáo trộn (shuffle) để hiển thị
            }
          ]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ message: "Chưa có bài kiểm tra cho chủ đề này." });
    }

    return res.status(200).json(quiz);

  } catch (error) {
    console.error("Lỗi khi lấy Quiz:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};


// ======================================================
// ❗️ API 2: NỘP BÀI (LOGIC CHẤM ĐIỂM TRỌNG SỐ MỚI) ❗️
// ======================================================

export const submitQuiz = async (req, res) => {
  try {
    const topicId = parseInt(req.params.id, 10);
    const mongoUserId = req.user._id.toString();
    const { answers } = req.body; // Danh sách câu trả lời của user

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Dữ liệu bài làm không hợp lệ." });
    }

    // 1. LẤY THÔNG TIN QUIZ & ĐÁP ÁN TỪ CSDL
    const quiz = await Quiz.findOne({
      where: { topic_id: topicId },
      include: [
        {
          model: Question,
          include: [
            { model: QuestionOption }, // Lấy options để check trắc nghiệm
            { model: MatchingPair }    // Lấy pairs để check nối hình
          ]
        }
      ]
    });

    if (!quiz) {
      return res.status(404).json({ message: "Không tìm thấy bài kiểm tra." });
    }

    // 2. CHẤM ĐIỂM (WEIGHTED SCORING)
    let totalPossiblePoints = 0; 
    let userEarnedPoints = 0;
    // 🔥 FIX 1: Map key nên chuyển hết về String để tránh lệch kiểu (Int vs String)

    const userAnswersMap = new Map(answers.map(a => [String(a.question_id), a]));

    for (const dbQuestion of quiz.Questions) {
        
        // 🔥 FIX 2: Lấy câu trả lời bằng key String
        const userAnswer = userAnswersMap.get(String(dbQuestion.question_id));
        
        if (dbQuestion.question_type === 'MATCH_PAIRS') {
            const maxPointsForQuestion = dbQuestion.MatchingPairs.length; 
            totalPossiblePoints += maxPointsForQuestion;

            if (userAnswer && userAnswer.pairs && Array.isArray(userAnswer.pairs)) {
                let correctPairsCount = 0;
                for (const userPair of userAnswer.pairs) {
                    const isPairCorrect = dbQuestion.MatchingPairs.some(
                        dbPair => 
                            // Nên trim() để tránh lỗi khoảng trắng thừa
                            dbPair.image_url.trim() === userPair.image_url.trim() && 
                            dbPair.word_text.trim() === userPair.word_text.trim()
                    );
                    if (isPairCorrect) correctPairsCount++;
                }
                userEarnedPoints += correctPairsCount;
            }
        } 
        else {
            totalPossiblePoints += 1; 
            let isCorrect = false;

            if (userAnswer) {
                switch (dbQuestion.question_type) {
                    case 'LISTEN_CHOOSE_IMG':
                    case 'IMG_CHOOSE_TEXT':
                        if (userAnswer.selected_option_id) {
                            // 🔥 FIX 3: Kiểm tra is_correct linh hoạt (cả true lẫn 1)
                            const correctOption = dbQuestion.QuestionOptions.find(opt => 
                                opt.is_correct === true || opt.is_correct === 1
                            );
                            
                            // 🔥 FIX 4: So sánh ID bằng String (tránh 5 === "5" -> false)
                            if (correctOption && String(correctOption.option_id) === String(userAnswer.selected_option_id)) {
                                isCorrect = true;
                            }
                        }
                        break;
                    
                    case 'FILL_BLANK':
                         if (userAnswer.text_input && dbQuestion.correct_text_answer) {
                             if (userAnswer.text_input.trim().toLowerCase() === dbQuestion.correct_text_answer.trim().toLowerCase()) {
                                 isCorrect = true;
                             }
                         }
                         break;
                }
            }

            if (isCorrect) userEarnedPoints += 1;
        }
    }

    // 3. TÍNH TỔNG KẾT (QUY ĐỔI VỀ THANG 10 HOẶC 100)
    // Ở đây quy đổi về thang điểm gốc của Quiz (thường là 100) để so sánh với passing_score
    // Ví dụ: Tổng 10 điểm (2 câu thường + 1 câu nối 8 cặp), User được 5 điểm => 50%
    const scorePercentage = totalPossiblePoints > 0 
        ? Math.round((userEarnedPoints / totalPossiblePoints) * 100) 
        : 0;

    const passed = scorePercentage >= quiz.passing_score ? 1 : 0;

    // 4. LƯU KẾT QUẢ
    const resultRecord = await QuizResult.create({
      quiz_id: quiz.quiz_id,
      mongoUserId: mongoUserId,
      score: scorePercentage, // Lưu điểm quy đổi (0-100)
      passed: passed
    });

    // 5. LOGIC MỞ KHÓA (UNLOCK NEXT TOPIC)
    let isNextTopicUnlocked = false;

    if (passed === 1) {
      // A. Cập nhật topic hiện tại thành 'completed'
      await UserTopicProgress.update(
        { status: 'completed' },
        { where: { mongoUserId, topic_id: topicId } }
      );

      // B. Tìm Topic tiếp theo
      const nextTopic = await Topics.findOne({
        where: { topic_id: { [Op.gt]: topicId } },
        order: [['topic_id', 'ASC']]
      });

      if (nextTopic) {
        const [nextProgress, created] = await UserTopicProgress.findOrCreate({
          where: { mongoUserId, topic_id: nextTopic.topic_id },
          defaults: { status: 'unlocked' }
        });
        
        // Nếu mới tạo hoặc trước đó bị lock thì mở khóa
        if (created || nextProgress.status === 'locked') {
             if (nextProgress.status === 'locked') {
                 nextProgress.status = 'unlocked';
                 await nextProgress.save();
             }
             isNextTopicUnlocked = true;
        }
      }
    }

    // 6. TRẢ VỀ KẾT QUẢ CHI TIẾT
    return res.status(200).json({
      score: scorePercentage,       // Điểm quy đổi (0-100)
      passed: passed === 1,
      user_points: userEarnedPoints,         // Điểm thô user đạt được (ví dụ: 8)
      total_possible_points: totalPossiblePoints, // Tổng điểm thô tối đa (ví dụ: 10)
      is_next_topic_unlocked: isNextTopicUnlocked,
      submitted_at: resultRecord.createdAt
    });

  } catch (error) {
    console.error("Lỗi khi nộp bài Quiz:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

