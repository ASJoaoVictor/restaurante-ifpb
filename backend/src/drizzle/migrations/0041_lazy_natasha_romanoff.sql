ALTER TABLE "chamadas" RENAME COLUMN "data_hora_encerramento" TO "data_hora_finalizacao";--> statement-breakpoint
ALTER TABLE "chamadas" RENAME COLUMN "encerramento_automatico" TO "finalizacao_automatica";--> statement-breakpoint
ALTER TABLE "chamadas" RENAME COLUMN "data_hora_encerramento_real" TO "data_hora_finalizacao_real";--> statement-breakpoint
ALTER TABLE "chamadas" RENAME COLUMN "esta_encerrada" TO "esta_finalizada";--> statement-breakpoint
ALTER TABLE "refeicoes" RENAME COLUMN "horario_encerramento" TO "horario_finalizacao";--> statement-breakpoint
ALTER TABLE "refeicoes" RENAME COLUMN "deslocamento_data_encerramento" TO "deslocamento_data_finalizacao";--> statement-breakpoint
ALTER TABLE "refeicoes" RENAME COLUMN "encerramento_automatico" TO "finalizacao_automatica";--> statement-breakpoint
ALTER TABLE "chamadas" drop column "status";--> statement-breakpoint
DROP TYPE "public"."chamada_status";--> statement-breakpoint
CREATE TYPE "public"."chamada_status" AS ENUM('pendente', 'aberta', 'fechada', 'divulgada', 'finalizada');--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "status" "chamada_status" GENERATED ALWAYS AS (
        CASE
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
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "esta_fechada";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "esta_fechada" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_fechamento_real" IS NOT NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "pode_inscrever";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_inscrever" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_fechamento_real" IS NULL
        AND "chamadas"."data_hora_divulgacao_resultado_real" IS NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
      ) STORED NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" drop column "pode_cancelar_inscricao";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "pode_cancelar_inscricao" boolean GENERATED ALWAYS AS (
        "chamadas"."data_hora_abertura_real" IS NOT NULL
        AND "chamadas"."data_hora_finalizacao_real" IS NULL
      ) STORED NOT NULL;