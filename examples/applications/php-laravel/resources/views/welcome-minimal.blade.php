<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Devopness ❤️ Laravel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 2rem 1rem;
            background: linear-gradient(135deg, #1e293b, #334155);
            font-family: Arial, sans-serif;
            text-align: center;
            color: white;
        }

        .container {
            width: 100%;
            max-width: 52rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 56px;
            background: white;
            padding: 40px 80px;
            border-radius: 20px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
        }

        .logo {
            height: auto;
            transition: transform 0.3s ease-in-out;
        }

        .logo:hover { transform: scale(1.15); }
        .logo-devopness { width: 16rem; padding-top: 1rem; }
        .logo-laravel { width: 13rem; }

        .heart { font-size: 80px; color: #e63946; }

        .description {
            max-width: 52rem;
            margin-top: 2rem;
            line-height: 1.6;
            color: #e2e8f0;
        }

        .description p { margin-bottom: 1rem; }

        .meta {
            margin-top: 2rem;
            font-size: 0.9rem;
            color: #94a3b8;
        }

        .meta a { color: #cbd5e1; }
        .meta code { background: rgba(255, 255, 255, 0.1); padding: 0.15em 0.4em; border-radius: 0.25rem; }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://assets.devopness.com/images/logo-devopness-primary.svg" alt="Devopness Logo" class="logo logo-devopness">
        <div class="heart">❤️</div>
        <img src="https://assets.devopness.com/images/icons_svgs/laravel.svg" alt="Laravel Logo" class="logo logo-laravel">
    </div>

    <div class="description">
        <p>With Devopness, you can easily set up and manage your Laravel app deployments in the cloud without hassle.</p>
        <p>Automate server provisioning, implement CI/CD pipelines, and scale your project with just a few clicks.</p>
    </div>

    <p class="meta">
        PHP {{ PHP_VERSION }} · Laravel {{ app()->version() }} · Booted at <code>{{ $bootedAt }}</code> · Health: <a href="/api/health">/api/health</a>
    </p>
</body>
</html>
