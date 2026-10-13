-- Run once after backing up a PostgreSQL database. Existing sole account becomes the owner.
BEGIN;
ALTER TABLE admin ADD COLUMN IF NOT EXISTS role VARCHAR(10) NOT NULL DEFAULT 'OWNER';
ALTER TABLE admin ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id);
ALTER TABLE admin ADD COLUMN IF NOT EXISTS full_name VARCHAR(150);
ALTER TABLE admin ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE admin ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
UPDATE admin SET full_name=username WHERE full_name IS NULL;
ALTER TABLE pg ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id);
ALTER TABLE resident ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id);
ALTER TABLE visitors ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id);
ALTER TABLE calendar_memo ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES admin(id);
ALTER TABLE resident ADD COLUMN IF NOT EXISTS presence VARCHAR(10) NOT NULL DEFAULT 'OUTSIDE';
-- Deterministic legacy owner mapping requires exactly one existing user.
DO $$ DECLARE legacy_owner INTEGER; count_users INTEGER;
BEGIN
 SELECT COUNT(*),MIN(id) INTO count_users,legacy_owner FROM admin;
 IF count_users > 1 THEN RAISE EXCEPTION 'Legacy migration requires a single account; migrate users explicitly'; END IF;
 IF count_users = 1 THEN
  UPDATE pg SET owner_id=legacy_owner WHERE owner_id IS NULL;
  UPDATE resident SET owner_id=legacy_owner WHERE owner_id IS NULL;
  UPDATE visitors SET owner_id=legacy_owner WHERE owner_id IS NULL;
  UPDATE calendar_memo SET owner_id=legacy_owner WHERE owner_id IS NULL;
 END IF;
END $$;
ALTER TABLE pg ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE resident ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE visitors ALTER COLUMN owner_id SET NOT NULL;
ALTER TABLE calendar_memo ALTER COLUMN owner_id SET NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pg_owner_id ON pg(owner_id);
CREATE INDEX IF NOT EXISTS idx_resident_owner_id ON resident(owner_id);
CREATE INDEX IF NOT EXISTS idx_visitors_owner_id ON visitors(owner_id);
CREATE INDEX IF NOT EXISTS idx_memo_owner_id ON calendar_memo(owner_id);
COMMIT;
