-- FixIT database schema
-- Runs automatically the first time the PostgreSQL container starts.

CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(10)  NOT NULL DEFAULT 'user'
                  CHECK (role IN ('user', 'admin')),
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE complaints (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category    VARCHAR(30)  NOT NULL
                CHECK (category IN ('Electrical','Plumbing','Water Leakage',
                                    'Furniture','Network','Lift','Cleanliness','Other')),
    title       VARCHAR(150) NOT NULL,
    description TEXT         NOT NULL,
    location    VARCHAR(150) NOT NULL,
    status      VARCHAR(15)  NOT NULL DEFAULT 'Pending'
                CHECK (status IN ('Pending','In Progress','Resolved')),
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_complaints_user   ON complaints(user_id);
CREATE INDEX idx_complaints_status ON complaints(status);