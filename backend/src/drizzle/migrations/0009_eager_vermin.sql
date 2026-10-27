ALTER TYPE "public"."chamada_status" ADD VALUE 'analise' BEFORE 'fechada';--> statement-breakpoint
COMMIT;--> statement-breakpoint
ALTER TABLE "chamadas" ALTER COLUMN "abertura_automatica" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamadas" ALTER COLUMN "encerramento_automatico" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamadas" ALTER COLUMN "fechamento_automatico" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "data_hora_divulgacao_resultado" timestamp;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "divulgacao_automatica" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "data_hora_divulgacao_resultado_real" timestamp;
ALTER TABLE "chamadas" drop column "status";--> statement-breakpoint
ALTER TABLE "chamadas" ADD COLUMN "status" "chamada_status" GENERATED ALWAYS AS (
        CASE
          WHEN "chamadas"."data_hora_encerramento_real" IS NOT NULL THEN 'encerrada'::"chamada_status"
          WHEN "chamadas"."data_hora_fechamento_real" IS NOT NULL THEN 'analise'::"chamada_status"
          WHEN "chamadas"."data_hora_divulgacao_resultado_real" IS NOT NULL THEN 'fechada'::"chamada_status"
          WHEN "chamadas"."data_hora_abertura_real" IS NOT NULL THEN 'aberta'::"chamada_status"
          ELSE 'pendente'::"chamada_status"
        END
      ) STORED NOT NULL;--> statement-breakpoint