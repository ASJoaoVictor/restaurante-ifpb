ALTER TABLE "refeicoes" RENAME COLUMN "duracao_aberto" TO "deslocamento_data_fechamento";--> statement-breakpoint
ALTER TABLE "refeicoes" RENAME COLUMN "duracao_analise" TO "deslocamento_data_divulgacao";--> statement-breakpoint
ALTER TABLE "refeicoes" RENAME COLUMN "duracao_fechado" TO "deslocamento_data_encerramento";--> statement-breakpoint
ALTER TABLE "refeicoes" ADD COLUMN "deslocamento_data_abertura" integer DEFAULT 0 NOT NULL;