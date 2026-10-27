ALTER TABLE "chamadas" ADD COLUMN "esta_aberta" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_fechamento_real" IS NULL
        AND "chamadas"."data_hora_divulgacao_resultado_real" IS NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_fechada" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_fechamento_real" IS NOT NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_encerrada" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_encerramento_real" IS NOT NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "resultado_divulgado" boolean GENERATED ALWAYS AS ("chamadas"."data_hora_divulgacao_resultado_real" IS NOT NULL) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_inscrever" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_fechamento_real" IS NULL
        AND "chamadas"."data_hora_divulgacao_resultado_real" IS NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_cancelar_inscricao" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_encerramento_real" IS NULL
      ) STORED NOT NULL;