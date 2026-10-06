export interface LegalPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  category_id: string;
  cover_image: string;
  published: boolean;
  published_at: string;
  created_at: string;
  tags: string[];
  focus_keyword: string;
  seo_title: string;
  seo_description: string;
}

export const DEFAULT_LEGAL_POSTS: LegalPostItem[] = [
  {
    id: "news-pl-0",
    title: "Dịch vụ Tư vấn & Xử lý vướng mắc pháp lý dự án Bất động sản: Tháo gỡ điểm nghẽn, khơi thông dòng vốn",
    slug: "tu-van-va-xu-ly-vuong-mac-phap-ly-du-an-bat-dong-san",
    excerpt: "Giải pháp pháp lý dự án toàn diện cho Chủ đầu tư: Tháo gỡ chấp thuận chủ trương đầu tư, quy hoạch 1/500, định giá và tính tiền sử dụng đất, GPXD, nghiệm thu PCCC và điều kiện mở bán theo Luật Đất đai mới.",
    content: `Trong bối cảnh hệ sinh thái pháp luật bất động sản bước vào giai đoạn chuyển tiếp mang tính lịch sử với việc thực thi đồng bộ Luật Đất đai 2024, Luật Nhà ở 2023 và Luật Kinh doanh Bất động sản 2023, pháp lý dự án tiếp tục là mắt xích quyết định sự thành bại của mọi doanh nghiệp phát triển địa ốc. Thực tế cho thấy, hàng trăm dự án trên cả nước đang rơi vào trạng thái đình trệ kéo dài: hồ sơ chấp thuận chủ trương đầu tư ách tắc, quy hoạch chi tiết 1/500 xung đột với quy hoạch phân khu, chậm xác định giá đất để tính tiền sử dụng đất, hoặc gặp rào cản trong khâu cấp phép xây dựng và nghiệm thu phòng cháy chữa cháy.

Mỗi tháng dự án bị chậm trễ không chỉ làm gia tăng cấp số nhân gánh nặng lãi vay, mà còn làm xói mòn uy tín thương hiệu của Chủ đầu tư đối với đối tác và khách hàng. Thấu hiểu những trăn trở cốt lõi đó, Dịch vụ Tư vấn & Xử lý vướng mắc pháp lý dự án Bất động sản của chúng tôi mang đến giải pháp thực chiến toàn diện, giúp doanh nghiệp bóc tách từng nút thắt, tái cấu trúc pháp lý và đưa dự án về đích an toàn, đúng luật.

## 1. Các điểm nghẽn pháp lý dự án bất động sản phổ biến hiện nay

Thực tiễn thẩm định hồ sơ dự án cho thấy sự giao thoa phức tạp giữa Luật Đầu tư, Luật Đất đai, Luật Xây dựng, Luật Quy hoạch đô thị và Luật Đấu thầu tạo nên 5 nhóm rào cản phổ biến:

### 1.1. Chấp thuận chủ trương đầu tư & Lựa chọn nhà đầu tư
- Xung đột hình thức lựa chọn nhà đầu tư: Đấu giá quyền sử dụng đất, đấu thầu lựa chọn nhà đầu tư hay chấp thuận nhà đầu tư có quyền sử dụng đất theo quy định mới.
- Dự án có quỹ đất công xen kẹt, đất có nguồn gốc cổ phần hóa doanh nghiệp nhà nước hoặc đất quốc phòng - an ninh chuyển giao chưa hoàn tất thủ tục sắp xếp tài sản công.
- Hồ sơ đề xuất dự án bị ách tắc kéo dài do chưa đồng bộ với Quy hoạch tỉnh và Kế hoạch sử dụng đất cấp huyện.

### 1.2. Phê duyệt Quy hoạch chi tiết 1/500 & Điều chỉnh chỉ tiêu kiến trúc
- Sự không thống nhất giữa Quy hoạch phân khu (tỷ lệ 1/2000) và Quy hoạch chi tiết xây dựng (tỷ lệ 1/500) dẫn đến việc hồ sơ bị trả lại để xin ý kiến nhiều cấp.
- Khó khăn trong việc xin điều chỉnh cục bộ quy hoạch chi tiết: Tăng hệ số sử dụng đất, nâng tầng cao, điều chỉnh cơ cấu căn hộ hoặc bổ sung diện tích sàn thương mại dịch vụ.

### 1.3. Định giá đất & Tính tiền sử dụng đất dự án
- Đây là “nút thắt cổ chai” nan giải nhất khiến dự án không thể hoàn tất nghĩa vụ tài chính để được cấp Giấy phép xây dựng hoặc cấp Sổ hồng cho cư dân.
- Bất đồng trong việc áp dụng phương pháp định giá đất (phương pháp thặng dư, so sánh, hệ số điều chỉnh giá đất) giữa các cơ quan ban ngành và đơn vị tư vấn thẩm định giá.
- Thủ tục ban hành Quyết định giao đất, cho thuê đất và Thông báo nộp tiền sử dụng đất bị kéo dài qua nhiều chu kỳ ngân sách.

### 1.4. Thẩm định thiết kế cơ sở, Giấy phép xây dựng & Nghiệm thu PCCC
- Báo cáo đánh giá tác động môi trường (ĐTM) hoặc Giấy phép môi trường bị siết chặt tiêu chí kỹ thuật theo quy định mới.
- Quy chuẩn Phòng cháy chữa cháy (QCVN 06:2022/BXD và văn bản sửa đổi) có sự thay đổi liên tục, đòi hỏi hồ sơ thiết kế cơ sở phải điều chỉnh nhiều lần.
- Điều kiện khởi công công trình và nghiệm thu phần móng để đủ điều kiện ký hợp đồng mua bán nhà ở hình thành trong tương lai.

## 2. Vì sao Chủ đầu tư cần Đơn vị tư vấn pháp lý chuyên sâu thay vì tự xử lý?

Dù sở hữu bộ phận pháp chế nội bộ, nhiều Chủ đầu tư vẫn ưu tiên hợp tác cùng đơn vị tư vấn độc lập chuyên trách bởi các lợi thế vượt trội:

- Am hiểu cơ chế chuyển tiếp luật mới: Giai đoạn giao thời áp dụng Luật Đất đai 2024 tiềm ẩn nguy cơ hồi tố hoặc thiếu thông tư hướng dẫn. Đội ngũ luật sư chuyên trách sở hữu góc nhìn liên ngành sâu rộng, biết rõ điểm tựa pháp lý vững chắc nhất để bảo vệ hồ sơ.
- Thẩm định rủi ro độc lập (Legal Due Diligence): Cung cấp bức tranh toàn cảnh khách quan về "bệnh án pháp lý" của dự án, phát hiện kịp thời các rủi ro tiềm ẩn mà đội ngũ nội bộ có thể bỏ sót.
- Tiết kiệm chi phí cơ hội và tối ưu dòng vốn: Mỗi quý dự án được đẩy nhanh tiến độ sẽ giúp doanh nghiệp tiết kiệm hàng tỷ đồng chi phí vốn vay và nhanh chóng kích hoạt dòng tiền mở bán.
- Kỹ năng giải trình chuyên sâu: Xây dựng hệ thống văn bản kiến nghị, công văn giải trình với lập luận thuyết phục, viện dẫn các tiền lệ xử lý tương đương đã được cơ quan nhà nước chấp thuận.

## 3. Quy trình 5 bước tư vấn & tháo gỡ vướng mắc dự án BĐS

Chúng tôi thiết lập quy trình giải quyết hồ sơ chặt chẽ, bảo mật và đo lường kết quả theo từng cột mốc:

- Bước 1: Tiếp nhận hồ sơ & Ký kết Thỏa thuận bảo mật thông tin (NDA) tuyệt đối trước khi tiếp cận tài liệu.
- Bước 2: Thẩm định pháp lý chuyên sâu (Legal Due Diligence), bóc tách toàn diện các văn bản hành chính đã ban hành.
- Bước 3: Lập Báo cáo thẩm định rủi ro & Hoạch định Phương án giải quyết (bao gồm Kịch bản tối ưu và Kịch bản dự phòng).
- Bước 4: Soạn thảo hồ sơ giải trình chuẩn mực, đồng hành cùng Chủ đầu tư làm việc với các Sở, Ban, Ngành và UBND cấp tỉnh.
- Bước 5: Bàn giao văn bản chấp thuận đã tháo gỡ, tiếp tục hỗ trợ pháp lý cho các giai đoạn thi công, mở bán tiếp theo.

## 4. Các gói giải pháp pháp lý dự án chúng tôi cung cấp

Tùy theo nhu cầu và giai đoạn phát triển dự án, doanh nghiệp có thể lựa chọn các gói dịch vụ chuyên biệt:

- Gói 1: Tháo gỡ Chấp thuận chủ trương đầu tư, điều chỉnh tiến độ và gia hạn dự án đầu tư.
- Gói 2: Tư vấn pháp lý đất đai, giải phóng mặt bằng, chuyển mục đích sử dụng đất và giải quyết vướng mắc tính tiền sử dụng đất.
- Gói 3: Thẩm định pháp lý M&A, chuyển nhượng dự án, tái cấu trúc tài sản bảo đảm và thẩm định bên mua/bên bán.
- Gói 4: Chuẩn hóa pháp lý kinh doanh: Rà soát Hợp đồng mua bán, hoàn tất thủ tục bảo lãnh ngân hàng và văn bản đủ điều kiện mở bán.
- Gói 5: Đại diện giải quyết tranh chấp hợp đồng hợp tác kinh doanh (BCC) và xử lý khiếu nại quyết định hành chính liên quan đến dự án.

## 5. Cam kết đồng hành: Khả thi - Bảo mật - Tối ưu thời gian

- Cam kết tính khả thi thực tế: Mọi giải pháp pháp lý đều gắn liền với tính thực thi, không tư vấn lý thuyết chung chung.
- Bảo mật thông tin tuyệt đối: Bảo vệ 100% dữ liệu dự án, hồ sơ tài chính và chiến lược kinh doanh của khách hàng.
- Đồng hành đến khi có kết quả: Sát cánh cùng Ban Lãnh đạo Chủ đầu tư trong toàn bộ quá trình thẩm định và phê duyệt hồ sơ.`,
    author: "ThS. Luật sư Trần Đình Thắng & Ban Pháp Chế Horizon",
    category: "Pháp lý",
    category_id: "cat-phap-ly",
    cover_image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80",
    published: true,
    published_at: "2026-10-06T08:00:00.000Z",
    created_at: "2026-10-06T08:00:00.000Z",
    tags: ["Pháp lý dự án", "Chủ đầu tư", "Thẩm định pháp lý", "Tiền sử dụng đất", "Quy hoạch 1/500", "Luật Đất đai 2024"],
    focus_keyword: "tư vấn xử lý vướng mắc pháp lý dự án bất động sản",
    seo_title: "Dịch Vụ Tư Vấn & Xử Lý Vướng Mắc Pháp Lý Dự Án Bất Động Sản Toàn Diện",
    seo_description: "Giải pháp tư vấn và tháo gỡ điểm nghẽn pháp lý dự án BĐS: Chấp thuận chủ trương đầu tư, quy hoạch 1/500, tính tiền sử dụng đất, GPXD theo Luật Đất đai 2024."
  },
  {
    id: "news-pl-1",
    title: "Hướng dẫn chi tiết quy trình sang tên sổ đỏ tại Đà Nẵng mới nhất 2026",
    slug: "huong-dan-chi-tiet-quy-trinh-sang-ten-so-do-tai-da-nang-2026",
    excerpt: "Toàn bộ hồ sơ, biểu phí, thuế thu nhập cá nhân, lệ phí trước bạ và quy trình 4 bước sang tên Giấy chứng nhận quyền sử dụng đất tại Văn phòng Đăng ký đất đai.",
    content: `## 1. Điều kiện thực hiện sang tên sổ đỏ hợp pháp
Để giao dịch chuyển nhượng, tặng cho hoặc thừa kế quyền sử dụng đất có hiệu lực pháp lý, bất động sản cần đáp ứng các tiêu chí sau:
- Đã được cấp Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở và tài sản khác gắn liền với đất (Sổ đỏ / Sổ hồng).
- Đất không có tranh chấp khiếu nại hoặc đang trong quá trình thi hành án dân sự.
- Quyền sử dụng đất không bị kê biên để bảo đảm thi hành án.
- Đất còn trong thời hạn sử dụng theo quy định của Luật Đất đai hiện hành.

## 2. Bộ hồ sơ chuẩn bị sang tên sổ đỏ
Người chuyển nhượng và người nhận chuyển nhượng cần chuẩn bị đầy đủ các giấy tờ sau:
- Hợp đồng chuyển nhượng quyền sử dụng đất đã được công chứng chứng thực tại tổ chức hành nghề công chứng.
- Bản gốc Giấy chứng nhận quyền sử dụng đất (Sổ đỏ).
- Bản sao CCCD gắn chip và giấy xác nhận thông tin về cư trú của hai bên.
- Giấy chứng nhận đăng ký kết hôn (nếu tài sản chung vợ chồng) hoặc giấy xác nhận tình trạng hôn nhân độc thân.
- Tờ khai thuế thu nhập cá nhân và Tờ khai lệ phí trước bạ nhà đất theo mẫu hiện hành.

## 3. Quy trình 4 bước thực hiện tại Đà Nẵng
- Bước 1: Ký công chứng hợp đồng: Hai bên có mặt tại văn phòng công chứng trên địa bàn thành phố Đà Nẵng để kiểm tra bản chính và ký kết.
- Bước 2: Nộp hồ sơ tại Bộ phận Một cửa: Nộp tại Chi nhánh Văn phòng Đăng ký đất đai quận/huyện nơi có đất hoặc Trung tâm Hành chính công TP. Đà Nẵng.
- Bước 3: Thực hiện nghĩa vụ tài chính: Nhận thông báo thuế từ Chi cục Thuế và nộp thuế qua Kho bạc hoặc ứng dụng eTax Mobile.
- Bước 4: Nhận kết quả: Nộp biên lai xác nhận nộp thuế để nhận Sổ đỏ đã cập nhật biến động tên chủ sở hữu mới.

## 4. Các khoản thuế phí bắt buộc phải nộp
- Thuế thu nhập cá nhân (TNCN): 2% tính trên giá trị chuyển nhượng thực tế ghi trong hợp đồng (hoặc theo Bảng giá đất của UBND TP Đà Nẵng nếu giá ghi thấp hơn).
- Lệ phí trước bạ: 0.5% giá trị quyền sử dụng đất.
- Phí thẩm định hồ sơ & cấp đổi: Dao động từ 500.000đ - 1.500.000đ tùy loại hồ sơ.

## 5. Những lưu ý quan trọng để tránh bị trả hồ sơ
Đảm bảo thông tin nhân thân trên CCCD khớp hoàn toàn với thông tin trên Sổ đỏ. Trường hợp thửa đất có thay đổi hiện trạng diện tích do mở đường hoặc quy hoạch, cần đo đạc trích lục bản đồ địa chính trước khi nộp hồ sơ.`,
    author: "Luật sư Nguyễn Văn Hùng",
    category: "Pháp lý",
    category_id: "cat-phap-ly",
    cover_image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=60",
    published: true,
    published_at: "2026-10-01T08:00:00.000Z",
    created_at: "2026-10-01T08:00:00.000Z",
    tags: ["Pháp lý", "Sổ đỏ", "Đà Nẵng", "Thủ tục đất đai"],
    focus_keyword: "sang tên sổ đỏ đà nẵng",
    seo_title: "Quy trình sang tên sổ đỏ Đà Nẵng 2026 chuẩn xác nhất",
    seo_description: "Hướng dẫn trọn bộ thủ tục sang tên sổ đỏ tại Đà Nẵng, biểu thuế phí và cách xử lý hồ sơ nhanh chóng, đúng luật."
  },
  {
    id: "news-pl-2",
    title: "5 Rủi ro pháp lý cần lưu ý khi mua nhà đất dự án và cách phòng tránh",
    slug: "5-rui-ro-phap-ly-can-luu-y-khi-mua-nha-dat-du-an",
    excerpt: "Thẩm định hồ sơ pháp lý dự án là bước sống còn. Tìm hiểu 5 bẫy pháp lý phổ biến nhất: chưa có giấy phép xây dựng, sổ đỏ đang thế chấp ngân hàng và hợp đồng góp vốn lách luật.",
    content: `## 1. Dự án chưa đủ điều kiện mở bán và thiếu Giấy phép xây dựng
Nhiều chủ đầu tư chưa hoàn thành nghĩa vụ tài chính tiền sử dụng đất, chưa có Giấy phép xây dựng hoặc chưa nghiệm thu phần móng nhưng đã huy động vốn dưới hình thức Phiếu giữ chỗ, Thỏa thuận đặt cọc. Người mua đối mặt với nguy cơ dự án bị đình chỉ thi công vô thời hạn.

## 2. Chủ đầu tư thế chấp quyền sử dụng đất dự án tại Ngân hàng
Trước khi mở bán nhà ở hình thành trong tương lai, chủ đầu tư bắt buộc phải thực hiện thủ tục giải chấp một phần hoặc toàn bộ dự án tại ngân hàng, hoặc phải có văn bản đồng ý của ngân hàng cho phép bán kèm bảo lãnh bán hàng. Nếu không, người mua sẽ không thể làm sổ hồng sau khi nhận nhà.

## 3. Hợp đồng mua bán có điều khoản bất lợi, phạt cọc một chiều
Cần rà soát kỹ các điều khoản về:
- Thời hạn cam kết bàn giao nhà và mức phạt chậm bàn giao (thông thường từ 0.05%/ngày).
- Thời hạn cam kết nộp hồ sơ làm sổ hồng cho khách hàng.
- Tiêu chuẩn hoàn thiện thực tế so với phụ lục vật liệu bàn giao đính kèm.

## 4. Dự án dính quy hoạch treo hoặc thay đổi mật độ xây dựng
Trường hợp chủ đầu tư tự ý cơi nới tầng, thay đổi công năng tầng thương mại thành căn hộ ở mà không được cơ quan có thẩm quyền phê duyệt sẽ dẫn đến việc toàn bộ dự án bị từ chối cấp sổ hồng.

## 5. Giải pháp thẩm định pháp lý an toàn trước khi xuống tiền
Yêu cầu môi giới hoặc CĐT cung cấp: Quyết định giao đất, Bản vẽ quy hoạch 1/500, Giấy phép xây dựng và Văn bản đủ điều kiện bán hàng của Sở Xây Dựng. Đồng thời tham vấn ý kiến từ luật sư bất động sản chuyên trách hoặc đơn vị thẩm định độc lập.`,
    author: "Ban Pháp Chế Horizon",
    category: "Pháp lý",
    category_id: "cat-phap-ly",
    cover_image: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=60",
    published: true,
    published_at: "2026-10-02T09:00:00.000Z",
    created_at: "2026-10-02T09:00:00.000Z",
    tags: ["Pháp lý", "Dự án", "Thẩm định pháp lý", "Mua bán nhà đất"],
    focus_keyword: "rủi ro pháp lý mua nhà đất dự án",
    seo_title: "5 Rủi ro pháp lý khi mua nhà đất dự án và cách phòng tránh",
    seo_description: "Cẩm nang nhận diện và phòng ngừa rủi ro pháp lý dự án bất động sản hình thành trong tương lai."
  },
  {
    id: "news-pl-3",
    title: "Điểm mới Luật Đất đai về bảng giá đất thị trường và điều kiện cấp Giấy chứng nhận",
    slug: "diem-moi-luat-dat-dai-ve-gia-dat-va-cap-giay-chung-nhan",
    excerpt: "Luật Đất đai mới bỏ khung giá đất, xác định giá đất theo nguyên tắc thị trường và mở rộng hạn mức, điều kiện cấp sổ đỏ cho đất không có giấy tờ trước ngày 01/07/2014.",
    content: `## 1. Bãi bỏ khung giá đất và xây dựng Bảng giá đất hằng năm
Quy định mới bãi bỏ cơ chế khung giá đất của Chính phủ, giao quyền cho UBND cấp tỉnh xây dựng và trình HĐND thông qua Bảng giá đất áp dụng từ ngày 01/01 hằng năm. Điều này giúp giá đất đền bù giải tỏa tiệm cận giá thị trường, hạn chế tối đa khiếu kiện kéo dài.

## 2. Mở rộng điều kiện cấp Sổ đỏ cho đất không có giấy tờ
Hộ gia đình, cá nhân sử dụng đất ổn định trước ngày 01/07/2014 mà không có giấy tờ về quyền sử dụng đất, không vi phạm pháp luật đất đai và được UBND cấp xã xác nhận không có tranh chấp sẽ được xem xét cấp Giấy chứng nhận theo các mốc thời gian luật định.

## 3. Đơn giản hóa thủ tục hành chính và số hóa cơ sở dữ liệu đất đai
Người dân có thể tra cứu thông tin quy hoạch, tình trạng pháp lý thửa đất và nộp hồ sơ đăng ký biến động trực tuyến qua Cổng dịch vụ công Quốc gia mà không cần phải xếp hàng trực tiếp.

## 4. Tác động trực tiếp đến nhà đầu tư và người mua nhà ở thực
- Chi phí chuyển mục đích sử dụng đất lên thổ cư có thể tăng theo bảng giá đất sát thị trường.
- Pháp lý minh bạch hơn, giảm thiểu hiện tượng đầu cơ đất nông nghiệp đón đầu quy hoạch không khả thi.`,
    author: "ThS. Luật sư Trần Đình Thắng",
    category: "Pháp lý",
    category_id: "cat-phap-ly",
    cover_image: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&auto=format&fit=crop&q=60",
    published: true,
    published_at: "2026-10-03T10:00:00.000Z",
    created_at: "2026-10-03T10:00:00.000Z",
    tags: ["Luật Đất đai", "Pháp lý", "Bảng giá đất", "Sổ đỏ"],
    focus_keyword: "điểm mới luật đất đai bảng giá đất",
    seo_title: "Tác động của Luật Đất đai mới đến giá đất và thủ tục cấp sổ đỏ",
    seo_description: "Phân tích chuyên sâu các điểm mới trong Luật Đất đai tác động trực tiếp đến giao dịch bất động sản."
  }
];
