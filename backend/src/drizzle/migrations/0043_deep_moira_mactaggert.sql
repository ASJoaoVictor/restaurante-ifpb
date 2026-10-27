ALTER TYPE "public"."chamada_status" ADD VALUE 'encerrada';--> statement-breakpoint
COMMIT;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "data_hora_encerramento" timestamp;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "encerramento_automatico" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "data_hora_encerramento_real" timestamp;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "status";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "status" "chamada_status" GENERATED ALWAYS AS (
        CASE
          WHEN "chamadas"."data_hora_encerramento_real" IS NOT NULL THEN 'encerrada'::"chamada_status"
          WHEN "chamadas"."data_hora_finalizacao_real" IS NOT NULL THEN 'finalizada'::"chamada_status"
          WHEN "chamadas"."data_hora_divulgacao_resultado_real" IS NOT NULL THEN 'divulgada'::"chamada_status"
          WHEN "chamadas"."data_hora_fechamento_real" IS NOT NULL THEN 'fechada'::"chamada_status"
          WHEN "chamadas"."data_hora_abertura_real" IS NOT NULL THEN 'aberta'::"chamada_status"
          ELSE 'pendente'::"chamada_status"
        END
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "esta_aberta";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_aberta" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_fechamento_real" IS NULL
        AND "chamadas"."data_hora_divulgacao_resultado_real" IS NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "esta_fechada";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_fechada" boolean GENERATED ALWAYS AS ("chamadas"."data_hora_fechamento_real" IS NOT NULL) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "esta_finalizada";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_finalizada" boolean GENERATED ALWAYS AS ("chamadas"."data_hora_finalizacao_real" IS NOT NULL) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "pode_inscrever";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_inscrever" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_fechamento_real" IS NULL
        AND "chamadas"."data_hora_divulgacao_resultado_real" IS NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "pode_cancelar_inscricao";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_cancelar_inscricao" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_encerrada" boolean GENERATED ALWAYS AS ("chamadas"."data_hora_encerramento_real" IS NOT NULL) STORED NOT NULL;