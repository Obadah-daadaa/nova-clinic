<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Brand name
    |--------------------------------------------------------------------------
    |
    | Shown in the sidebar, the public navbar and the browser title. Defaults
    | to the application name so a fresh install needs no extra config.
    |
    */

    'name' => env('BRAND_NAME', env('APP_NAME', 'Nova Clinic')),

    /*
    |--------------------------------------------------------------------------
    | Brand tagline
    |--------------------------------------------------------------------------
    |
    | Optional second word rendered next to the name in a muted colour, giving
    | the two-tone wordmark — e.g. BRAND_NAME="Nova" + BRAND_TAGLINE="Clinic"
    | renders "Nova Clinic". Left empty by default so the name from APP_NAME
    | isn't duplicated.
    |
    */

    'tagline' => env('BRAND_TAGLINE'),

    /*
    |--------------------------------------------------------------------------
    | Logo
    |--------------------------------------------------------------------------
    |
    | Path to a logo image, resolved from the public directory — for example
    | "img/logo.svg" for public/img/logo.svg. An absolute URL also works.
    | When empty the UI falls back to the built-in stethoscope mark, so the
    | app still looks finished before a real logo exists.
    |
    */

    'logo' => env('BRAND_LOGO'),

    /*
    |--------------------------------------------------------------------------
    | Dark mode logo
    |--------------------------------------------------------------------------
    |
    | Optional separate asset for dark backgrounds. Falls back to the logo
    | above when not set.
    |
    */

    'logo_dark' => env('BRAND_LOGO_DARK'),

];
