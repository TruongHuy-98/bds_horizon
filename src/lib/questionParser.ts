export interface ParsedQuestion {
  id: string;
  number: string;
  title: string;
  context?: string;
  type: 'Trắc nghiệm' | 'Đúng/Sai' | 'Tình huống' | 'Tự luận';
  options?: { key: string; text: string }[];
  subStatements?: { key: string; text: string }[];
  answer?: string;
  explanation?: string;
}

export function parseRawQuestionsText(rawText: string): ParsedQuestion[] {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const parsedQuestions: ParsedQuestion[] = [];
  let currentContext: string | undefined = undefined;
  let currentQuestion: Partial<ParsedQuestion> | null = null;
  let currentOptions: { key: string; text: string }[] = [];
  let currentSubStatements: { key: string; text: string }[] = [];

  const finalizeQuestion = () => {
    if (!currentQuestion || !currentQuestion.title) return;

    let qType: 'Trắc nghiệm' | 'Đúng/Sai' | 'Tình huống' | 'Tự luận' = 'Tự luận';

    if (currentContext && (currentOptions.length > 0 || currentSubStatements.length > 0)) {
      qType = 'Tình huống';
    } else if (currentOptions.length > 0) {
      qType = 'Trắc nghiệm';
    } else if (currentSubStatements.length > 0) {
      qType = 'Đúng/Sai';
    } else {
      qType = 'Tự luận';
    }

    parsedQuestions.push({
      id: 'parsed-' + Math.random().toString(36).substring(2, 9),
      number: currentQuestion.number || `${parsedQuestions.length + 1}`,
      title: currentQuestion.title,
      context: currentContext,
      type: qType,
      options: currentOptions.length > 0 ? [...currentOptions] : undefined,
      subStatements: currentSubStatements.length > 0 ? [...currentSubStatements] : undefined,
      answer: currentQuestion.answer,
      explanation: currentQuestion.explanation,
    });

    currentQuestion = null;
    currentOptions = [];
    currentSubStatements = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 1. Noise Filter Check (PHẦN I, PHẦN II, Thí sinh trả lời từ câu...)
    if (
      /^PHẦN\s+[I|V|X\d]+/i.test(line) ||
      /^Thí sinh\s+trả lời/i.test(line) ||
      /^---+/i.test(line) ||
      /^BẢNG CÂU HỎI/i.test(line)
    ) {
      continue;
    }

    // 2. Context Detection Check (Đọc tình huống:, Cho đoạn tư liệu:, Đọc đoạn văn:)
    if (
      /^(?:Đọc tình huống|Đọc đoạn văn|Cho đoạn tư liệu|Tình huống)[\:\s]+/i.test(line)
    ) {
      finalizeQuestion();
      currentContext = line.replace(/^(?:Đọc tình huống|Đọc đoạn văn|Cho đoạn tư liệu|Tình huống)[\:\s]+/i, '').trim();
      continue;
    }

    // 3. Question Header Detection (Câu X: / Bài X:)
    const qHeaderMatch = line.match(/^(?:Câu|Bài)\s*(\d+)[\.\:]\s*(.*)/i);
    if (qHeaderMatch) {
      finalizeQuestion();
      currentQuestion = {
        number: qHeaderMatch[1],
        title: qHeaderMatch[2].trim(),
      };
      continue;
    }

    // If we haven't started a question yet, continue
    if (!currentQuestion) continue;

    // 4. Option Detection (A. / B. / C. / D. or A) / B) / C) / D))
    const optionMatch = line.match(/^([A-D])[\.\)]\s*(.*)/i);
    if (optionMatch) {
      currentOptions.push({
        key: optionMatch[1].toUpperCase(),
        text: optionMatch[2].trim(),
      });
      continue;
    }

    // 5. Sub-statement Detection for Đúng/Sai (a) / b) / c) / d) or a. / b. / c. / d.)
    const subMatch = line.match(/^([a-d])[\.\)]\s*(.*)/i);
    if (subMatch) {
      currentSubStatements.push({
        key: subMatch[1].toLowerCase(),
        text: subMatch[2].trim(),
      });
      continue;
    }

    // 6. Answer Detection (Đáp án: A or Đáp án: Đúng/Sai)
    const answerMatch = line.match(/^(?:Đáp án|Đáp án đúng|Trả lời)[\:\s]+(.*)/i);
    if (answerMatch) {
      currentQuestion.answer = answerMatch[1].trim();
      continue;
    }

    // 7. Explanation Detection (Giải thích: / Căn cứ:)
    const expMatch = line.match(/^(?:Giải thích|Căn cứ)[\:\s]+(.*)/i);
    if (expMatch) {
      currentQuestion.explanation = expMatch[1].trim();
      continue;
    }

    // 8. If line is continuation of title or context
    if (currentQuestion.title) {
      currentQuestion.title += ' ' + line;
    }
  }

  // Finalize last question
  finalizeQuestion();

  return parsedQuestions;
}

export const SAMPLE_RAW_QUESTIONS_TEXT = `PHẦN I. CÂU HỎI TRẮC NGHIỆM ĐỒNG THỜI
Thí sinh trả lời từ câu 1 đến câu 4.

Câu 1: Theo Luật Kinh doanh Bất động sản mới nhất, cá nhân kinh doanh dịch vụ môi giới BĐS độc lập phải đáp ứng điều kiện nào sau đây?
A. Có chứng chỉ hành nghề môi giới BĐS và đăng ký hộ kinh doanh hoặc doanh nghiệp.
B. Không cần chứng chỉ hành nghề nếu chỉ làm môi giới tự do dưới 6 tháng.
C. Có bằng đại học chuyên ngành tài chính ngân hàng.
D. Phải ký quỹ 500 triệu đồng tại ngân hàng thương mại.
Đáp án: A
Giải thích: Theo Luật Kinh doanh BĐS, cá nhân hành nghề môi giới BĐS phải có chứng chỉ hành nghề và đăng ký thành lập doanh nghiệp hoặc hợp tác xã.

Câu 2: Thời hạn sử dụng của Giấy chứng nhận hành nghề môi giới BĐS được cấp theo quy định hiện hành là bao lâu?
A. 3 năm
B. 5 năm
C. 10 năm
D. Vô thời hạn
Đáp án: B

----------------------------------------
PHẦN II. CÂU HỎI ĐÚNG / SAI
Thí sinh trả lời Đúng hoặc Sai cho mỗi ý a), b), c), d).

Câu 3: Đánh giá các nhận định sau đây về hợp đồng đặt cọc mua bán nhà ở thương mại:
a) Hợp đồng đặt cọc bắt buộc phải chứng thực tại Ủy ban nhân dân cấp xã.
b) Bên nhận đặt cọc nếu từ chối giao kết hợp đồng phải trả cho bên đặt cọc tài sản đặt cọc và một khoản tiền tương ứng giá trị tài sản đặt cọc (trừ thỏa thuận khác).
c) Mức tiền đặt cọc nhà ở hình thành trong tương lai không được vượt quá 5% giá bán nhà ở.
d) Tiền đặt cọc chỉ có thể thanh toán bằng ngoại tệ usd.
Đáp án: b) Đúng, c) Đúng, a) Sai, d) Sai
Giải thích: Theo quy định mới, mức cọc nhà ở hình thành trong tương lai giới hạn tối đa 5% giá bán.

----------------------------------------
PHẦN III. CÂU HỎI ĐỌC TÌNH HUỐNG
Cho đoạn tư liệu: Ông Nguyễn Văn A ký hợp đồng môi giới với Sàn giao dịch BĐS Horizon để bán căn hộ chung cư cao cấp tại Quận Ngũ Hành Sơn, Đà Nẵng với giá 4.5 tỷ đồng. Trong hợp đồng quy định phí môi giới là 2% giá trị giao dịch. Sàn Horizon đã tìm được khách mua B là bà Trần Thị B đồng ý mua với đúng giá 4.5 tỷ.

Câu 4: Mức phí hoa hồng môi giới mà Sàn Horizon nhận được sau khi giao dịch thành công là bao nhiêu?
A. 45 triệu đồng
B. 90 triệu đồng
C. 135 triệu đồng
D. 180 triệu đồng
Đáp án: B
Giải thích: Phí môi giới = 4,500,000,000 x 2% = 90,000,000 VNĐ.

----------------------------------------
PHẦN IV. CÂU HỎI TỰ LUẬN
Thí sinh tự trình bày câu trả lời chi tiết.

Câu 5: Hãy phân tích 03 rủi ro pháp lý phổ biến nhất đối với khách hàng khi giao dịch mua bán nhà đất chưa có Sổ đỏ và đề xuất giải pháp phòng ngừa cho nhà môi giới.
`;
