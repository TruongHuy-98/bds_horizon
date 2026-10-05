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
