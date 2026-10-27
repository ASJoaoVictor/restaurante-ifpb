CREATE TABLE "alunos_refeicoes_restricao" (
	"aluno_id" uuid NOT NULL,
	"refeicao_id" uuid NOT NULL,
	CONSTRAINT "alunos_refeicoes_restricao_aluno_id_refeicao_id_pk" PRIMARY KEY("aluno_id","refeicao_id")
);
--> statement-breakpoint
ALTER TABLE "alunos_refeicoes_restricao" ADD CONSTRAINT "alunos_refeicoes_restricao_aluno_id_alunos_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "alunos_refeicoes_restricao" ADD CONSTRAINT "alunos_refeicoes_restricao_refeicao_id_refeicoes_id_fk" FOREIGN KEY ("refeicao_id") REFERENCES "public"."refeicoes"("id") ON DELETE cascade ON UPDATE cascade;