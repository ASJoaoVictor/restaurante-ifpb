ALTER TABLE "inscricoes" ADD COLUMN "em_lista_espera" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "inscricoes" drop column "valida";--> statement-breakpoint
ALTER TABLE "inscricoes" ADD COLUMN "valida" boolean GENERATED ALWAYS AS (
          "inscricoes"."status" = 'aceita'::"inscricao_status"
          AND "inscricoes"."data_hora_cancelamento" IS NULL
          AND "inscricoes"."em_lista_espera" = false
        ) STORED NOT NULL;