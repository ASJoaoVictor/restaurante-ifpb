ALTER TABLE "inscricoes" DROP COLUMN "valida";--> statement-breakpoint
ALTER TABLE "inscricoes" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "inscricoes" ALTER COLUMN "status" SET DEFAULT 'pendente'::text;--> statement-breakpoint
DROP TYPE "public"."inscricao_status";--> statement-breakpoint
CREATE TYPE "public"."inscricao_status" AS ENUM('pendente', 'aceita', 'rejeitada');--> statement-breakpoint
ALTER TABLE "inscricoes" ALTER COLUMN "status" SET DEFAULT 'pendente'::"public"."inscricao_status";--> statement-breakpoint
ALTER TABLE "inscricoes" ALTER COLUMN "status" SET DATA TYPE "public"."inscricao_status" USING "status"::"public"."inscricao_status";--> statement-breakpoint
ALTER TABLE "chamadas" DROP COLUMN "status";