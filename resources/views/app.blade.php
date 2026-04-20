<!DOCTYPE html>
<html lang="ar" dir="rtl" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    <script>document.documentElement.classList.add('js-loading');</script>
    <style>
        .js-loading * {
            transition: none !important;
        }

        .js-loading .main_menu,
        .js-loading .fp__topbar,
        .js-loading nav {
            opacity: 0;
            transform: translateY(0) !important;
        }
    </style>

    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&family=Playpen+Sans+Arabic:wght@100..800&family=Fredoka:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/assets/EndUser/css/all.min.css" />

    @viteReactRefresh
    @vite('resources/js/app.tsx')

    @php
        $primaryColor = \App\Models\Setting::get('primary_color', '#f97316');
        $fontFamily = \App\Models\Setting::get('font_family', 'playpen_arabic');
        $siteLogo = \App\Models\Setting::get('site_logo') ?: '/assets/EndUser/images/logo-default.svg';
        $fontMap = [
            'playpen_arabic' => "'Playpen Sans Arabic', cursive",
            'marhey' => "'Marhey', cursive",
            'fredoka' => "'Fredoka', cursive",
            'instrument_sans' => "'Instrument Sans', ui-sans-serif, system-ui, sans-serif",
        ];
        $selectedFontStack = $fontMap[$fontFamily] ?? $fontMap['playpen_arabic'];
    @endphp
    <link rel="icon" href="{{ $siteLogo }}" sizes="any">
    <link rel="apple-touch-icon" href="{{ $siteLogo }}">
    <style>
        :root {
            --site-primary-color: {{ $primaryColor }};
            --site-primary-50: color-mix(in srgb, var(--site-primary-color) 8%, white);
            --site-primary-100: color-mix(in srgb, var(--site-primary-color) 14%, white);
            --site-primary-200: color-mix(in srgb, var(--site-primary-color) 24%, white);
            --site-primary-300: color-mix(in srgb, var(--site-primary-color) 40%, white);
            --site-primary-400: color-mix(in srgb, var(--site-primary-color) 72%, white);
            --site-primary-500: var(--site-primary-color);
            --site-primary-600: color-mix(in srgb, var(--site-primary-color) 88%, black);
            --site-primary-700: color-mix(in srgb, var(--site-primary-color) 76%, black);
            --site-primary-800: color-mix(in srgb, var(--site-primary-color) 62%, black);
            --site-primary-color-strong: color-mix(in srgb, var(--site-primary-color) 88%, black);
            --color-color-primary: var(--site-primary-color);
            --site-font-family: {!! $selectedFontStack !!};
            --font-sans: var(--site-font-family);
            --font-playpen-arabic: var(--site-font-family);
            --font-marhey: var(--site-font-family);
            --font-fredoka: var(--site-font-family);
        }

        body {
            font-family: var(--site-font-family);
        }
    </style>

    @inertiaHead
</head>

<body class="font-sans antialiased" dir="rtl">
    @inertia
</body>

</html>
