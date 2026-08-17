-- Rename role labels while preserving existing team-role assignments.
ALTER TYPE "AllTeamRoles" RENAME VALUE 'Viscomm Team Lead' TO 'Interface Systems Team Lead';
ALTER TYPE "AllTeamRoles" RENAME VALUE 'Viscomm Team' TO 'Interface Systems Team';
