export interface ListingItem {
  id: string;
  title: string;
  slug: string;
  listingType: "sale" | "rent";
  category: "land" | "house" | "apartment" | "villa";
  price: number; // in Billion VND for sale or Million VND/month for rent
  priceLabel: string;
  pricePerM2?: string;
  area: number; // m2
  location: string;
  district: string;
  ward?: string;
  city: string;
  images: string[];
  description: string;
  directions?: string;
  frontage?: string;
  bedrooms?: number;
  bathrooms?: number;
  legal?: string;
  brokerName: string;
  brokerAvatar: string;
  brokerPhone: string;
  createdAt: string;
  isVip?: boolean;
  isHot?: boolean;
  isOwner?: boolean;
}

export const sampleListings: ListingItem[] = [
  {
    id: "lst-01",
    title: "Bán gấp lô đất thổ cư 2 mặt tiền đường Nguyễn Phước Lan, Cẩm Lệ, Đà Nẵng",
    slug: "ban-gap-lo-dat-tho-cu-2-mat-tien-nguyen-phuoc-lan",
    listingType: "sale",
    category: "land",
    price: 4.8,
    priceLabel: "4.8 tỷ",
    pricePerM2: "48 tr/m²",
    area: 100,
    location: "Đường Nguyễn Phước Lan, Hòa Xuân, Cẩm Lệ",
    district: "Cẩm Lệ",
    ward: "Hòa Xuân",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Đất nền khu đô thị sinh thái Hòa Xuân, vị trí đắc địa gần sông thoáng mát. Cơ sở hạ tầng hoàn thiện, sổ đỏ chính chủ sẵn sàng sang tên ngay.",
    directions: "Đông Nam",
    frontage: "7.5m",
    legal: "Sổ đỏ/Sổ hồng",
    brokerName: "Nguyễn Văn Nam",
    brokerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0905 123 456",
    createdAt: "2 giờ trước",
    isVip: true,
    isOwner: true,
  },
  {
    id: "lst-02",
    title: "Bán đất biệt thự ven biển Mỹ Khê, Ngũ Hành Sơn - Đường 10.5m sầm uất",
    slug: "ban-dat-biet-thu-ven-bien-my-khe-ngu-hanh-son",
    listingType: "sale",
    category: "villa",
    price: 12.5,
    priceLabel: "12.5 tỷ",
    pricePerM2: "62.5 tr/m²",
    area: 200,
    location: "Đường Võ Nguyên Giáp, Mỹ An, Ngũ Hành Sơn",
    district: "Ngũ Hành Sơn",
    ward: "Mỹ An",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Lô đất biệt thự góc 2 mặt tiền cực kỳ lý tưởng để kinh doanh khách sạn, homestay hoặc ở nghỉ dưỡng ven biển Đà Nẵng.",
    directions: "Đông",
    frontage: "10m",
    legal: "Sổ đỏ/Sổ hồng",
    brokerName: "Lê Thị Mai Anh",
    brokerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0914 888 999",
    createdAt: "5 giờ trước",
    isHot: true,
  },
  {
    id: "lst-03",
    title: "Chính chủ cần bán nhà riêng 3 tầng đường Trần Phú, Quận Hải Châu",
    slug: "chinh-chu-ban-nha-3-tang-tran-phu-hai-chau",
    listingType: "sale",
    category: "house",
    price: 7.2,
    priceLabel: "7.2 tỷ",
    pricePerM2: "84.7 tr/m²",
    area: 85,
    location: "Trần Phú, Phường Phước Ninh, Hải Châu",
    district: "Hải Châu",
    ward: "Phước Ninh",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Nhà đúc 3 tầng kiên cố, nội thất gỗ tự nhiên cao cấp. Vị trí trung tâm quận Hải Châu, ô tô vào tận nhà.",
    directions: "Tây Nam",
    bedrooms: 3,
    bathrooms: 3,
    legal: "Sổ hồng riêng",
    brokerName: "Trần Hoàng Long",
    brokerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0935 777 666",
    createdAt: "1 ngày trước",
    isOwner: true,
  },
  {
    id: "lst-04",
    title: "Căn hộ chung cư cao cấp Azura ngắm cầu Sông Hàn, đầy đủ nội thất",
    slug: "can-ho-azura-ngam-cau-song-han",
    listingType: "sale",
    category: "apartment",
    price: 3.6,
    priceLabel: "3.6 tỷ",
    pricePerM2: "45 tr/m²",
    area: 80,
    location: "Trần Hưng Đạo, An Hải Bắc, Sơn Trà",
    district: "Sơn Trà",
    ward: "An Hải Bắc",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Căn hộ 2 phòng ngủ view sông tuyệt đẹp. Đang có hợp đồng thuê dài hạn 18tr/tháng thích hợp đầu tư tích sản.",
    directions: "Tây",
    bedrooms: 2,
    bathrooms: 2,
    legal: "Sổ hồng vĩnh viễn",
    brokerName: "Nguyễn Văn Nam",
    brokerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0905 123 456",
    createdAt: "1 ngày trước",
    isVip: true,
  },
  {
    id: "lst-05",
    title: "Đất nền khu đô thị Tây Bắc, Liên Chiểu - Gần đại học Bách Khoa",
    slug: "dat-nen-tay-bac-lien-chieu-gan-bach-khoa",
    listingType: "sale",
    category: "land",
    price: 2.35,
    priceLabel: "2.35 tỷ",
    pricePerM2: "23.5 tr/m²",
    area: 100,
    location: "Đường Nguyễn Chánh, Hòa Khánh Bắc, Liên Chiểu",
    district: "Liên Chiểu",
    ward: "Hòa Khánh Bắc",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Đất vuông vắn, quy hoạch chuẩn. Khu dân cư đông đúc, thích hợp xây dãy trọ hoặc nhà ở gia đình.",
    directions: "Bắc",
    frontage: "5m",
    legal: "Sổ đỏ chính chủ",
    brokerName: "Phạm Minh Tuấn",
    brokerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0978 444 555",
    createdAt: "2 ngày trước",
  },
  {
    id: "lst-06",
    title: "Cho thuê nguyên căn nhà mặt tiền đường Điện Biên Phủ, Thanh Khê",
    slug: "cho-thue-nha-mat-tien-dien-bien-phu-thanh-khe",
    listingType: "rent",
    category: "house",
    price: 25,
    priceLabel: "25 triệu/tháng",
    area: 120,
    location: "Điện Biên Phủ, Chính Gián, Thanh Khê",
    district: "Thanh Khê",
    ward: "Chính Gián",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Cho thuê mặt bằng kinh doanh hoặc mở văn phòng công ty. Nhà 3.5 tầng, vỉa hè rộng 5m thoải mái đỗ xe.",
    directions: "Đông Bắc",
    bedrooms: 4,
    bathrooms: 4,
    legal: "Hợp đồng dài hạn",
    brokerName: "Lê Thị Mai Anh",
    brokerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0914 888 999",
    createdAt: "3 ngày trước",
    isHot: true,
  },
  {
    id: "lst-07",
    title: "Cho thuê căn hộ Sơn Trà Ocean View 2PN nội thất sang trọng",
    slug: "cho-thue-can-ho-son-tra-ocean-view-2pn",
    listingType: "rent",
    category: "apartment",
    price: 12,
    priceLabel: "12 triệu/tháng",
    area: 75,
    location: "Ngô Quyền, Thọ Quang, Sơn Trà",
    district: "Sơn Trà",
    ward: "Thọ Quang",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Căn hộ đầy đủ tiện nghi: điều hòa, tủ lạnh, tivi, máy giặt. Tiện ích hồ bơi vô cực, gym, bảo vệ 24/7.",
    directions: "Đông",
    bedrooms: 2,
    bathrooms: 2,
    brokerName: "Trần Hoàng Long",
    brokerAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0935 777 666",
    createdAt: "3 ngày trước",
  },
  {
    id: "lst-08",
    title: "Bán lô đất vườn sinh thái Hòa Vang - Sổ hồng riêng sẵn sàng sang tên",
    slug: "ban-dat-vuon-sinh-thai-hoa-vang-danang",
    listingType: "sale",
    category: "land",
    price: 1.15,
    priceLabel: "1.15 tỷ",
    pricePerM2: "2.3 tr/m²",
    area: 500,
    location: "Xã Hòa Ninh, Huyện Hòa Vang",
    district: "Hòa Vang",
    ward: "Hòa Ninh",
    city: "Đà Nẵng",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=60"
    ],
    description: "Đất vườn view đồi Bà Nà Hills cực chill. Phù hợp làm bungalow nghỉ dưỡng cuối tuần hoặc nhà vườn sinh thái.",
    legal: "Sổ hồng chính chủ",
    brokerName: "Phạm Minh Tuấn",
    brokerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0978 444 555",
    createdAt: "4 ngày trước",
    isOwner: true,
  }
];
