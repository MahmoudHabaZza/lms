# Hostinger Deployment Checklist

## 1. Preconditions

- Use PHP `8.2` or newer for this Laravel 12 project.
- Prefer a Hostinger `Business` or any `Cloud` plan if you want hPanel-managed Node.js / build workflows.
- If you are on standard web hosting, build Vite assets locally first, then upload the generated `public/build` directory.

## 2. Upload structure

- Keep the Laravel project one level above `public_html` when deploying manually.
- Expose only the contents of the Laravel `public/` directory through `public_html`.
- If you keep the full project in `public_html`, make sure the web root still points to Laravel's `public/` directory.

## 3. Environment

- Start from [.env.production.example](/D:/kid-coder/.env.production.example).
- Set real values for `APP_KEY`, `APP_URL`, database credentials, SMTP credentials, and `JWT_SECRET`.
- Keep `APP_DEBUG=false` in production.
- Use `FILESYSTEM_DISK=public` so uploaded files follow Laravel's public storage flow.

## 4. First deploy commands

```bash
composer install --no-dev --optimize-autoloader
php artisan key:generate --force
php artisan jwt:secret --force
php artisan migrate --force
php artisan storage:link
composer run deploy:optimize
```

## 5. Permissions

- Ensure `storage/` and `bootstrap/cache/` are writable by the PHP process.
- Typical safe permissions are directories `775` and files `664` when your hosting user and PHP user share the same group.
- If Hostinger uses a single account user for both, `755` directories and `644` files are usually enough, while `storage/` and `bootstrap/cache/` still need write access.

## 6. Cron

- Add Laravel scheduler cron:

```bash
/usr/bin/php /home/USERNAME/domains/DOMAIN/public_html/artisan schedule:run
```

- Replace `USERNAME` and `DOMAIN` with your Hostinger account values.

## 7. Build options

- Recommended for shared hosting: run `npm ci && npm run build` locally or in CI, then upload `public/build` with the rest of the release.
- Recommended for Hostinger Business / Cloud Node.js apps: let hPanel run the detected Vite build if you deploy through their Node.js app flow.

## 8. Post-deploy verification

- `php artisan about --only=environment`
- `php artisan route:cache`
- `php artisan config:cache`
- Open `/`, `/bookings`, `/contact`, `/student/login`, `/admin/login`
- Upload a test file and confirm `/storage/...` is publicly reachable
- Send a test email from admin settings

## 9. Project-specific notes

- This codebase now uses controller-based redirect routes, so `route:cache` is deploy-safe.
- A `composer run deploy:optimize` script was added to standardize production cache steps.
- Guest home page content is cached for 10 minutes to reduce repeated read queries.
