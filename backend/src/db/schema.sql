CREATE TABLE IF NOT EXISTS query_history (
  id VARCHAR(36) PRIMARY KEY,
  query TEXT NOT NULL,
  execution_time FLOAT NOT NULL,
  timestamp DATETIME NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  INDEX idx_timestamp (timestamp),
  INDEX idx_favorite (is_favorite)
); 