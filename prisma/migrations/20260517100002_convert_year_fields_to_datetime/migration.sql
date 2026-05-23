-- Convert yearJoined and yearRetired from String to Date
-- Create new columns with Date type
ALTER TABLE "User" ADD COLUMN "yearJoined_new" DATE;
ALTER TABLE "User" ADD COLUMN "yearRetired_new" DATE;

-- Migrate data: convert YYYY strings to Jan 1st of that year
UPDATE "User" 
SET "yearJoined_new" = CASE 
  WHEN "yearJoined" IS NOT NULL AND "yearJoined" ~ '^\d{4}$' 
  THEN TO_DATE("yearJoined" || '-01-01', 'YYYY-MM-DD')
  ELSE NULL 
END;

UPDATE "User" 
SET "yearRetired_new" = CASE 
  WHEN "yearRetired" IS NOT NULL AND "yearRetired" ~ '^\d{4}$' 
  THEN TO_DATE("yearRetired" || '-01-01', 'YYYY-MM-DD')
  ELSE NULL 
END;

-- Drop old columns
ALTER TABLE "User" DROP COLUMN "yearJoined";
ALTER TABLE "User" DROP COLUMN "yearRetired";

-- Rename new columns to original names
ALTER TABLE "User" RENAME COLUMN "yearJoined_new" TO "yearJoined";
ALTER TABLE "User" RENAME COLUMN "yearRetired_new" TO "yearRetired";
