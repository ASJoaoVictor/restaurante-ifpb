CREATE TABLE "preferencias_notificacoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"aluno_id" uuid NOT NULL,
	"refeicao_id" uuid,
	"por_email" boolean DEFAULT false NOT NULL,
	"por_whatsapp" boolean DEFAULT false NOT NULL,
	CONSTRAINT "unique_aluno_refeicao" UNIQUE("aluno_id","refeicao_id")
);
--> statement-breakpoint
ALTER TABLE "alunos" ADD COLUMN "boas_vindas" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "alunos" ADD COLUMN "notificacoes_configuradas" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "preferencias_notificacoes" ADD CONSTRAINT "preferencias_notificacoes_aluno_id_alunos_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "preferencias_notificacoes" ADD CONSTRAINT "preferencias_notificacoes_refeicao_id_refeicoes_id_fk" FOREIGN KEY ("refeicao_id") REFERENCES "public"."refeicoes"("id") ON DELETE cascade ON UPDATE cascade;