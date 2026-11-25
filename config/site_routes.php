<?php

/* Public pages: one component route, a path and SEO text per language. */
return [
    'home' => [
        'vi' => ['path' => '/', 'title' => 'Holomia — Hạ tầng Vận hành Thực tế ảo Thương mại',
            'description' => 'Holomia Platform điều phối đồng thời nhiều kính VR từ một Tablet cho sự kiện, trung tâm thương mại và du lịch di sản.'],
        'en' => ['path' => '/en', 'title' => 'Holomia — Commercial Virtual Reality Operations',
            'description' => 'Holomia Platform runs many VR headsets from a single tablet for events, shopping malls and heritage tourism.'],
    ],
    'platform' => [
        'vi' => ['path' => '/nen-tang', 'title' => 'Nền tảng lõi — Holomia', 'description' => 'Điều phối đa kính VR không dây từ một Tablet, triển khai trên mặt bằng 50–300 m².'],
        'en' => ['path' => '/en/platform', 'title' => 'Core platform — Holomia', 'description' => 'Control many wireless VR headsets from one tablet on floors from 50 to 300 m².'],
    ],
    'solutions-event' => [
        'vi' => ['path' => '/giai-phap/su-kien', 'title' => 'VR trọn gói cho sự kiện — Holomia', 'description' => 'Thiết bị, nội dung và đội ngũ điều phối VR trọn gói cho sự kiện lưu lượng lớn.'],
        'en' => ['path' => '/en/solutions/events', 'title' => 'Turnkey VR for events — Holomia', 'description' => 'Hardware, content and an operations crew for high-traffic events.'],
    ],
    'solutions-venue' => [
        'vi' => ['path' => '/giai-phap/mat-bang', 'title' => 'Khai thác sàn VR thương mại — Holomia', 'description' => 'Hợp tác chia sẻ doanh thu hoặc cấp phép hằng năm cho chủ mặt bằng.'],
        'en' => ['path' => '/en/solutions/venues', 'title' => 'Commercial VR venues — Holomia', 'description' => 'Revenue sharing or annual licensing for venue owners.'],
    ],
    'solutions-custom' => [
        'vi' => ['path' => '/giai-phap/du-an-rieng', 'title' => 'VR5D/9D & Số hóa Di sản — Holomia', 'description' => 'Phần cứng và nội dung theo đặt hàng cho bảo tàng, du lịch và triển lãm.'],
        'en' => ['path' => '/en/solutions/custom', 'title' => 'VR5D/9D & heritage digitisation — Holomia', 'description' => 'Bespoke hardware and content for museums, tourism and exhibitions.'],
    ],
    'case-studies' => [
        'vi' => ['path' => '/du-an', 'title' => 'Dự án đã triển khai — Holomia', 'description' => 'Các dự án thực tế ảo cho sự kiện, di sản và điểm đến thương mại.'],
        'en' => ['path' => '/en/projects', 'title' => 'Projects — Holomia', 'description' => 'Virtual reality projects for events, heritage and commercial destinations.'],
    ],
    'showroom' => [
        'vi' => ['path' => '/showroom', 'title' => 'Showroom Living Lab — Holomia', 'description' => 'Đặt lịch trải nghiệm 30 phút tại Holomia Living Lab.'],
        'en' => ['path' => '/en/showroom', 'title' => 'Living Lab Showroom — Holomia', 'description' => 'Book a 30-minute hands-on visit to the Holomia Living Lab.'],
    ],
    'about' => [
        'vi' => ['path' => '/ve-chung-toi', 'title' => 'Về Holomia & Tin tức', 'description' => 'Hành trình phát triển công nghệ XR của Holomia và góc nhìn ngành.'],
        'en' => ['path' => '/en/about', 'title' => 'About Holomia & insights', 'description' => "Holomia's XR journey and industry insights."],
    ],
];
