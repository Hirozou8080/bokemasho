<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */


    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'storage/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['https://bokemasho.hirokilab.com', 'https://bokemasho-*.vercel.app'],
    'allowed_origins_patterns' => ['#^https://bokemasho-[a-z0-9]+-hirokilabs-projects\.vercel\.app$#'],
    'allowed_headers' => ['X-CSRF-TOKEN', 'X-XSRF-TOKEN', 'Content-Type', 'Accept', 'Authorization', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 0,
    // 'supports_credentials' => false,
    'supports_credentials' => true,
];
