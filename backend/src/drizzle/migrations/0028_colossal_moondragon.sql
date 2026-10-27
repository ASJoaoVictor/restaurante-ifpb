ALTER TABLE "chamadas" drop column "status";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "status" "chamada_status" GENERATED ALWAYS AS (
        CASE
          WHEN "chamadas"."data_hora_encerramento_real" IS NOT NULL THEN 'encerrada'::"chamada_status"
          WHEN "chamadas"."data_hora_divulgacao_resultado_real" IS NOT NULL THEN 'fechada'::"chamada_status"
          WHEN "chamadas"."data_hora_fechamento_real" IS NOT NULL THEN 'analise'::"chamada_status"
          WHEN "chamadas"."data_hora_abertura_real" IS NOT NULL THEN 'aberta'::"chamada_status"
          ELSE 'pendente'::"chamada_status"
        END
      ) STORED NOT NULL;