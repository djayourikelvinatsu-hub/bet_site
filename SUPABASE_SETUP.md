# Supabase: auth, odds, admin, VIP

## 1. Create a project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. In **Project Settings → API**, copy **Project URL** and **anon public** key.

## 2. Environment variables (Vite)

Add to `.env`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_...
```

Restart `npm run dev` after changes.

## 3. Database schema

In **SQL Editor**, run the full script from:

`supabase/migrations/20250322160000_init.sql`

If the user trigger fails, try changing the last line to use your Postgres version’s syntax:

- `execute procedure public.handle_new_user();` (common on Supabase), or  
- `execute function public.handle_new_user();` (some newer versions).

## 4. Auth settings

1. **Authentication → URL configuration**  
   - **Site URL**: your production URL (e.g. `https://your-app.vercel.app`).  
   - **Redirect URLs**: add `http://localhost:5173/auth/callback` and your production `/auth/callback`.

2. **Authentication → Providers → Email**  
   - Enable **Confirm email** so users must verify before free odds RLS allows codes.

## 5. Make yourself admin

After you sign up once:

```sql
update public.profiles
set role = 'admin'
where email = 'your@email.com';
```

Admins can open **`/admin`** and add **free** or **VIP** slips (fixture + booking code).

## 6. VIP unlock (Paystack + Edge Function)

Deploy the function **`verify-paystack`** (folder `supabase/functions/verify-paystack/`).

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx
supabase functions deploy verify-paystack
```

The client calls this with the user’s session JWT. Keep **Verify JWT** enabled for the function in the Supabase dashboard.

Required function secrets (often injected automatically; add **PAYSTACK_SECRET_KEY** yourself):

- `PAYSTACK_SECRET_KEY` — from [Paystack Settings → API Keys](https://dashboard.paystack.com/#/settings/developer)

The function:

- Verifies the transaction with Paystack.
- Checks the paid email matches the logged-in user.
- Expects **₵10** (1000 pesewas) or **₵50** (5000 pesewas) in **GHS**.
- Sets `profiles.is_vip` and extends `vip_expires_at`.

## 7. Row-level security (summary)

- **Verified email** → can read all **booking_slips** (previews) and **free** codes.
- **VIP** (`is_vip` + valid `vip_expires_at`) → can also read **VIP** codes.
- **Admin** → full CRUD on slips and codes; can update **profiles** (e.g. manual VIP).

## 8. Deploying the SPA

Use a host that serves `index.html` for all routes (e.g. Vercel with a rewrite), because routes like `/login` and `/admin` are client-side.
