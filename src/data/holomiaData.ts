import { CaseStudy, EventPackage, InsightArticle } from '../types/holomia';

export const IMAGES = {
  heroArena: '/src/assets/images/hero_vr_arena_1795398226207.jpg',
  caseVov: '/src/assets/images/case_vov_event_1795398226348.jpg',
  caseSonDoong: '/src/assets/images/case_son_doong_1795398226885.jpg',
  caseTruongSon: '/src/assets/images/case_truong_son_1795398226173.jpg',
  caseLandmark: '/src/assets/images/case_landmark_venue_1795398225706.jpg',
  showroomLab: '/src/assets/images/showroom_living_lab_1795398226105.jpg',
  floorplanBlueprint: '/src/assets/images/arena_floorplan_blueprint_1795398914491.jpg',
  hardwareKit: '/src/assets/images/vr_hardware_kit_1795398913943.jpg',
  thumbEvent: '/src/assets/images/thumb_solution_event_1795401953196.jpg',
  thumbVenue: '/src/assets/images/thumb_solution_venue_1795401954537.jpg',
  thumbCustom: '/src/assets/images/thumb_solution_custom_1795401954687.jpg',
  platformVideoTablet: '/src/assets/images/platform_video_tablet_1795401954033.jpg',
};

export const PARTNERS = [
  'Meta',
  'VOV',
  'Oxalis Adventure',
  "Save Vietnam's Wildlife",
  'Landmark 81',
  'Lotte Center',
  'T20 Quảng Trị',
];

export const TRUST_COUNTERS = [
  {
    id: 'headsets',
    numericTarget: 100,
    suffix: ' Kính',
    label: 'Điều phối từ 1 Tablet',
  },
  {
    id: 'guests',
    numericTarget: 2000,
    suffix: '+',
    label: 'Lượt khách / ngày',
  },
  {
    id: 'years',
    numericTarget: 10,
    suffix: '+ Năm',
    label: 'R&D công nghệ XR',
  },
  {
    id: 'coverage',
    numericTarget: 63,
    suffix: ' Tỉnh',
    label: 'Toàn quốc & quốc tế',
  },
];

export const VENUE_FOOTPRINTS = [
  {
    id: 'compact',
    area: '50 m²',
    players: '6 – 8 kính',
    power: '1.5 kW',
    throughput: '600+ lượt/ngày',
    idealFor: 'Góc TTTM · Sự kiện',
  },
  {
    id: 'standard',
    area: '120 m²',
    players: '12 – 15 kính',
    power: '2.0 kW',
    throughput: '1.500+ lượt/ngày',
    idealFor: 'Landmark 81 · Arena',
  },
  {
    id: 'mega',
    area: '300 m²',
    players: '24 – 100 kính',
    power: '3.5 kW',
    throughput: '2.000+ lượt/ngày',
    idealFor: 'Sự kiện quốc gia',
  },
];

export const HARDWARE_SPECS = [
  { label: 'Mặt bằng', value: '50 – 300 m²' },
  { label: 'Thiết bị', value: 'Không dây · Không ba lô' },
  { label: 'Điều phối', value: '1 Tablet · 100 Kính' },
  { label: 'Điện năng', value: '~2.0 kW' },
];

export const PLATFORM_MODES = {
  journey: {
    id: 'journey' as const,
    tabLabel: 'Holomia Journey - Di sản',
    badgeLabel: 'Văn hóa & Du lịch',
    contentTitle: 'Hành trình Di sản & Triển lãm Số',
    venueExample: 'Bưu điện Hà Nội · Sơn Đoòng',
    sessionDuration: '5 phút / phiên',
    headsetCount: 15,
    throughputEstimate: '180 lượt/giờ',
    steps: [
      {
        id: 'prep',
        label: 'Chuẩn bị nhóm',
        detail: 'Giao 15 kính cho đoàn khách.',
        readyCount: 15,
        activeSessions: 0,
        completedGuests: 145,
      },
      {
        id: 'start',
        label: 'Bắt đầu phiên',
        detail: 'Phát đồng bộ chỉ bằng 1 chạm.',
        readyCount: 15,
        activeSessions: 1,
        completedGuests: 145,
      },
      {
        id: 'monitor',
        label: 'Theo dõi',
        detail: 'Quan sát trực quan trên Tablet.',
        readyCount: 15,
        activeSessions: 1,
        completedGuests: 160,
      },
      {
        id: 'rotate',
        label: 'Xoay vòng',
        detail: 'Sẵn sàng đón lượt khách mới.',
        readyCount: 15,
        activeSessions: 0,
        completedGuests: 175,
      },
    ],
  },
  arena: {
    id: 'arena' as const,
    tabLabel: 'Omega Arena - Giải trí',
    badgeLabel: 'Đấu trường Thương mại',
    contentTitle: 'Đấu trường Không dây 6v6',
    venueExample: 'Landmark 81 · Lotte Center',
    sessionDuration: '12 phút / trận',
    headsetCount: 12,
    throughputEstimate: '48 vé/giờ',
    steps: [
      {
        id: 'prep',
        label: 'Chuẩn bị nhóm',
        detail: 'Chia 2 đội & chọn bản đồ.',
        readyCount: 12,
        activeSessions: 0,
        completedGuests: 84,
      },
      {
        id: 'start',
        label: 'Bắt đầu phiên',
        detail: 'Di chuyển tự do không dây.',
        readyCount: 12,
        activeSessions: 1,
        completedGuests: 84,
      },
      {
        id: 'monitor',
        label: 'Theo dõi',
        detail: 'Phát bảng điểm ra màn hình sảnh.',
        readyCount: 12,
        activeSessions: 1,
        completedGuests: 96,
      },
      {
        id: 'rotate',
        label: 'Xoay vòng',
        detail: 'Chốt ca & đón nhóm tiếp theo.',
        readyCount: 12,
        activeSessions: 0,
        completedGuests: 108,
      },
    ],
  },
};

export const SOLUTION_PILLARS = [
  {
    id: 'event',
    number: '01',
    route: 'solutions-event' as const,
    tag: 'Agency & Nhãn hàng',
    title: 'Holomia Event',
    image: IMAGES.thumbEvent,
    imageAlt: 'Khu trải nghiệm sự kiện VR lưu lượng lớn Holomia Event',
    description:
      'Giải pháp sự kiện trọn gói 600 – 4.000 lượt khách/ngày. Được Meta và VOV tin dùng.',
    bullets: [
      'Đồng bộ phát nội dung đồng loạt tới 100 kính chỉ với 1 chạm',
      'Lắp đặt nhanh trong 120 phút tại bất kỳ sảnh triển lãm nào',
      'Chiết khấu và Rate Card chuyên biệt dành cho Event Agency',
    ],
    linkLabel: 'Xem bảng gói sự kiện & Chính sách Agency',
  },
  {
    id: 'venue',
    number: '02',
    route: 'solutions-venue' as const,
    tag: 'Chủ mặt bằng & TTTM',
    title: 'Holomia Venue',
    image: IMAGES.thumbVenue,
    imageAlt: 'Sàn giải trí thương mại không dây Holomia Venue tại trung tâm mua sắm',
    description:
      'Biến mặt bằng trống thành cỗ máy doanh thu kép. Mô hình đang vận hành tại Landmark 81 & Lotte Center.',
    bullets: [
      'Hợp tác chia sẻ doanh thu Rev-share 70/30 hoặc License theo năm',
      'Chuyển đổi tức thì giữa nội dung Di sản ban ngày và Arena buổi tối',
      'Báo cáo soát vé và lưu lượng khách theo thời gian thực',
    ],
    linkLabel: 'Tính thử lợi nhuận mặt bằng (ROI)',
  },
  {
    id: 'custom',
    number: '03',
    route: 'solutions-custom' as const,
    tag: 'Du lịch & Di sản',
    title: 'Holomia Custom',
    image: IMAGES.thumbCustom,
    imageAlt: 'Hệ thống mô phỏng VR9D và Vali VR Kit di động Holomia Custom',
    description:
      'Hệ thống mô phỏng VR5D/9D, Vali VR Kit và Số hóa di sản độc quyền theo đặt hàng.',
    bullets: [
      'Thiết kế ghế chuyển động thủy lực VR5D và buồng lái xe VR9D',
      'Vali triển lãm di động VR Kit chuẩn hành lý hàng không quốc tế',
      'Số hóa 3D Photogrammetry bảo tồn hang động, di tích lịch sử',
    ],
    linkLabel: 'Khám phá dự án Sơn Đoòng & Trường Sơn',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'vov-event',
    category: 'event',
    categoryLabel: 'Sự kiện lưu lượng lớn',
    title: 'Chuỗi sự kiện VOV',
    subtitle: 'Hà Nội · TP.HCM · Đà Nẵng · Đắk Lắk',
    location: '4 thành phố',
    headlineMetric: '1.500–2.000 khách/ngày',
    image: IMAGES.caseVov,
    imageAlt: 'Khách tham quan trải nghiệm VR đồng bộ tại sự kiện VOV',
    featuredSpan: 'wide',
    problem:
      'Khách xếp hàng ùn tắc khi cài đặt thủ công từng kính tại sự kiện đông.',
    solution:
      'Điều phối theo nhóm 5–15 khách từ 1 Tablet, mỗi phiên 5 phút xoay vòng liên tục.',
    results: [
      '1.500–2.000 lượt khách/ngày',
      'Xoay vòng dưới 45 giây',
      'Chỉ cần 3 nhân sự vận hành',
    ],
  },
  {
    id: 'oxalis-son-doong',
    category: 'heritage',
    categoryLabel: 'Du lịch & Di sản',
    title: 'Oxalis · Sơn Đoòng',
    subtitle: 'Quảng Bình & Quốc tế',
    location: 'Quảng Bình',
    headlineMetric: 'VR5D & 3 Vali VR Kit',
    image: IMAGES.caseSonDoong,
    imageAlt: 'Vali VR Kit và không gian tái hiện Hang Sơn Đoòng',
    featuredSpan: 'standard',
    problem:
      'Hang Sơn Đoòng giới hạn khách, khó mang trải nghiệm ra hội chợ quốc tế.',
    solution:
      'Đóng gói hệ thống VR5D và 3 bộ Vali VR Kit gọn nhẹ, mở vali ra là trình chiếu ngay.',
    results: [
      '3 Vali VR Kit lưu diễn toàn cầu',
      'Tái hiện ánh sáng, gió & hang động',
      'Tăng lượt đặt tour Phong Nha',
    ],
  },
  {
    id: 't20-quang-tri',
    category: 'heritage',
    categoryLabel: 'Du lịch & Di sản',
    title: 'T20 Quảng Trị',
    subtitle: 'Hang Chỉ Huy',
    location: 'Quảng Trị',
    headlineMetric: 'Xe VR9D Đường Trường Sơn',
    image: IMAGES.caseTruongSon,
    imageAlt: 'Hệ thống mô phỏng Xe VR9D Đường Trường Sơn tại Hang Chỉ Huy',
    featuredSpan: 'standard',
    problem:
      'Cần kể chuyện lịch sử sống động mà giữ nguyên trạng hang đá tự nhiên.',
    solution:
      'Lắp đặt Xe mô phỏng chuyển động VR9D gọn trong hang với chế độ 1 chạm.',
    results: [
      'Thu hút đông đảo đoàn du khách',
      'Chạy bền bỉ trong môi trường hang đá',
      'Ban quản lý tự vận hành dễ dàng',
    ],
  },
  {
    id: 'landmark-lotte',
    category: 'venue',
    categoryLabel: 'Điểm đến thương mại',
    title: 'Landmark 81 & Lotte Center',
    subtitle: 'TP.HCM & Hà Nội',
    location: 'TTTM Cao cấp',
    headlineMetric: 'Rev-share dài hạn',
    image: IMAGES.caseLandmark,
    imageAlt: 'Sàn đấu Omega Arena tại Landmark 81 và Lotte Center',
    featuredSpan: 'wide',
    problem:
      'TTTM cần khu giải trí gọn, đón cả gia đình ban ngày lẫn giới trẻ cuối tuần.',
    solution:
      'Vận hành kép không dây: Journey ban ngày, Omega Arena giờ cao điểm.',
    results: [
      'Doanh thu kép trên cùng diện tích',
      'Không dây, không ba lô nặng',
      'Đối soát doanh thu theo ca (70/30)',
    ],
  },
];

export const EVENT_PACKAGES: EventPackage[] = [
  {
    id: 'standard',
    name: 'Standard',
    scale: '6 kính · 1 Tablet',
    capacityPerDay: '600 – 800 lượt/ngày',
    staffing: '2 nhân sự',
    contentIncluded: '1 nội dung',
    twoDayPrice: '50 triệu đ',
    extraDayPrice: '15 triệu đ',
    recommendedFor: 'Hội chợ, ra mắt sản phẩm.',
  },
  {
    id: 'pro',
    name: 'Pro',
    scale: '12 kính · 2 cụm',
    capacityPerDay: '1.200 – 1.800 lượt/ngày',
    staffing: '3 nhân sự',
    contentIncluded: '2 nội dung',
    twoDayPrice: '85 triệu đ',
    extraDayPrice: '22 triệu đ',
    recommendedFor: 'Lễ hội thương hiệu, roadshow.',
    highlighted: true,
  },
  {
    id: 'mega',
    name: 'Mega',
    scale: '20–30 kính · Đa khu',
    capacityPerDay: '2.500 – 4.000 lượt/ngày',
    staffing: '5–6 nhân sự',
    contentIncluded: '2–3 nội dung',
    twoDayPrice: '150 triệu đ',
    extraDayPrice: '35 triệu đ',
    recommendedFor: 'Sự kiện quốc gia, triển lãm lớn.',
  },
];

export const SHOWROOM_LOCATIONS = [
  {
    id: 'hanoi',
    city: 'Hà Nội',
    name: 'Holomia Living Lab — Trụ sở chính',
    address: 'Tầng 6, Viwaseen Tower, 48 Tố Hữu, P. Đại Mỗ, Hà Nội',
    hours: 'Thứ 2 – Thứ 7 · 08:30 – 17:30',
    features: ['Sàn 15 kính thực tế', 'Tablet 1-ra-100', 'Vali VR Kit & VR5D'],
  },
  {
    id: 'hcm',
    city: 'TP. Hồ Chí Minh',
    name: 'Holomia Living Lab — Miền Nam',
    address: 'Khu trải nghiệm Đối tác B2B, Quận 1, TP. Hồ Chí Minh',
    hours: 'Đặt lịch theo khung giờ',
    features: ['Demo Omega Arena', 'Tư vấn Rev-share', 'Khảo sát mặt bằng'],
  },
];

export const ABOUT_MILESTONES = [
  {
    year: '2015 – 2018',
    title: 'Nền móng R&D XR',
    detail: 'Nghiên cứu nội dung 3D tương tác và hệ thống mô phỏng.',
  },
  {
    year: '2019 – 2022',
    title: 'Thương mại hóa & VR5D/9D',
    detail: 'Triển khai cụm VR thương mại và mô phỏng di sản.',
  },
  {
    year: '2023 – 2024',
    title: 'Holomia Platform & VR Kit',
    detail: 'Điều phối 1 Tablet nhiều kính cho Meta và chuỗi VOV.',
  },
  {
    year: '2025 – Nay',
    title: 'Mở rộng & Xuất khẩu',
    detail: 'Vận hành Landmark 81, Lotte Center, T20 Quảng Trị.',
  },
];

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    id: 'capacity-planning',
    category: 'Vận hành Sự kiện',
    readTime: '3 phút đọc',
    date: 'Tháng 10, 2026',
    title: 'Tính công suất trước khi chọn số kính',
    summary: 'Cách tính nhịp xoay vòng đạt 1.500+ lượt/ngày không ùn tắc.',
    keyTakeaways: [
      'Phiên sự kiện đông người lý tưởng là 4–5 phút.',
      'Điều phối nhóm qua Tablet giảm 70% thời gian chờ.',
      'Cụm 12 kính điều phối chuẩn hiệu quả hơn 20 kính cài tay.',
    ],
    body: [
      'Số lượng kính chỉ quyết định một nửa bài toán sự kiện; nửa còn lại nằm ở nhịp xoay vòng từng phiên.',
      'Tại Bưu điện Hà Nội và chuỗi VOV, Holomia chia khách theo nhóm 5–15 người và bấm lệnh đồng loạt trên một Tablet.',
      'Giữ nội dung 5 phút và chuyển lượt dưới 45 giây giúp cụm 12–15 kính đạt 150–200 lượt/giờ.',
    ],
  },
  {
    id: 'dual-mode-venue',
    category: 'Kinh doanh Mặt bằng',
    readTime: '4 phút đọc',
    date: 'Tháng 09, 2026',
    title: 'Một mặt bằng chạy cả Journey và Arena',
    summary: 'Tối ưu doanh thu theo khung giờ bằng 1 chạm đổi nội dung.',
    keyTakeaways: [
      'Ban ngày đón gia đình với nội dung di sản, khám phá.',
      'Buổi tối & cuối tuần chạy đấu trường Omega Arena bán vé.',
      'Không cần thay đổi phần cứng khi đổi mô hình.',
    ],
    body: [
      'Khách trung tâm thương mại thay đổi theo khung giờ: ban ngày là gia đình, tối và cuối tuần là giới trẻ.',
      'Tại Landmark 81 và Lotte Center, nhân sự đổi tức thì từ Holomia Journey sang Omega Arena ngay trên Tablet.',
    ],
  },
  {
    id: 'heritage-mr',
    category: 'Du lịch & Di sản',
    readTime: '3 phút đọc',
    date: 'Tháng 08, 2026',
    title: 'Đưa thực tế ảo vào không gian di sản',
    summary: 'Kể chuyện lịch sử sống động mà vẫn giữ nguyên trạng di tích.',
    keyTakeaways: [
      'Không đục phá hay ảnh hưởng cảnh quan nguyên bản.',
      'Vali VR Kit & kính không dây bố trí gọn tại sảnh.',
      'Tăng sức hút với du khách quốc tế và giới trẻ.',
    ],
    body: [
      'Tại Hang Chỉ Huy (Quảng Trị) hay Phong Nha – Kẻ Bàng, nguyên tắc tiên quyết là tôn trọng nguyên trạng di sản.',
      'Từ Vali VR Kit của Oxalis Adventure đến Xe VR9D trong hang đá, công nghệ giúp du khách cảm nhận câu chuyện trực quan hơn.',
    ],
  },
];
