ALTER TABLE "chamada_preset" RENAME TO "refeicoes";--> statement-breakpoint
ALTER TABLE "chamadas" RENAME COLUMN "preset_id" TO "refeicao_id";--> statement-breakpoint
ALTER TABLE "refeicoes" DROP CONSTRAINT "chamada_preset_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "chamadas" DROP CONSTRAINT "chamadas_preset_id_chamada_preset_id_fk";
--> statement-breakpoint
ALTER TABLE "refeicoes" ADD CONSTRAINT "refeicoes_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_refeicao_id_refeicoes_id_fk" FOREIGN KEY ("refeicao_id") REFERENCES "public"."refeicoes"("id") ON DELETE set null ON UPDATE cascade;