-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_insights ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on jobs" ON jobs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on career_insights" ON career_insights FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin panel)
CREATE POLICY "Allow authenticated insert on jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on jobs" ON jobs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on jobs" ON jobs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on blogs" ON blogs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on blogs" ON blogs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on blogs" ON blogs FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert on career_insights" ON career_insights FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on career_insights" ON career_insights FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete on career_insights" ON career_insights FOR DELETE USING (auth.role() = 'authenticated');
