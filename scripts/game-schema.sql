-- Game Progress Table
CREATE TABLE IF NOT EXISTS game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_level INTEGER DEFAULT 1,
  levels_completed INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  missions_completed TEXT[] DEFAULT ARRAY[]::TEXT[],
  total_stars INTEGER DEFAULT 0,
  total_playtime INTEGER DEFAULT 0, -- in seconds
  last_played TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Achievements Table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_type TEXT NOT NULL, -- 'badge', 'alien_unlock', 'milestone'
  achievement_name TEXT NOT NULL,
  achievement_data JSONB DEFAULT '{}'::JSONB,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_name)
);

-- Daily Habits Table
CREATE TABLE IF NOT EXISTS daily_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  habit_name TEXT NOT NULL,
  habit_category TEXT NOT NULL, -- 'cleanliness', 'respect', 'environment', 'safety'
  completed BOOLEAN DEFAULT FALSE,
  completion_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mission Scores Table
CREATE TABLE IF NOT EXISTS mission_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  level_id INTEGER NOT NULL,
  mission_id TEXT NOT NULL,
  stars_earned INTEGER DEFAULT 0,
  time_taken INTEGER DEFAULT 0, -- in seconds
  perfect_score BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parent Settings Table
CREATE TABLE IF NOT EXISTS parent_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  screen_time_limit INTEGER DEFAULT 3600, -- in seconds (default 1 hour)
  custom_habits JSONB DEFAULT '[]'::JSONB,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_progress
CREATE POLICY "Users can view their own game progress"
  ON game_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own game progress"
  ON game_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game progress"
  ON game_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Users can view their own achievements"
  ON achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own achievements"
  ON achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for daily_habits
CREATE POLICY "Users can view their own habits"
  ON daily_habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own habits"
  ON daily_habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
  ON daily_habits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mission_scores
CREATE POLICY "Users can view their own mission scores"
  ON mission_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mission scores"
  ON mission_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for parent_settings
CREATE POLICY "Users can view their own parent settings"
  ON parent_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own parent settings"
  ON parent_settings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parent settings"
  ON parent_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_game_progress_user ON game_progress(user_id);
CREATE INDEX idx_achievements_user ON achievements(user_id);
CREATE INDEX idx_daily_habits_user ON daily_habits(user_id);
CREATE INDEX idx_mission_scores_user ON mission_scores(user_id);
CREATE INDEX idx_parent_settings_user ON parent_settings(user_id);

-- Function to initialize game progress for new users
CREATE OR REPLACE FUNCTION initialize_game_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO game_progress (user_id, current_level, total_stars)
  VALUES (NEW.id, 1, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO parent_settings (user_id, screen_time_limit)
  VALUES (NEW.id, 3600)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to initialize game progress when user signs up
DROP TRIGGER IF EXISTS on_user_created_init_game ON auth.users;
CREATE TRIGGER on_user_created_init_game
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_game_progress();
