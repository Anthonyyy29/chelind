# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Chelind Football — a Chelsea FC fan/news site. One repo holds both:

- **Backend**: Laravel 13 REST JSON API under `/api/*`. **Not Inertia** — the starter kit's Inertia+Fortify scaffolding was removed; only Vite/Tailwind/Wayfinder remain.
- **Frontend**: React 19 SPA (plain JSX, not TSX, despite TypeScript/tsconfig being present) using `react-router-dom`, built with `laravel-vite-plugin`. Entry is `resources/js/main.jsx` → `App.jsx`, not Inertia pages.

Auth is **native Laravel session-cookie auth, not Sanctum** — a deliberate decision (see `petunjuk1.md` §7) because frontend and backend are same-origin. The frontend must call `GET /api/csrf-cookie` once before `POST /api/login`, and axios is preconfigured in `resources/js/api/client.js` (`withCredentials`, `withXSRFToken`) — always import that shared instance rather than creating a new axios instance.

Full API contract (endpoints, request/response shapes, error format) lives in `API.md` — read it before touching any controller, request, or resource under `app/Http/**`. It documents things not obvious from code alone, e.g. slugs/`author_id`/`published_at` are server-derived and must never be sent from the frontend, cover images/photos delete from storage on record delete, and role `master` gates `/api/admin/users` and `/api/admin/roles` (`admin` gets `403`).

Domain models: Article/Category (news CMS), Player, GameMatch (auto-synced from football-data.org for Chelsea via `matches:sync`, scheduled every 15 min — returns `data: []` until `FOOTBALL_DATA_API_KEY` is set), Transfer, SocialLink, User/Role.

### Routing model

There is no server-side page routing beyond one catch-all. `routes/web.php` renders `resources/views/app.blade.php` for any path not starting with `/api`; React Router (`resources/js/App.jsx`) owns all client-side page routing. `routes/api.php` is the only other route file and is the source of truth for available endpoints — cross-check it against `API.md` since the latter can drift out of date.

### Reference mockups

`refrence/` (intentional typo, not `reference/`) holds standalone static JSX mockups used as visual/structural references before rewriting a feature (e.g. dropped in by a designer/collaborator). These are **not wired to the real API** — local `useState` only, hardcoded options, sometimes camelCase fields that don't match this project's snake_case API convention, and occasionally import components that don't exist elsewhere in the repo. Treat them as a layout/structure reference to adapt, not code to copy verbatim — check the real DB schema (`database/`) and existing API conventions before wiring a mockup up for real.

`plan.md` and `petunjuk1.md` (Indonesian) hold the original project plan/milestones and the full ERD + technical decision log, respectively — check `petunjuk1.md` §7 before questioning why something is architected the way it is (e.g. no Sanctum, no Inertia, no password-reset email flow).

## Commands

Local dev runs via Laravel Sail (Docker) for backend + DB, with Vite dev server on the host for HMR:

```bash
./vendor/bin/sail up -d      # backend + DB
npm install                  # once, or after dependency changes
npm run dev                  # Vite dev server (separate terminal, on host)
```

Open `http://localhost` (port 80, Laravel) — not the Vite dev server port directly; `@vite()` in `app.blade.php` auto-detects the dev server.

```bash
composer dev                 # alternative: runs `php artisan dev` (serve+queue+vite concurrently) without Sail
npm run build                # production frontend build → public/build/
```

**PHP tests** (Pest):

```bash
php artisan test --compact                       # full suite
php artisan test --compact --filter=testName      # single test
php artisan make:test --pest SomeFeatureTest       # new feature test (no `Feature/` prefix in the name)
```

**Formatting/static analysis:**

```bash
vendor/bin/pint --dirty --format agent   # after editing PHP — required before finishing a change
phpstan analyse                          # or: composer types:check (level 7, larastan)
npm run lint                             # eslint --fix
npm run format                           # prettier --write resources/
```

**Full CI-equivalent check** (mirrors `.github/workflows/tests.yml`):

```bash
composer ci:check   # lint:check + format:check + full test suite
```

## Architecture notes

- **API responses**: public endpoints return paginated/Resource-wrapped JSON (`{"data": [...]}` / `{"data": {...}}`); admin CRUD follows the same Resource convention. See `API.md` §4 for the standard error shapes (`401`/`403`/`404`/`419`/`422`/`429`).
- **File uploads** (article cover images, player photos): sent as `multipart/form-data`; updates that include a file use `POST` with a `_method=PUT` field (Laravel's method-spoofing trick) since native `PUT` can't carry multipart bodies — `resources/js/api/client.js` already does this for article/player/transfer updates.
- **Rich text**: article `body` is HTML from a rich-text editor. It's sanitized server-side on save, but the frontend must *also* wrap it in DOMPurify before rendering (defense in depth) — see `plan.md` §6.
- **Sync command**: `app/Console/Commands/SyncFootballMatches.php` + `app/Services/FootballData/MatchSyncService.php` pull Chelsea fixtures/results from football-data.org; it's scheduled, not admin-editable.

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to ensure the best experience when building Laravel applications.

## Foundational Context

This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.5
- laravel/framework (LARAVEL) - v13
- laravel/prompts (PROMPTS) - v0
- laravel/wayfinder (WAYFINDER) - v0
- larastan/larastan (LARASTAN) - v3
- laravel/boost (BOOST) - v2
- laravel/mcp (MCP) - v0
- laravel/pail (PAIL) - v1
- laravel/pint (PINT) - v1
- laravel/sail (SAIL) - v1
- pestphp/pest (PEST) - v4
- phpunit/phpunit (PHPUNIT) - v12
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4
- @laravel/vite-plugin-wayfinder (WAYFINDER_VITE) - v0
- eslint (ESLINT) - v9
- prettier (PRETTIER) - v3

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

## Replies

- Be concise in your explanations - focus on what's important rather than explaining obvious details.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Always use `search-docs` before making code changes. Do not skip this step. It returns version-specific docs based on installed packages automatically.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test --compact` with a specific filename or filter.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

## Vite Error

- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

=== wayfinder/core rules ===

# Laravel Wayfinder

Use Wayfinder to generate TypeScript functions for Laravel routes. Import from `@/actions/` (controllers) or `@/routes/` (named routes).

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

## Pest

- This project uses Pest for testing. Create tests: `php artisan make:test --pest {name}`.
- The `{name}` argument should not include the test suite directory. Use `php artisan make:test --pest SomeFeatureTest` instead of `php artisan make:test --pest Feature/SomeFeatureTest`.
- Run tests: `php artisan test --compact` or filter: `php artisan test --compact --filter=testName`.
- Do NOT delete tests without approval.

</laravel-boost-guidelines>
