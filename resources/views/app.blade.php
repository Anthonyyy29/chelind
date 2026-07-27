<!doctype html>
<html lang="id">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{{ config('app.name', 'Chelind Football') }}</title>
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
            href="https://fonts.bunny.net/css?family=poppins:400,500,600,700,800,900"
            rel="stylesheet"
        />
        @vite(['resources/css/app.css', 'resources/js/main.jsx'])
    </head>
    <body>
        <div id="app"></div>
    </body>
</html>
