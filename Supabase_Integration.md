# Supabase Integration: CommuniAble AI

## 1. Database & Auth
Supabase acts as the primary PostgreSQL database and authentication provider. RLS policies are strictly enforced at the database level.

## 2. Storage Buckets
Two primary storage buckets are configured:
- **`audio_assessments`**: Private bucket. Stores raw `.wav` or `.webm` files recorded during speech assessments and mock interviews. RLS dictates that only the owning learner or their assigned trainer can access the audio.
- **`public_assets`**: Public bucket for user avatars, accessibility icons, and static scenario imagery.

## 3. Real-time Channels
Supabase Realtime is utilized for instantaneous updates without heavy polling:
- **Assessment Processing**: When a Celery worker completes analyzing an audio file, it updates the `speech_assessments` status to `completed`. The frontend subscribes to changes on this specific row and alerts the user immediately when the report is ready.
- **Notifications**: Instant delivery of trainer notes or newly assigned practice sessions to the learner's interface.

## 4. Webhooks & Triggers
- **Auth Trigger**: `AFTER INSERT ON auth.users` automatically populates the `public.profiles` table.
- **Analysis Webhooks**: Database triggers dispatch HTTP calls to internal generic webhooks when specific thresholds are met (e.g., triggering an achievement alert if a score surpasses 90).

## 5. Email Rate Limit Configuration & Fallbacks

### Supabase Settings (To Prevent Email Throttling):
When using Supabase default Auth settings, Supabase enforces a strict email rate limit (3-4 confirmation emails per hour). To resolve this permanently in your Supabase Dashboard:
1. Go to **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Email**.
2. Toggle off **"Confirm email"** (if email verification is not required for testing/demo).
3. Under **Rate Limits**, adjust **Max Frequency** or connect a custom SMTP provider (e.g. Resend, SendGrid, Mailgun) under **Settings** -> **Auth** -> **SMTP Settings**.

### Frontend Fallback Mechanics:
The application includes built-in rate-limit resilience in `signup.tsx` & `AuthContext.tsx`:
- **Auto Direct Sign In**: If `signUp()` encounters an email rate limit error (`429` / `over_email_send_rate_limit`), the app automatically attempts direct password authentication in case the user account was created in `auth.users`.
- **Guest / Demo Session**: If email sending is throttled and password login is unavailable, users can immediately launch **Quick Demo / Guest Mode**, allowing uninterrupted testing and full app access.

