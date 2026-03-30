# Velanova Supabase setup - phase 1

This patch starts the roadmap with real auth scaffolding.

## What this patch does
- adds Supabase client bootstrapping
- upgrades auth flow to support Supabase Auth
- keeps local demo mode as a fallback when env keys are missing
- protects `/admin` by role instead of just login state
- keeps sessions per tab by using `sessionStorage`

## What you need to do
1. Create a Supabase project.
2. Copy `.env.example` to `.env`.
3. Paste your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run the SQL in `supabase/001_profiles.sql`.
5. Run `npm install`.
6. Start the app.

## Important note
This patch loads Supabase dynamically in the browser so the current app still works in local mode before you add keys.
For production, keep `@supabase/supabase-js` installed and you can later switch the client helper to a normal package import.

## Next roadmap step after this patch
- move products from mock data/localStorage into Supabase tables
- then move orders/checkout into Supabase tables
- then add WhatsApp notification server-side
