ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
UPDATE "users" SET "role" = 'aluno' WHERE "role" = 'user';--> statement-breakpoint
UPDATE "users" SET "role" = 'gestor' WHERE "role" = 'manager';--> statement-breakpoint
DROP TYPE "public"."roles";--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('admin', 'gestor', 'colaborador', 'aluno');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."roles" USING "role"::"public"."roles";