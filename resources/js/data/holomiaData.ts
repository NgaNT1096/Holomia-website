
import type { CaseCategory, LeadModalType, LeadTag, PlatformModeId } from '../types/holomia';

/** Values are image-slot keys (see config/image_slots.php); ResilientImage resolves them from the CMS. */
export const IMAGES = {
  heroArena: 'img.hero_arena',
  caseVov: 'img.case_vov',
  caseSonDoong: 'img.case_son_doong',
  caseTruongSon: 'img.case_truong_son',
  caseLandmark: 'img.case_landmark',
  showroomLab: 'img.showroom_lab',
  floorplanBlueprint: 'img.floorplan_blueprint',
  hardwareKit: 'img.hardware_kit',
  thumbEvent: 'img.thumb_event',
  thumbVenue: 'img.thumb_venue',
  thumbCustom: 'img.thumb_custom',
  platformVideoTablet: 'img.platform_video_tablet',
};

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


export const MODAL_CONFIG: Record<
  Exclude<LeadModalType, null>,
  {
    tag: LeadTag;
    salesTeam: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    successTitle: string;
    successDetail: string;
  }
> = {
  'pitch-deck': {
    tag: 'pitch-deck-download',
    salesTeam: 'Bộ phận Tư vấn Giải pháp Doanh nghiệp',
    title: 'Tải Hồ sơ Năng lực (Pitch Deck)',
    subtitle:
      'Nhận ngay bộ tài liệu tổng quan hạ tầng Holomia Platform, các dự án đã triển khai cùng Meta, VOV, Oxalis và bảng thông số vận hành chuẩn.',
    ctaLabel: 'Nhận Pitch Deck ngay',
    successTitle: 'Hồ sơ năng lực đã sẵn sàng',
    successDetail:
      'Liên kết tải PDF đã được gửi tới email của anh/chị. Thông tin yêu cầu đã được gắn thẻ tự động tới Bộ phận Tư vấn Giải pháp Doanh nghiệp.',
  },
  'agency-rate-card': {
    tag: 'agency-rate-card',
    salesTeam: 'Đội ngũ Phụ trách Event Agency',
    title: 'Nhận Rate Card dành riêng cho Event Agency',
    subtitle:
      'Bao gồm chiết khấu đối tác Agency, tùy chọn nhận diện thương hiệu trên giao diện kính, check-in QR và phương án điều phối đa cụm.',
    ctaLabel: 'Gửi Rate Card qua Email / Zalo',
    successTitle: 'Đã gửi Rate Card Agency',
    successDetail:
      'Bảng giá chi tiết và chính sách chiết khấu Agency đã được chuyển tới email đăng ký và đồng bộ sang chuyên viên phụ trách mảng Sự kiện.',
  },
  'roi-excel': {
    tag: 'venue-roi-excel',
    salesTeam: 'Đội ngũ Phát triển Mặt bằng Thương mại',
    title: 'Nhận bảng tính Excel dự phóng 5 năm',
    subtitle:
      'File Excel cho phép điều chỉnh linh hoạt chi phí thuê mặt bằng, nhân sự ca trực, lịch bảo trì và tỷ lệ chia sẻ doanh thu 70/30.',
    ctaLabel: 'Gửi bảng tính Excel qua Email',
    successTitle: 'Đã gửi bảng tính dự phóng 5 năm',
    successDetail:
      'Mẫu Excel dự phóng dòng tiền theo cấu hình kính anh/chị đã chọn đã được gửi qua email và chuyển tới chuyên viên mảng Mặt bằng.',
  },
};

export const VENUE_MODES: Record<
  PlatformModeId,
  {
    id: PlatformModeId;
    tabLabel: string;
    kicker: string;
    title: string;
    description: string;
    timeSlot: string;
    targetAudience: string;
    sessionCycle: string;
    switchTime: string;
    image: string;
    imageAlt: string;
    metrics: { value: string; label: string }[];
  }
> = {
  journey: {
    id: 'journey',
    tabLabel: 'Holomia Journey',
    kicker: 'DI SẢN · TUYẾN TRẢI NGHIỆM',
    title: 'Holomia Journey',
    description:
      'Chia nhóm theo tuyến, đồng bộ nội dung và chuyển chặng theo kịch bản.',
    timeSlot: 'Ban ngày · 09:00 – 17:00',
    targetAudience: 'Gia đình, học sinh & khách tham quan',
    sessionCycle: '5–8 phút / lượt · Xoay vòng liên tục',
    switchTime: '1 chạm trên Tablet · Giữ nguyên sàn đấu',
    image: 'venue.journey',
    imageAlt: 'Trải nghiệm di sản Holomia Journey theo tuyến',
    metrics: [
      { value: '100', label: 'Giới hạn thiết bị' },
      { value: 'Theo tuyến', label: 'Điều phối phiên' },
      { value: 'Tablet', label: 'Điểm điều khiển' },
    ],
  },
  arena: {
    id: 'arena',
    tabLabel: 'Omega Arena',
    kicker: 'GIẢI TRÍ · SÀN CHƠI NHÓM',
    title: 'Omega Arena',
    description:
      'Chọn nội dung giải trí, tổ chức đội và khởi chạy phiên chơi trên cùng mặt bằng.',
    timeSlot: 'Buổi tối & Cuối tuần · 17:30 – 22:00',
    targetAudience: 'Nhóm bạn trẻ, đồng nghiệp & game thủ',
    sessionCycle: '12 phút / trận · Bảng điểm trực tiếp',
    switchTime: '1 chạm trên Tablet · Không tháo lắp phần cứng',
    image: 'venue.arena',
    imageAlt: 'Đấu trường nhóm không dây Omega Arena tại trung tâm thương mại',
    metrics: [
      { value: '100', label: 'Giới hạn thiết bị' },
      { value: 'Theo đội', label: 'Điều phối phiên' },
      { value: 'Tablet', label: 'Điểm điều khiển' },
    ],
  },
};

export const FILTERS: { id: CaseCategory; label: string }[] = [
  { id: 'all', label: 'Tất cả' },
  { id: 'event', label: 'Sự kiện lưu lượng lớn' },
  { id: 'heritage', label: 'Du lịch & Di sản' },
  { id: 'venue', label: 'Điểm đến thương mại' },
];

