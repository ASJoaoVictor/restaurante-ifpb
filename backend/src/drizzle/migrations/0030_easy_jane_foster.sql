ALTER TABLE "cursos" ADD COLUMN "nome_curto" text;
UPDATE "cursos" SET "nome_curto" = "nome";
ALTER TABLE "cursos" ALTER COLUMN "nome_curto" SET NOT NULL;
