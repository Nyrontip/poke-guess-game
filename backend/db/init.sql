-- Create players table
CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at BIGINT NOT NULL
);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
    id TEXT PRIMARY KEY,
    player_id TEXT NOT NULL REFERENCES players(id),
    correct INTEGER NOT NULL,
    total_time_ms INTEGER NOT NULL,
    score INTEGER NOT NULL,
    date BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_scores_player_id ON scores(player_id);
CREATE INDEX IF NOT EXISTS idx_scores_correct ON scores(correct DESC);
CREATE INDEX IF NOT EXISTS idx_scores_total_time ON scores(total_time_ms ASC);
CREATE INDEX IF NOT EXISTS idx_players_created ON players(created_at DESC);

-- Ensure PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sample data: 3 players
INSERT INTO players (id, name, avatar, created_at) VALUES
    ('player_001', 'AshKetchum', 'pikachu', 1775002484516),
    ('player_002', 'MistyWater', 'staryu', 1775002484516),
    ('player_003', 'BrockRock', 'onix', 1775002484516);

-- Week (last 7 days)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_w1', 'player_001', 10, 35000, 1000, 1778717684516, CURRENT_TIMESTAMP),
    ('score_w2', 'player_001', 9, 42000, 920, 1778544884516, CURRENT_TIMESTAMP),
    ('score_w3', 'player_002', 8, 48000, 840, 1778372084516, CURRENT_TIMESTAMP),
    ('score_w4', 'player_002', 10, 39000, 1000, 1778717684516, CURRENT_TIMESTAMP),
    ('score_w5', 'player_003', 7, 55000, 720, 1778544884516, CURRENT_TIMESTAMP),
    ('score_w6', 'player_003', 9, 44000, 920, 1778372084516, CURRENT_TIMESTAMP);

-- Month (7-30 days ago)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_m1', 'player_001', 9, 41000, 900, 1778026484516, CURRENT_TIMESTAMP),
    ('score_m2', 'player_002', 7, 56000, 700, 1778026484516, CURRENT_TIMESTAMP),
    ('score_m3', 'player_003', 8, 49000, 800, 1777162484516, CURRENT_TIMESTAMP),
    ('score_m4', 'player_001', 6, 60000, 600, 1777162484516, CURRENT_TIMESTAMP),
    ('score_m5', 'player_002', 9, 43000, 900, 1776730484516, CURRENT_TIMESTAMP),
    ('score_m6', 'player_003', 10, 38000, 1000, 1776730484516, CURRENT_TIMESTAMP);

-- Old (>30 days ago)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_o1', 'player_001', 6, 62000, 580, 1775002484516, CURRENT_TIMESTAMP),
    ('score_o2', 'player_002', 5, 70000, 500, 1775002484516, CURRENT_TIMESTAMP),
    ('score_o3', 'player_003', 7, 55000, 700, 1775002484516, CURRENT_TIMESTAMP),
    ('score_o4', 'player_001', 8, 48000, 800, 1773706484516, CURRENT_TIMESTAMP),
    ('score_o5', 'player_002', 6, 60000, 600, 1773706484516, CURRENT_TIMESTAMP),
    ('score_o6', 'player_003', 9, 42000, 900, 1771114484516, CURRENT_TIMESTAMP);