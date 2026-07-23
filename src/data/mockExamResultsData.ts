import { QuestionOption } from "./mockExamsData";

export interface CandidateAnswer {
  questionId: string;
  questionContent: string;
  options: QuestionOption[];
  selectedOption: "A" | "B" | "C" | "D";
  correctOption: "A" | "B" | "C" | "D";
  isCorrect: boolean;
  explanation: string;
}

export interface ExamResult {
  id: string;
  candidateName: string;
  candidatePhone: string;
  candidateEmail: string;
  candidateAvatar: string;
  examId: string;
  examTitle: string;
  certificateType: "Môi giới BĐS" | "Định giá BĐS" | "Quản lý Sàn BĐS";
  scoreText: string;
  scorePercent: number;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  timeSpentMinutes: number;
  passed: boolean;
  submittedAt: string;
  answers: CandidateAnswer[];
}

export const INITIAL_MOCK_EXAM_RESULTS: ExamResult[] = [
  {
    id: "res-101",
    candidateName: "Nguyễn Văn Hùng",
    candidatePhone: "0905 123 456",
    candidateEmail: "hung.nguyen@gmail.com",
    candidateAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    examId: "exam-1",
    examTitle: "Đề thi thử Chứng chỉ Môi giới BĐS - Bộ đề số 01",
    certificateType: "Môi giới BĐS",
    scoreText: "32/40 câu",
    scorePercent: 80,
    correctAnswersCount: 32,
    totalQuestionsCount: 40,
    timeSpentMinutes: 45,
    passed: true,
    submittedAt: "2026-07-23 14:30",
    answers: [
      {
        questionId: "q-101",
        questionContent: "Theo Luật Kinh doanh Bất động sản, tổ chức, cá nhân khi kinh doanh dịch vụ môi giới bất động sản phải có điều kiện gì?",
        options: [
          { key: "A", text: "Phải thành lập doanh nghiệp hoặc hợp tác xã và có tối thiểu 01 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "B", text: "Phải thành lập doanh nghiệp và có ít nhất 02 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "C", text: "Chỉ cần đăng ký hộ kinh doanh cá thể." },
          { key: "D", text: "Không bắt buộc có chứng chỉ hành nghề nếu kinh doanh tự do." }
        ],
        selectedOption: "A",
        correctOption: "A",
        isCorrect: true,
        explanation: "Theo quy định pháp luật BĐS hiện hành, tổ chức, cá nhân kinh doanh dịch vụ môi giới BĐS phải thành lập doanh nghiệp hoặc hợp tác xã và có ít nhất 01 cá nhân có chứng chỉ hành nghề môi giới BĐS."
      },
      {
        questionId: "q-102",
        questionContent: "Thời hạn hiệu lực của Chứng chỉ hành nghề môi giới bất động sản được cấp theo quy định mới là bao nhiêu năm?",
        options: [
          { key: "A", text: "3 năm" },
          { key: "B", text: "5 năm" },
          { key: "C", text: "10 năm" },
          { key: "D", text: "Vô thời hạn" }
        ],
        selectedOption: "B",
        correctOption: "B",
        isCorrect: true,
        explanation: "Chứng chỉ hành nghề môi giới bất động sản có thời hạn sử dụng là 05 năm kể từ ngày được cấp."
      },
      {
        questionId: "q-103",
        questionContent: "Hợp đồng môi giới bất động sản phải được lập thành văn bản hay có thể thỏa thuận bằng miệng?",
        options: [
          { key: "A", text: "Thỏa thuận bằng miệng nếu giá trị giao dịch dưới 1 tỷ đồng." },
          { key: "B", text: "Có thể lập bằng email hoặc tin nhắn SMS." },
          { key: "C", text: "Bắt buộc phải lập thành văn bản theo quy định pháp luật." },
          { key: "D", text: "Do hai bên tự quyết định hình thức." }
        ],
        selectedOption: "A",
        correctOption: "C",
        isCorrect: false,
        explanation: "Hợp đồng kinh doanh dịch vụ bất động sản (bao gồm hợp đồng môi giới) phải được lập thành văn bản."
      }
    ]
  },
  {
    id: "res-102",
    candidateName: "Trần Thị Mai",
    candidatePhone: "0914 987 654",
    candidateEmail: "maitran.bds@outlook.com",
    candidateAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    examId: "exam-1",
    examTitle: "Đề thi thử Chứng chỉ Môi giới BĐS - Bộ đề số 01",
    certificateType: "Môi giới BĐS",
    scoreText: "36/40 câu",
    scorePercent: 90,
    correctAnswersCount: 36,
    totalQuestionsCount: 40,
    timeSpentMinutes: 52,
    passed: true,
    submittedAt: "2026-07-23 11:15",
    answers: [
      {
        questionId: "q-101",
        questionContent: "Theo Luật Kinh doanh Bất động sản, tổ chức, cá nhân khi kinh doanh dịch vụ môi giới bất động sản phải có điều kiện gì?",
        options: [
          { key: "A", text: "Phải thành lập doanh nghiệp hoặc hợp tác xã và có tối thiểu 01 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "B", text: "Phải thành lập doanh nghiệp và có ít nhất 02 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "C", text: "Chỉ cần đăng ký hộ kinh doanh cá thể." },
          { key: "D", text: "Không bắt buộc có chứng chỉ hành nghề nếu kinh doanh tự do." }
        ],
        selectedOption: "A",
        correctOption: "A",
        isCorrect: true,
        explanation: "Theo quy định pháp luật BĐS hiện hành, tổ chức, cá nhân kinh doanh dịch vụ môi giới BĐS phải thành lập doanh nghiệp hoặc hợp tác xã và có ít nhất 01 cá nhân có chứng chỉ hành nghề môi giới BĐS."
      }
    ]
  },
  {
    id: "res-103",
    candidateName: "Lê Hoàng Nam",
    candidatePhone: "0935 222 333",
    candidateEmail: "hoangnam.danang@gmail.com",
    candidateAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
    examId: "exam-2",
    examTitle: "Đề thi Pháp luật BĐS & Đất đai Đà Nẵng",
    certificateType: "Môi giới BĐS",
    scoreText: "18/30 câu",
    scorePercent: 60,
    correctAnswersCount: 18,
    totalQuestionsCount: 30,
    timeSpentMinutes: 40,
    passed: false,
    submittedAt: "2026-07-23 09:45",
    answers: [
      {
        questionId: "q-201",
        questionContent: "Trường hợp nào sau đây đất đai được chuyển nhượng quyền sử dụng đất có điều kiện?",
        options: [
          { key: "A", text: "Đất có giấy chứng nhận (Sổ đỏ/Sổ hồng), không có tranh chấp, không bị kê biên và trong thời hạn sử dụng." },
          { key: "B", text: "Đất đang bị kê biên thi hành án." },
          { key: "C", text: "Đất hết thời hạn sử dụng đất." },
          { key: "D", text: "Đất đang có tranh chấp khiếu kiện." }
        ],
        selectedOption: "D",
        correctOption: "A",
        isCorrect: false,
        explanation: "Các điều kiện chung để chuyển nhượng QSDĐ bao gồm: Có Giấy chứng nhận, đất không có tranh chấp, quyền sử dụng đất không bị kê biên và còn trong thời hạn sử dụng đất."
      }
    ]
  },
  {
    id: "res-104",
    candidateName: "Phạm Quốc Bảo",
    candidatePhone: "0978 444 555",
    candidateEmail: "baopq.realty@yahoo.com",
    candidateAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    examId: "exam-3",
    examTitle: "Đề thi Định giá Bất động sản Thành phố Đà Nẵng",
    certificateType: "Định giá BĐS",
    scoreText: "28/35 câu",
    scorePercent: 80,
    correctAnswersCount: 28,
    totalQuestionsCount: 35,
    timeSpentMinutes: 42,
    passed: true,
    submittedAt: "2026-07-22 16:20",
    answers: [
      {
        questionId: "q-301",
        questionContent: "Phương pháp so sánh trực tiếp trong định giá BĐS dựa trên nguyên tắc nào?",
        options: [
          { key: "A", text: "Nguyên tắc thay thế" },
          { key: "B", text: "Nguyên tắc đóng góp" },
          { key: "C", text: "Nguyên tắc sử dụng tốt nhất và hiệu quả nhất" },
          { key: "D", text: "Nguyên tắc cung cầu" }
        ],
        selectedOption: "A",
        correctOption: "A",
        isCorrect: true,
        explanation: "Phương pháp so sánh trực tiếp dựa trên nguyên tắc thay thế."
      }
    ]
  },
  {
    id: "res-105",
    candidateName: "Đặng Thu Thảo",
    candidatePhone: "0903 888 999",
    candidateEmail: "thao.dtt@land.vn",
    candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    examId: "exam-1",
    examTitle: "Đề thi thử Chứng chỉ Môi giới BĐS - Bộ đề số 01",
    certificateType: "Môi giới BĐS",
    scoreText: "26/40 câu",
    scorePercent: 65,
    correctAnswersCount: 26,
    totalQuestionsCount: 40,
    timeSpentMinutes: 58,
    passed: false,
    submittedAt: "2026-07-22 10:05",
    answers: [
      {
        questionId: "q-101",
        questionContent: "Theo Luật Kinh doanh Bất động sản, tổ chức, cá nhân khi kinh doanh dịch vụ môi giới bất động sản phải có điều kiện gì?",
        options: [
          { key: "A", text: "Phải thành lập doanh nghiệp hoặc hợp tác xã và có tối thiểu 01 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "B", text: "Phải thành lập doanh nghiệp và có ít nhất 02 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "C", text: "Chỉ cần đăng ký hộ kinh doanh cá thể." },
          { key: "D", text: "Không bắt buộc có chứng chỉ hành nghề nếu kinh doanh tự do." }
        ],
        selectedOption: "C",
        correctOption: "A",
        isCorrect: false,
        explanation: "Theo quy định pháp luật BĐS hiện hành, tổ chức, cá nhân kinh doanh dịch vụ môi giới BĐS phải thành lập doanh nghiệp hoặc hợp tác xã và có ít nhất 01 cá nhân có chứng chỉ hành nghề môi giới BĐS."
      }
    ]
  },
  {
    id: "res-106",
    candidateName: "Vũ Tuấn Anh",
    candidatePhone: "0982 111 222",
    candidateEmail: "tuananh.vu@gmail.com",
    candidateAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    examId: "exam-4",
    examTitle: "Đề thi Quản lý & Điều hành Sàn giao dịch BĐS",
    certificateType: "Quản lý Sàn BĐS",
    scoreText: "31/40 câu",
    scorePercent: 77.5,
    correctAnswersCount: 31,
    totalQuestionsCount: 40,
    timeSpentMinutes: 50,
    passed: true,
    submittedAt: "2026-07-21 15:40",
    answers: [
      {
        questionId: "q-401",
        questionContent: "Điều kiện về cơ sở vật chất kỹ thuật của Sàn giao dịch bất động sản bao gồm yếu tố nào?",
        options: [
          { key: "A", text: "Có địa điểm hoạt động ổn định, có diện tích và cơ sở kỹ thuật đáp ứng yêu cầu hoạt động." },
          { key: "B", text: "Phải có diện tích tối thiểu 500m² tại trung tâm quận." },
          { key: "C", text: "Chỉ cần trang web online không cần trụ sở." },
          { key: "D", text: "Phải thuê lại trụ sở của Nhà nước." }
        ],
        selectedOption: "A",
        correctOption: "A",
        isCorrect: true,
        explanation: "Sàn giao dịch BĐS phải có địa điểm hoạt động ổn định trên 12 tháng, diện tích và trang thiết bị kỹ thuật phù hợp."
      }
    ]
  },
  {
    id: "res-107",
    candidateName: "Bùi Thị Ngọc",
    candidatePhone: "0969 555 777",
    candidateEmail: "ngoc.bui@sunland.vn",
    candidateAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    examId: "exam-2",
    examTitle: "Đề thi Pháp luật BĐS & Đất đai Đà Nẵng",
    certificateType: "Môi giới BĐS",
    scoreText: "25/30 câu",
    scorePercent: 83.3,
    correctAnswersCount: 25,
    totalQuestionsCount: 30,
    timeSpentMinutes: 38,
    passed: true,
    submittedAt: "2026-07-21 08:30",
    answers: [
      {
        questionId: "q-201",
        questionContent: "Trường hợp nào sau đây đất đai được chuyển nhượng quyền sử dụng đất có điều kiện?",
        options: [
          { key: "A", text: "Đất có giấy chứng nhận (Sổ đỏ/Sổ hồng), không có tranh chấp, không bị kê biên và trong thời hạn sử dụng." },
          { key: "B", text: "Đất đang bị kê biên thi hành án." },
          { key: "C", text: "Đất hết thời hạn sử dụng đất." },
          { key: "D", text: "Đất đang có tranh chấp khiếu kiện." }
        ],
        selectedOption: "A",
        correctOption: "A",
        isCorrect: true,
        explanation: "Các điều kiện chung để chuyển nhượng QSDĐ bao gồm: Có Giấy chứng nhận, đất không có tranh chấp..."
      }
    ]
  }
];
