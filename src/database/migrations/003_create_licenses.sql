CREATE TABLE licenses (
    id SERIAL PRIMARY KEY,
    license_key TEXT NOT NULL UNIQUE,
    license_hash TEXT NOT NULL,
    product VARCHAR(100) NOT NULL,
    plan VARCHAR(50) NOT NULL,
    issued_to_user INTEGER REFERENCES user(id) NULL,
    issued_to_org VARCHAR(255) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    max_devices INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    revoked_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON licenses(license_key);

CREATE TABLE IF NOT EXISTS license_audit (
    id SERIAL PRIMARY KEY,
    license_id INTEGER REFERENCES licenses(id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    action_id INTEGER NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);