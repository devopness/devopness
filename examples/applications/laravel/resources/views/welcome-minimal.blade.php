<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>{{ $app }} — devopness-deploy-examples</title>
    <style>
        body { font-family: -apple-system, system-ui, sans-serif; max-width: 640px; margin: 4rem auto; padding: 0 1rem; color: #1a1a1a; line-height: 1.6; }
        code { background: #f4f4f5; padding: 0.15em 0.4em; border-radius: 0.25rem; font-size: 0.9em; }
        a { color: #6366f1; }
        .meta { color: #71717a; font-size: 0.9rem; }
    </style>
</head>
<body>
    <h1>devopness-deploy-examples · {{ $app }}</h1>
    <p>Booted at: <code>{{ $bootedAt }}</code></p>
    <p class="meta">PHP {{ PHP_VERSION }} · Laravel {{ app()->version() }}</p>
    <p>Health: <a href="/api/health">/api/health</a></p>
</body>
</html>
