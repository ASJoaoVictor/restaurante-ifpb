ALTER TABLE "inscricoes" ADD COLUMN "valida" boolean GENERATED ALWAYS AS (
          "inscricoes"."status" = 'aceita'::"inscricao_status"
          AND "inscricoes"."data_hora_cancelamento" IS NULL
        ) STORED NOT NULL;