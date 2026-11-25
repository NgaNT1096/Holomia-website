<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite('resources/js/main.tsx')
    @inertiaHead
</head>
<body class="bg-[#0B0F19] text-[#F8FAFC] antialiased selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
    @inertia
</body>
</html>
