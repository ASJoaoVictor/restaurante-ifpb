ALTER TABLE "refeicoes" ADD COLUMN "horario_encerramento" time;--> statement-breakpoint
ALTER TABLE "refeicoes" ADD COLUMN "deslocamento_data_encerramento" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "refeicoes" ADD COLUMN "encerramento_automatico" boolean DEFAULT false NOT NULL;