ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_aberto" SET DEFAULT 0;--> statement-breakpoint
UPDATE "chamada_preset" SET "duracao_aberto" = 0 WHERE "duracao_aberto" IS NULL;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_aberto" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_analise" SET DEFAULT 0;--> statement-breakpoint
UPDATE "chamada_preset" SET "duracao_analise" = 0 WHERE "duracao_analise" IS NULL;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_analise" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_fechado" SET DEFAULT 0;--> statement-breakpoint
UPDATE "chamada_preset" SET "duracao_fechado" = 0 WHERE "duracao_fechado" IS NULL;--> statement-breakpoint
ALTER TABLE "chamada_preset" ALTER COLUMN "duracao_fechado" SET NOT NULL;