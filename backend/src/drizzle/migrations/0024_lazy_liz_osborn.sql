ALTER TABLE "turmas" ADD COLUMN "dias_contraturno" "dias_da_semana"[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "turmas" DROP COLUMN "contraturno";