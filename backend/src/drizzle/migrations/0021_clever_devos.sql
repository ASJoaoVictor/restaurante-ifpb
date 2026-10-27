CREATE TYPE "public"."dias_da_semana" AS ENUM('domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado');--> statement-breakpoint
ALTER TABLE "refeicoes" ALTER COLUMN "dia_da_semana" SET DATA TYPE "public"."dias_da_semana" USING (
  CASE dia_da_semana
    WHEN 1 THEN 'domingo'::dias_da_semana
    WHEN 2 THEN 'segunda'::dias_da_semana
    WHEN 3 THEN 'terca'::dias_da_semana
    WHEN 4 THEN 'quarta'::dias_da_semana
    WHEN 5 THEN 'quinta'::dias_da_semana
    WHEN 6 THEN 'sexta'::dias_da_semana
    WHEN 7 THEN 'sabado'::dias_da_semana
  END
);
