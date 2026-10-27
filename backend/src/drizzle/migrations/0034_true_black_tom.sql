CREATE TYPE "public"."turnos" AS ENUM('manha', 'tarde', 'noite');--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "turno" "turnos";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "priorizar_mesmo_turno" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "refeicoes" ADD COLUMN "turno" "turnos";--> statement-breakpoint
ALTER TABLE "refeicoes" ADD COLUMN "priorizar_mesmo_turno" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "turmas" ADD COLUMN "turno" "turnos";