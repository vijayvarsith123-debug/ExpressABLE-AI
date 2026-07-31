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
