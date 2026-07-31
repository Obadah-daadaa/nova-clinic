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
    | Set BRAND_LOGO="" to fall back to the built-in stethoscope mark.
    |
    | The shipped asset is the default here rather than being left to env,
    | because .env isn't in version control — an env-only default would mean
    | every fresh clone and every deploy silently showed the generic icon.
    |
    */

    'logo' => env('BRAND_LOGO', 'img/brand-logo.svg'),

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
