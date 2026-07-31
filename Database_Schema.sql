-- CommuniAble AI PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users (Managed by Supabase Auth, referencing here for completeness if needed, but usually auth.users is used. We create a public mirror or reference)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('learner', 'trainer', 'institution', 'admin')) NOT NULL,
    first_name TEXT,
    last_name TEXT,
    organization_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. accessibility_profiles
CREATE TABLE public.accessibility_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    ui_theme TEXT DEFAULT 'standard',
    text_size TEXT DEFAULT 'medium',
    text_to_speech_enabled BOOLEAN DEFAULT FALSE,
    cognitive_load_setting TEXT DEFAULT 'standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. speech_assessments
CREATE TABLE public.speech_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    transcript TEXT,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. writing_assessments
CREATE TABLE public.writing_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    context_prompt TEXT,
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. speech_reports
CREATE TABLE public.speech_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES public.speech_assessments(id) ON DELETE CASCADE,
    pronunciation_score NUMERIC(5,2) CHECK (pronunciation_score >= 0 AND pronunciation_score <= 100),
    fluency_score NUMERIC(5,2) CHECK (fluency_score >= 0 AND fluency_score <= 100),
    pacing_feedback TEXT,
    detailed_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. writing_reports
CREATE TABLE public.writing_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID REFERENCES public.writing_assessments(id) ON DELETE CASCADE,
    grammar_score NUMERIC(5,2) CHECK (grammar_score >= 0 AND grammar_score <= 100),
    clarity_score NUMERIC(5,2) CHECK (clarity_score >= 0 AND clarity_score <= 100),
    tone_analysis TEXT,
    suggested_edits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. mock_interviews
CREATE TABLE public.mock_interviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_role_context TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    overall_score NUMERIC(5,2)
);

-- 9. interview_questions
CREATE TABLE public.interview_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty_level INT CHECK (difficulty_level BETWEEN 1 AND 5)
);

-- 10. interview_responses
CREATE TABLE public.interview_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    interview_id UUID REFERENCES public.mock_interviews(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.interview_questions(id),
    response_text TEXT,
    response_audio_url TEXT,
    feedback JSONB,
    score NUMERIC(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. simulation_sessions
CREATE TABLE public.simulation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    scenario_type TEXT NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE
);

-- 12. simulation_results
CREATE TABLE public.simulation_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.simulation_sessions(id) ON DELETE CASCADE,
    communication_effectiveness NUMERIC(5,2),
    empathy_score NUMERIC(5,2),
    constructive_feedback TEXT,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. vocabulary_categories
CREATE TABLE public.vocabulary_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- 14. vocabulary_words
CREATE TABLE public.vocabulary_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.vocabulary_categories(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    definition TEXT NOT NULL,
    example_sentence TEXT
);

-- 15. vocabulary_progress
CREATE TABLE public.vocabulary_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    word_id UUID REFERENCES public.vocabulary_words(id) ON DELETE CASCADE,
    mastery_level INT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 100),
    last_practiced TIMESTAMP WITH TIME ZONE,
    UNIQUE(profile_id, word_id)
);

-- 16. social_stories
CREATE TABLE public.social_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content JSONB NOT NULL,
    target_audience TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 17. practice_sessions
CREATE TABLE public.practice_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL,
    duration_seconds INT,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 18. learning_paths
CREATE TABLE public.learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    goals JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 19. recommendations
CREATE TABLE public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    content TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 20. grammar_reports
CREATE TABLE public.grammar_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    source_text TEXT,
    corrections JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 21. email_reports
CREATE TABLE public.email_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    original_email TEXT,
    professionalism_score NUMERIC(5,2),
    suggested_revisions JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 22. ai_feedback
CREATE TABLE public.ai_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_type TEXT NOT NULL,
    reference_id UUID NOT NULL,
    feedback_text TEXT NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 23. progress
CREATE TABLE public.progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC(10,2),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 24. achievements
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 25. trainer_notes
CREATE TABLE public.trainer_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID REFERENCES public.profiles(id),
    learner_id UUID REFERENCES public.profiles(id),
    note_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 26. trainer_reports
CREATE TABLE public.trainer_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainer_id UUID REFERENCES public.profiles(id),
    learner_id UUID REFERENCES public.profiles(id),
    report_summary TEXT,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 27. institution_reports
CREATE TABLE public.institution_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES public.profiles(id),
    aggregated_metrics JSONB,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 28. notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 29. settings
CREATE TABLE public.settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    preferences JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 30. activity_logs
CREATE TABLE public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_assessments_profile_id ON public.speech_assessments(profile_id);
CREATE INDEX idx_activity_logs_profile_id ON public.activity_logs(profile_id);
CREATE INDEX idx_mock_interviews_profile_id ON public.mock_interviews(profile_id);
CREATE GIN INDEX idx_activity_logs_metadata ON public.activity_logs USING GIN(metadata);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.speech_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own speech assessments" ON public.speech_assessments USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
