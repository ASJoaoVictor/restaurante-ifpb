CREATE TYPE "public"."comprovante_contraturno_status" AS ENUM('pendente', 'aceito', 'rejeitado');--> statement-breakpoint
CREATE TYPE "public"."inscricao_status" AS ENUM('pendente', 'aceita', 'rejeitada', 'lista');--> statement-breakpoint
CREATE TYPE "public"."presenca_status" AS ENUM('pendente', 'presente', 'ausente');--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "status" "inscricao_status" DEFAULT 'pendente' NOT NULL;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "comprovante_contraturno_status" "comprovante_contraturno_status" DEFAULT 'pendente' NOT NULL;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "justificativa_rejeicao_comprovante_contraturno" text;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "inserido_gestor" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "inserido_colaborador" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "inscricoes" DROP COLUMN "posicao_incrementada";