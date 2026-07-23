export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | string;
  text: string;
}

export interface ExamQuestion {
  id: string;
  content: string;
  options: QuestionOption[];
  correctOption: "A" | "B" | "C" | "D" | string;
  explanation: string;
  type?: 'Trắc nghiệm' | 'Đúng/Sai' | 'Tình huống' | 'Tự luận';
  context?: string;
  subStatements?: { key: string; text: string }[];
}

export interface ExamSet {
  id: string;
  title: string;
  slug: string;
  certificateType: "Môi giới BĐS" | "Định giá BĐS" | "Quản lý Sàn BĐS";
  durationMinutes: number;
  passingScorePercent: number;
  questionCount: number;
  published: boolean;
  createdAt: string;
  questions: ExamQuestion[];
}

export const INITIAL_MOCK_EXAMS: ExamSet[] = [
  {
    id: "exam-1",
    title: "Đề thi thử Chứng chỉ Môi giới BĐS - Bộ đề số 01",
    slug: "de-thi-thu-chung-chi-moi-gioi-bds-bo-de-01",
    certificateType: "Môi giới BĐS",
    durationMinutes: 60,
    passingScorePercent: 70,
    questionCount: 40,
    published: true,
    createdAt: "2026-07-01T08:00:00.000Z",
    questions: [
      {
        id: "q-101",
        content: "Theo Luật Kinh doanh Bất động sản, tổ chức, cá nhân khi kinh doanh dịch vụ môi giới bất động sản phải có điều kiện gì?",
        options: [
          { key: "A", text: "Phải thành lập doanh nghiệp hoặc hợp tác xã và có tối thiểu 01 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "B", text: "Phải thành lập doanh nghiệp và có ít nhất 02 người có chứng chỉ hành nghề môi giới BĐS." },
          { key: "C", text: "Chỉ cần đăng ký hộ kinh doanh cá thể." },
          { key: "D", text: "Không bắt buộc có chứng chỉ hành nghề nếu kinh doanh tự do." }
        ],
        correctOption: "A",
        explanation: "Theo quy định pháp luật BĐS hiện hành, tổ chức, cá nhân kinh doanh dịch vụ môi giới BĐS phải thành lập doanh nghiệp hoặc hợp tác xã và có ít nhất 01 cá nhân có chứng chỉ hành nghề môi giới BĐS."
      },
      {
        id: "q-102",
        content: "Thời hạn hiệu lực của Chứng chỉ hành nghề môi giới bất động sản được cấp theo quy định mới là bao nhiêu năm?",
        options: [
          { key: "A", text: "3 năm" },
          { key: "B", text: "5 năm" },
          { key: "C", text: "10 năm" },
          { key: "D", text: "Vô thời hạn" }
        ],
        correctOption: "B",
        explanation: "Chứng chỉ hành nghề môi giới bất động sản có thời hạn sử dụng là 05 năm kể từ ngày được cấp."
      },
      {
        id: "q-103",
        content: "Hợp đồng môi giới bất động sản phải được lập thành văn bản hay có thể thỏa thuận bằng miệng?",
        options: [
          { key: "A", text: "Thỏa thuận bằng miệng nếu giá trị giao dịch dưới 1 tỷ đồng." },
          { key: "B", text: "Có thể lập bằng email hoặc tin nhắn SMS." },
          { key: "C", text: "Bắt buộc phải lập thành văn bản theo quy định pháp luật." },
          { key: "D", text: "Do hai bên tự quyết định hình thức." }
        ],
        correctOption: "C",
        explanation: "Hợp đồng kinh doanh dịch vụ bất động sản (bao gồm hợp đồng môi giới) phải được lập thành văn bản."
      },
      {
        id: "q-104",
        content: "Nhà môi giới BĐS có được nhận tiền hoa hồng môi giới trực tiếp từ khách hàng mà không qua sàn/doanh nghiệp môi giới không?",
        options: [
          { key: "A", text: "Được nhận tự do nếu khách hàng đồng ý." },
          { key: "B", text: "Cá nhân hành nghề môi giới trong doanh nghiệp không được tự ý thu phí ngoài hợp đồng dịch vụ môi giới." },
          { key: "C", text: "Tùy thuộc vào thỏa thuận miệng giữa môi giới và chủ nhà." },
          { key: "D", text: "Chỉ được nhận nếu giao dịch hoàn thành vào cuối tuần." }
        ],
        correctOption: "B",
        explanation: "Cá nhân hành nghề môi giới BĐS làm việc trong sàn/doanh nghiệp kinh doanh BĐS không được thu tiền môi giới vượt quá thỏa thuận trong hợp đồng hoặc thu phí ngoài quy định."
      }
    ]
  },
  {
    id: "exam-2",
    title: "Đề thi Pháp luật BĐS & Đất đai Đà Nẵng",
    slug: "de-thi-phap-luat-bds-dat-dai-da-nang",
    certificateType: "Môi giới BĐS",
    durationMinutes: 45,
    passingScorePercent: 70,
    questionCount: 30,
    published: true,
    createdAt: "2026-07-05T09:30:00.000Z",
    questions: [
      {
        id: "q-201",
        content: "Trường hợp nào sau đây đất đai được chuyển nhượng quyền sử dụng đất có điều kiện?",
        options: [
          { key: "A", text: "Đất có giấy chứng nhận (Sổ đỏ/Sổ hồng), không có tranh chấp, không bị kê biên và trong thời hạn sử dụng." },
          { key: "B", text: "Đất đang bị kê biên thi hành án." },
          { key: "C", text: "Đất hết thời hạn sử dụng đất." },
          { key: "D", text: "Đất đang có tranh chấp khiếu kiện." }
        ],
        correctOption: "A",
        explanation: "Các điều kiện chung để chuyển nhượng QSDĐ bao gồm: Có Giấy chứng nhận, đất không có tranh chấp, quyền sử dụng đất không bị kê biên và còn trong thời hạn sử dụng đất."
      },
      {
        id: "q-202",
        content: "Cơ quan nào có thẩm quyền cấp Giấy chứng nhận quyền sử dụng đất cho cá nhân, hộ gia đình?",
        options: [
          { key: "A", text: "UBND cấp Tỉnh / Sở Tài nguyên và Môi trường (hoặc Văn phòng Đăng ký đất đai)." },
          { key: "B", text: "UBND cấp Xã/Phường." },
          { key: "C", text: "Công an thành phố." },
          { key: "D", text: "Bộ Xây dựng." }
        ],
        correctOption: "A",
        explanation: "Thẩm quyền cấp Giấy chứng nhận thuộc về UBND tỉnh/thành phố hoặc ủy quyền cho Sở TN&MT / Văn phòng Đăng ký đất đai theo quy định Luật Đất đai."
      }
    ]
  },
  {
    id: "exam-3",
    title: "Đề thi Định giá Bất động sản Thành phố Đà Nẵng",
    slug: "de-thi-dinh-gia-bat-dong-san-da-nang",
    certificateType: "Định giá BĐS",
    durationMinutes: 50,
    passingScorePercent: 75,
    questionCount: 35,
    published: true,
    createdAt: "2026-07-10T14:15:00.000Z",
    questions: [
      {
        id: "q-301",
        content: "Phương pháp so sánh trực tiếp trong định giá BĐS dựa trên nguyên tắc nào?",
        options: [
          { key: "A", text: "Nguyên tắc thay thế" },
          { key: "B", text: "Nguyên tắc đóng góp" },
          { key: "C", text: "Nguyên tắc sử dụng tốt nhất và hiệu quả nhất" },
          { key: "D", text: "Nguyên tắc cung cầu" }
        ],
        correctOption: "A",
        explanation: "Phương pháp so sánh trực tiếp dựa trên nguyên tắc thay thế: một người mua thận trọng sẽ không trả giá cao hơn chi phí để mua một tài sản tương tự có cùng mức độ dụng ích."
      }
    ]
  },
  {
    id: "exam-4",
    title: "Đề thi Quản lý & Điều hành Sàn giao dịch BĐS",
    slug: "de-thi-quan-ly-dieu-hanh-san-giao-dich-bds",
    certificateType: "Quản lý Sàn BĐS",
    durationMinutes: 60,
    passingScorePercent: 70,
    questionCount: 40,
    published: false,
    createdAt: "2026-07-15T11:00:00.000Z",
    questions: [
      {
        id: "q-401",
        content: "Điều kiện về cơ sở vật chất kỹ thuật của Sàn giao dịch bất động sản bao gồm yếu tố nào?",
        options: [
          { key: "A", text: "Có địa điểm hoạt động ổn định, có diện tích và cơ sở kỹ thuật đáp ứng yêu cầu hoạt động." },
          { key: "B", text: "Phải có diện tích tối thiểu 500m² tại trung tâm quận." },
          { key: "C", text: "Chỉ cần trang web online không cần trụ sở." },
          { key: "D", text: "Phải thuê lại trụ sở của Nhà nước." }
        ],
        correctOption: "A",
        explanation: "Sàn giao dịch BĐS phải có địa điểm hoạt động ổn định trên 12 tháng, diện tích và trang thiết bị kỹ thuật phù hợp với hoạt động giao dịch BĐS."
      }
    ]
  }
];
