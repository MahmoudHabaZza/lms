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

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&family=Playpen+Sans+Arabic:wght@100..800&family=Fredoka:wght@300..700&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="/assets/EndUser/css/all.min.css" />

    @viteReactRefresh
    @vite('resources/js/app.tsx')

    @php
        $primaryColor = \App\Models\Setting::get('primary_color', '#f86f03');
        $fontFamily = \App\Models\Setting::get('font_family', 'playpen_arabic');
        $fontMap = [
            'playpen_arabic' => "'Playpen Sans Arabic', cursive",
            'marhey' => "'Marhey', cursive",
            'fredoka' => "'Fredoka', cursive",
            'instrument_sans' => "'Instrument Sans', ui-sans-serif, system-ui, sans-serif",
        ];
        $selectedFontStack = $fontMap[$fontFamily] ?? $fontMap['playpen_arabic'];
    @endphp
    <style>
        :root {
            --color-color-primary: {{ $primaryColor }};
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
