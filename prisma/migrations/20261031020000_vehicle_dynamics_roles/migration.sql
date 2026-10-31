BEGIN;

-- Rename enum values in place to preserve all existing member assignments.
ALTER TYPE "AllTeamRoles"
  RENAME VALUE 'Suspension \& Steering Lead' TO 'Vehicle Dynamics Lead';

ALTER TYPE "AllTeamRoles"
  RENAME VALUE 'Suspension \& Steering Team' TO 'Vehicle Dynamics Team';

COMMIT;
