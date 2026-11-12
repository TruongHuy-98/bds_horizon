const { createClient } = require('@supabase/supabase-js');

const url = process.env.VITE_SUPABASE_URL || 'https://riwjvyhwrwfwwdmwrqzx.supabase.co';
const secretKey = process.env.SUPABASE_SECRET_KEY || '';

if (!secretKey) {
  console.error('Error: Please provide SUPABASE_SECRET_KEY as an environment variable to run seeding.');
  process.exit(1);
}

const supabase = createClient(url, secretKey, {
  auth: { persistSession: false }
});

async function runSeed() {
  console.log('--- STARTING AUTOMATED DATABASE SEEDING ---');

  // 1. Categories
  const categories = [
    { id: '11111111-1111-1111-1111-111111111101', name: 'Đất nền', slug: 'dat-nen', description: 'Đất nền thổ cư, đất phân lô sinh thái Hòa Xuân, Nam Hòa Xuân' },
    { id: '11111111-1111-1111-1111-111111111102', name: 'Căn hộ chung cư', slug: 'can-ho', description: 'Căn hộ view biển Sơn Trà, view Sông Hàn cao cấp' },
    { id: '11111111-1111-1111-1111-111111111103', name: 'Nhà phố trung tâm', slug: 'nha-pho', description: 'Nhà mặt tiền kinh doanh Hải Châu, Thanh Khê' },
    { id: '11111111-1111-1111-1111-111111111104', name: 'Biệt thự nghỉ dưỡng', slug: 'biet-thu', description: 'Biệt thự ven biển Mỹ Khê, Sơn Trà, Ngũ Hành Sơn' }
  ];

  console.log('Seeding categories...');
  const { data: catData, error: catErr } = await supabase.from('categories').upsert(categories, { onConflict: 'slug' }).select();
  if (catErr) console.error('Categories error:', catErr);
  else console.log(`✓ Seeded ${catData.length} categories.`);

  // 2. Projects
  const projects = [
    {
      id: '22222222-2222-2222-2222-222222222201',
      name: 'Sun Ponte Residence',
      slug: 'sun-ponte-residence',
      description: 'Tổ hợp căn hộ cao cấp và shophouse mặt tiền Trần Hưng Đạo, trực diện Sông Hàn và cầu Rồng.',
      developer: 'Sun Group',
      location: 'Trần Hưng Đạo, Sơn Trà, Đà Nẵng',
      scale: '495 căn hộ cao cấp',
      status: 'Đang mở bán',
      price_from: '5.5 tỷ',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80'
      ],
      published: true
    },
    {
      id: '22222222-2222-2222-2222-222222222202',
      name: 'The Filmore Da Nang',
      slug: 'the-filmore-da-nang',
      description: 'Dự án căn hộ boutique chuẩn 5 sao quốc tế bên bờ Tây Sông Hàn, thiết kế kiến trúc Cá Chép Hóa Rồng.',
      developer: 'Filmore Development',
      location: 'Bạch Đằng, Bình Thuận, Hải Châu, Đà Nẵng',
      scale: '206 căn hộ cao cấp',
      status: 'Đang bàn giao',
      price_from: '7.2 tỷ',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80'],
      published: true
    },
    {
      id: '22222222-2222-2222-2222-222222222203',
      name: 'Vinhomes Golden Bay',
      slug: 'vinhomes-golden-bay',
      description: 'Đại đô thị biển sinh thái thông minh lớn nhất phía Bắc Đà Nẵng, liền kề Cảng nước sâu Liên Chiểu.',
      developer: 'Vingroup',
      location: 'Đường Nguyễn Tất Thành, Liên Chiểu, Đà Nẵng',
      scale: '1.200 căn hộ & nhà phố',
      status: 'Sắp mở bán',
      price_from: '3.2 tỷ',
      image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=80'],
      published: true
    },
    {
      id: '22222222-2222-2222-2222-222222222204',
      name: 'Da Nang Landmark Tower',
      slug: 'da-nang-landmark-tower',
      description: 'Tháp đôi biểu tượng mới bên bờ Sông Hàn theo tiêu chuẩn công nghệ Nhật Bản chống động đất và bão cấp 15.',
      developer: 'Cosmos Initia',
      location: 'Bạch Đằng nối dài, Hải Châu, Đà Nẵng',
      scale: '446 căn hộ cao cấp',
      status: 'Đang mở bán',
      price_from: '6.8 tỷ',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'],
      published: true
    },
    {
      id: '22222222-2222-2222-2222-222222222205',
      name: 'Sun Cosmo Residence',
      slug: 'sun-cosmo-residence',
      description: 'Giao lộ phồn vinh ngay đầu cầu Trần Thị Lý kết nối Hải Châu và Ngũ Hành Sơn.',
      developer: 'Sun Group',
      location: 'Trần Thị Lý, Ngũ Hành Sơn, Đà Nẵng',
      scale: '650 căn hộ & townhouse',
      status: 'Đang mở bán',
      price_from: '5.2 tỷ',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80'],
      published: true
    },
    {
      id: '22222222-2222-2222-2222-222222222206',
      name: 'Nam Hòa Xuân Eco City',
      slug: 'nam-hoa-xuan-eco-city',
      description: 'Khu đô thị sinh thái 4 mặt sông lớn nhất Đông Nam Đà Nẵng, công viên cây xanh và bến du thuyền quốc tế.',
      developer: 'Sun Group',
      location: 'Nguyễn Phước Lan nối dài, Hòa Quý, Ngũ Hành Sơn',
      scale: '1.500 lô biệt thự & đất nền',
      status: 'Đang mở bán',
      price_from: '4.5 tỷ',
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80',
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80'],
      published: true
    }
  ];

  console.log('Seeding projects...');
  const { data: projData, error: projErr } = await supabase.from('projects').upsert(projects, { onConflict: 'slug' }).select();
  if (projErr) console.error('Projects error:', projErr);
  else console.log(`✓ Seeded ${projData.length} projects.`);

  // 3. Properties
  const properties = [
    {
      id: '33333333-3333-3333-3333-333333333301',
      title: 'Bán gấp lô đất thổ cư 2 mặt tiền đường Nguyễn Phước Lan, Cẩm Lệ, Đà Nẵng',
      slug: 'ban-gap-lo-dat-tho-cu-2-mat-tien-nguyen-phuoc-lan',
      description: 'Đất nền khu đô thị sinh thái Hòa Xuân, vị trí đắc địa gần sông thoáng mát. Cơ sở hạ tầng hoàn thiện, sổ đỏ chính chủ sẵn sàng sang tên ngay.',
      price: 4.8,
      price_label: '4.8 tỷ',
      area: 100,
      bedrooms: 0,
      bathrooms: 0,
      address: 'Đường Nguyễn Phước Lan, Hòa Xuân, Cẩm Lệ, Đà Nẵng',
      district: 'Cẩm Lệ',
      property_type: 'Đất nền',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60'
      ],
      tags: ['VIP', 'Chính chủ', 'Sổ đỏ sẵn'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      title: 'Bán đất biệt thự ven biển Mỹ Khê, Ngũ Hành Sơn - Đường 10.5m sầm uất',
      slug: 'ban-dat-biet-thu-ven-bien-my-khe-ngu-hanh-son',
      description: 'Lô đất biệt thự góc 2 mặt tiền cực kỳ lý tưởng để kinh doanh khách sạn, homestay hoặc ở nghỉ dưỡng ven biển Đà Nẵng.',
      price: 12.5,
      price_label: '12.5 tỷ',
      area: 200,
      bedrooms: 0,
      bathrooms: 0,
      address: 'Đường Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn, Đà Nẵng',
      district: 'Ngũ Hành Sơn',
      property_type: 'Biệt thự',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60'],
      tags: ['Hot', 'Ven biển', 'Mặt tiền'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333303',
      title: 'Chính chủ cần bán nhà riêng 3 tầng đường Trần Phú, Quận Hải Châu',
      slug: 'chinh-chu-ban-nha-3-tang-tran-phu-hai-chau',
      description: 'Nhà đúc 3 tầng kiên cố, nội thất gỗ tự nhiên cao cấp. Vị trí trung tâm quận Hải Châu, ô tô vào tận nhà, gần chợ Hàn và sông Hàn.',
      price: 7.2,
      price_label: '7.2 tỷ',
      area: 85,
      bedrooms: 3,
      bathrooms: 3,
      address: 'Trần Phú, Phường Phước Ninh, Hải Châu, Đà Nẵng',
      district: 'Hải Châu',
      property_type: 'Nhà phố',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60'],
      tags: ['Chính chủ', 'Sổ hồng riêng', 'Trung tâm'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333304',
      title: 'Căn hộ chung cư cao cấp Azura ngắm cầu Sông Hàn, đầy đủ nội thất',
      slug: 'can-ho-azura-ngam-cau-song-han',
      description: 'Căn hộ 2 phòng ngủ view sông tuyệt đẹp. Đang có hợp đồng thuê dài hạn 18tr/tháng thích hợp đầu tư tích sản.',
      price: 3.6,
      price_label: '3.6 tỷ',
      area: 80,
      bedrooms: 2,
      bathrooms: 2,
      address: 'Trần Hưng Đạo, An Hải Bắc, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      property_type: 'Căn hộ',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60'],
      tags: ['VIP', 'View Sông Hàn', 'Full nội thất'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333305',
      title: 'Đất nền khu đô thị Tây Bắc, Liên Chiểu - Gần đại học Bách Khoa',
      slug: 'dat-nen-tay-bac-lien-chieu-gan-bach-khoa',
      description: 'Đất vuông vắn, quy hoạch chuẩn. Khu dân cư đông đúc, thích hợp xây dãy trọ hoặc nhà ở gia đình, gần cảng Liên Chiểu.',
      price: 2.35,
      price_label: '2.35 tỷ',
      area: 100,
      bedrooms: 0,
      bathrooms: 0,
      address: 'Đường Nguyễn Chánh, Hòa Khánh Bắc, Liên Chiểu, Đà Nẵng',
      district: 'Liên Chiểu',
      property_type: 'Đất nền',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&auto=format&fit=crop&q=60'],
      tags: ['Giá tốt', 'Quy hoạch chuẩn'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333306',
      title: 'Cho thuê nguyên căn nhà mặt tiền đường Điện Biên Phủ, Thanh Khê',
      slug: 'cho-thue-nha-mat-tien-dien-bien-phu-thanh-khe',
      description: 'Cho thuê mặt bằng kinh doanh hoặc mở văn phòng công ty. Nhà 3.5 tầng, vỉa hè rộng 5m thoải mái đỗ xe.',
      price: 25,
      price_label: '25 triệu/tháng',
      area: 120,
      bedrooms: 4,
      bathrooms: 4,
      address: 'Điện Biên Phủ, Chính Gián, Thanh Khê, Đà Nẵng',
      district: 'Thanh Khê',
      property_type: 'Nhà phố',
      listing_type: 'rent',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60'],
      tags: ['Cho thuê', 'Mặt tiền', 'Kinh doanh'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333307',
      title: 'Cho thuê căn hộ Sơn Trà Ocean View 2PN nội thất sang trọng',
      slug: 'cho-thue-can-ho-son-tra-ocean-view-2pn',
      description: 'Căn hộ đầy đủ tiện nghi: điều hòa, tủ lạnh, tivi, máy giặt. Tiện ích hồ bơi vô cực, gym, bảo vệ 24/7.',
      price: 12,
      price_label: '12 triệu/tháng',
      area: 75,
      bedrooms: 2,
      bathrooms: 2,
      address: 'Ngô Quyền, Thọ Quang, Sơn Trà, Đà Nẵng',
      district: 'Sơn Trà',
      property_type: 'Căn hộ',
      listing_type: 'rent',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60'],
      tags: ['Cho thuê', 'View biển', 'Hồ bơi'],
      published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333308',
      title: 'Bán lô đất vườn sinh thái Hòa Vang - Sổ hồng riêng sẵn sàng sang tên',
      slug: 'ban-dat-vuon-sinh-thai-hoa-vang-danang',
      description: 'Đất vườn view đồi Bà Nà Hills cực chill. Phù hợp làm bungalow nghỉ dưỡng cuối tuần hoặc nhà vườn sinh thái.',
      price: 1.15,
      price_label: '1.15 tỷ',
      area: 500,
      bedrooms: 0,
      bathrooms: 0,
      address: 'Xã Hòa Ninh, Huyện Hòa Vang, Đà Nẵng',
      district: 'Hòa Vang',
      property_type: 'Đất nền',
      listing_type: 'sale',
      status: 'available',
      image_url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60',
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60'],
      tags: ['Đất vườn', 'Sinh thái', 'Bà Nà Hills'],
      published: true
    }
  ];

  console.log('Seeding properties...');
  const { data: propData, error: propErr } = await supabase.from('properties').upsert(properties, { onConflict: 'slug' }).select();
  if (propErr) console.error('Properties error:', propErr);
  else console.log(`✓ Seeded ${propData.length} properties.`);

  // 4. News Posts
  const news = [
    {
      id: '44444444-4444-4444-4444-444444444401',
      title: 'Hướng dẫn chi tiết quy trình sang tên sổ đỏ tại Đà Nẵng mới nhất 2026',
      slug: 'quy-trinh-sang-ten-so-do-da-nang-2026',
      excerpt: 'Toàn bộ hồ sơ, biểu phí, thuế thu nhập cá nhân, lệ phí trước bạ và quy trình 4 bước sang tên Giấy chứng nhận quyền sử dụng đất tại Văn phòng Đăng ký đất đai.',
      content: 'Chi tiết về quy trình thủ tục sang tên sổ đỏ theo Luật Đất đai mới tại Thành phố Đà Nẵng...',
      category: 'Pháp lý',
      cover_image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&auto=format&fit=crop&q=80',
      published: true,
      published_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444402',
      title: '5 Rủi ro pháp lý cần lưu ý khi mua nhà đất dự án và cách phòng tránh',
      slug: '5-rui-ro-phap-ly-khi-mua-nha-dat-du-an',
      excerpt: 'Những bẫy pháp lý thường gặp như dự án chưa nghiệm thu, thế chấp ngân hàng và cách kiểm tra quy hoạch trước khi đặt cọc.',
      content: 'Để bảo vệ an toàn dòng vốn khi mua bất động sản hình thành trong tương lai...',
      category: 'Pháp lý',
      cover_image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
      published: true,
      published_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444403',
      title: 'Điểm mới Luật Đất đai về bảng giá đất thị trường và điều kiện cấp Giấy chứng nhận',
      slug: 'diem-moi-luat-dat-dai-bang-gia-dat-thi-truong',
      excerpt: 'Quy định bỏ khung giá đất, áp dụng bảng giá đất sát giá thị trường và những tác động trực tiếp đến tiền sử dụng đất tại Đà Nẵng.',
      content: 'Luật Đất đai sửa đổi mang lại sự minh bạch lớn cho thị trường bất động sản...',
      category: 'Pháp lý',
      cover_image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&auto=format&fit=crop&q=80',
      published: true,
      published_at: new Date(Date.now() - 345600000).toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444404',
      title: 'Thị trường Bất động sản Đà Nẵng quý 2/2026 tăng trưởng tích cực',
      slug: 'thi-truong-bds-da-nang-quy-2-2026-tang-truong',
      excerpt: 'Thanh khoản phân khúc căn hộ và đất nền sinh thái ven sông bứt phá với hơn 1.800 giao dịch thành công trong quý vừa qua.',
      content: 'Báo cáo nghiên cứu thị trường Đà Nẵng ghi nhận sự phục hồi mạnh mẽ...',
      category: 'Thị trường BĐS',
      cover_image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80',
      published: true,
      published_at: new Date(Date.now() - 864000000).toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444405',
      title: 'Đà Nẵng công bố bản đồ quy hoạch phân khu đô thị mới đến năm 2030',
      slug: 'da-nang-cong-bo-ban-do-quy-hoach-phan-khu-2030',
      excerpt: 'Chi tiết 12 phân khu chức năng được số hóa đồng bộ, tạo hành lang pháp lý minh bạch cho các nhà đầu tư chiến lược.',
      content: 'Bản đồ quy hoạch đô thị Đà Nẵng đến 2030 với tầm nhìn đến 2045...',
      category: 'Quy hoạch & Pháp lý',
      cover_image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
      published: true,
      published_at: new Date(Date.now() - 1296000000).toISOString()
    }
  ];

  console.log('Seeding news posts...');
  const { data: newsData, error: newsErr } = await supabase.from('news_posts').upsert(news, { onConflict: 'slug' }).select();
  if (newsErr) console.error('News error:', newsErr);
  else console.log(`✓ Seeded ${newsData.length} news posts.`);

  console.log('--- ALL DATA SEEDED SUCCESSFULLY INTO SUPABASE! ---');
}

runSeed().catch(console.error);
