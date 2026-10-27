ALTER TABLE "chamada_preset" ALTER COLUMN "abertura_automatica" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "encerramento_automatico" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "fechamento_automatico" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamada_preset" ADD COLUMN "horario_divulgacao_resultado" time;--> statement-breakpoint
ALTER TABLE "chamada_preset" ADD COLUMN "duracao_analise" integer;--> statement-breakpoint
ALTER TABLE "chamada_preset" ADD COLUMN "divulgacao_automatica" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" DROP COLUMN "duracao_aberto";--> statement-breakpoint
ALTER TABLE "chamadas" DROP COLUMN "duracao_fechado";