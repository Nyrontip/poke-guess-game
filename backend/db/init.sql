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

-- Sample data: 3 players with scores
-- Timestamps en ms: ~1747267200000 = 15 Mayo 2026
INSERT INTO players (id, name, avatar, created_at) VALUES
    ('player_001', 'AshKetchum', 'pikachu', 1744300800000),
    ('player_002', 'MistyWater', 'staryu', 1744656000000),
    ('player_003', 'BrockRock', 'onix', 1744924800000);

-- Scores de la última semana (ultimos 7 dias)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_w1', 'player_001', 10, 35000, 1000, 1747224000000, CURRENT_TIMESTAMP),
    ('score_w2', 'player_001', 9, 42000, 920, 1747137600000, CURRENT_TIMESTAMP),
    ('score_w3', 'player_002', 8, 48000, 840, 1747185600000, CURRENT_TIMESTAMP),
    ('score_w4', 'player_002', 10, 39000, 1000, 1747056000000, CURRENT_TIMESTAMP),
    ('score_w5', 'player_003', 7, 55000, 720, 1747137600000, CURRENT_TIMESTAMP),
    ('score_w6', 'player_003', 9, 44000, 920, 1746969600000, CURRENT_TIMESTAMP),
    ('score_w7', 'player_001', 10, 36000, 1000, 1746883200000, CURRENT_TIMESTAMP),
    ('score_w8', 'player_002', 8, 50000, 800, 1746969600000, CURRENT_TIMESTAMP);

-- Scores del último mes (entre 7 y 30 dias)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_m1', 'player_001', 9, 41000, 900, 1746720000000, CURRENT_TIMESTAMP),
    ('score_m2', 'player_002', 7, 56000, 700, 1746633600000, CURRENT_TIMESTAMP),
    ('score_m3', 'player_003', 8, 49000, 800, 1746547200000, CURRENT_TIMESTAMP),
    ('score_m4', 'player_001', 6, 60000, 600, 1746374400000, CURRENT_TIMESTAMP),
    ('score_m5', 'player_002', 9, 43000, 900, 1746288000000, CURRENT_TIMESTAMP),
    ('score_m6', 'player_003', 10, 38000, 1000, 1746201600000, CURRENT_TIMESTAMP),
    ('score_m7', 'player_001', 8, 47000, 800, 1746028800000, CURRENT_TIMESTAMP),
    ('score_m8', 'player_002', 7, 52000, 700, 1745856000000, CURRENT_TIMESTAMP),
    ('score_m9', 'player_003', 9, 45000, 900, 1745683200000, CURRENT_TIMESTAMP),
    ('score_m10', 'player_001', 7, 58000, 680, 1745510400000, CURRENT_TIMESTAMP);

-- Scores de hace más de un mes (historial viejo)
INSERT INTO scores (id, player_id, correct, total_time_ms, score, date, created_at) VALUES
    ('score_o1', 'player_001', 6, 62000, 580, 1744300800000, CURRENT_TIMESTAMP),
    ('score_o2', 'player_002', 5, 70000, 500, 1744137600000, CURRENT_TIMESTAMP),
    ('score_o3', 'player_003', 7, 55000, 700, 1743974400000, CURRENT_TIMESTAMP),
    ('score_o4', 'player_001', 8, 48000, 800, 1743523200000, CURRENT_TIMESTAMP),
    ('score_o5', 'player_002', 6, 60000, 600, 1743273600000, CURRENT_TIMESTAMP),
    ('score_o6', 'player_003', 9, 42000, 900, 1743024000000, CURRENT_TIMESTAMP),
    ('score_o7', 'player_001', 5, 75000, 450, 1742592000000, CURRENT_TIMESTAMP),
    ('score_o8', 'player_002', 8, 46000, 800, 1742246400000, CURRENT_TIMESTAMP),
    ('score_o9', 'player_003', 6, 58000, 600, 1741900800000, CURRENT_TIMESTAMP),
    ('score_o10', 'player_001', 7, 52000, 700, 1741468800000, CURRENT_TIMESTAMP),
    ('score_o11', 'player_002', 9, 40000, 900, 1741036800000, CURRENT_TIMESTAMP),
    ('score_o12', 'player_003', 5, 72000, 480, 1740604800000, CURRENT_TIMESTAMP);
