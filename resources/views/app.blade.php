<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            /* Splash screen — inlined so it paints before app.css arrives. */
            #app-splash {
                position: fixed;
                inset: 0;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1.25rem;
                background-color: oklch(1 0 0);
                opacity: 1;
                transition: opacity 0.35s ease;
            }

            html.dark #app-splash {
                background-color: oklch(0.19 0.02 230);
            }

            #app-splash[data-state='hidden'] {
                opacity: 0;
                pointer-events: none;
            }

            #app-splash .splash-mark {
                width: 56px;
                height: 56px;
                border-radius: 14px;
                object-fit: contain;
            }

            #app-splash .splash-spinner {
                width: 24px;
                height: 24px;
                border: 2px solid oklch(0.9 0.012 90);
                border-top-color: oklch(0.36 0.07 205);
                border-radius: 50%;
                animation: splash-spin 0.7s linear infinite;
            }

            html.dark #app-splash .splash-spinner {
                border-color: oklch(0.3 0.02 225);
                border-top-color: oklch(0.74 0.1 195);
            }

            @keyframes splash-spin {
                to { transform: rotate(360deg); }
            }

            @media (prefers-reduced-motion: reduce) {
                #app-splash { transition: none; }
                #app-splash .splash-spinner { animation-duration: 2s; }
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />

        {{--
            Shown only when the server sent an empty app root — i.e. SSR is
            unavailable and React has to render everything client-side. With SSR
            the page is already painted, so a splash would hide real content.
            app.tsx removes this as soon as the app mounts.
        --}}
        <script>
            (function () {
                var root = document.getElementById('app');

                if (root && root.children.length > 0) {
                    return;
                }

                var logo = @json(config('branding.logo') ? asset(config('branding.logo')) : null);
                var splash = document.createElement('div');
                splash.id = 'app-splash';
                splash.setAttribute('role', 'status');
                splash.setAttribute('aria-label', 'Loading');
                splash.innerHTML =
                    (logo
                        ? '<img class="splash-mark" src="' + logo + '" alt="">'
                        : '') +
                    '<div class="splash-spinner"></div>';

                document.body.appendChild(splash);
            })();
        </script>
    </body>
</html>
