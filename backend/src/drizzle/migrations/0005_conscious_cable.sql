ALTER TABLE "alunos" DROP CONSTRAINT "alunos_usuario_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "alunos" DROP CONSTRAINT "alunos_turma_id_turmas_id_fk";
--> statement-breakpoint
ALTER TABLE "chamada_preset" DROP CONSTRAINT "chamada_preset_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "chamadas" DROP CONSTRAINT "chamadas_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "chamadas" DROP CONSTRAINT "chamadas_preset_id_chamada_preset_id_fk";
--> statement-breakpoint
ALTER TABLE "chamadas" DROP CONSTRAINT "chamadas_criado_por_users_id_fk";
--> statement-breakpoint
ALTER TABLE "cursos" DROP CONSTRAINT "cursos_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "error_reports" DROP CONSTRAINT "error_reports_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "inscricoes" DROP CONSTRAINT "inscricoes_chamada_id_chamadas_id_fk";
--> statement-breakpoint
ALTER TABLE "inscricoes" DROP CONSTRAINT "inscricoes_aluno_id_alunos_id_fk";
--> statement-breakpoint
ALTER TABLE "turmas" DROP CONSTRAINT "turmas_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "turmas" DROP CONSTRAINT "turmas_curso_id_cursos_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_campus_id_campi_id_fk";
--> statement-breakpoint
ALTER TABLE "error_reports" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "error_reports" ADD COLUMN "details" text;--> statement-breakpoint
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_turma_id_turmas_id_fk" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chamada_preset" ADD CONSTRAINT "chamada_preset_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_preset_id_chamada_preset_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."chamada_preset"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_criado_por_users_id_fk" FOREIGN KEY ("criado_por") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "error_reports" ADD CONSTRAINT "error_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_chamada_id_chamadas_id_fk" FOREIGN KEY ("chamada_id") REFERENCES "public"."chamadas"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_aluno_id_alunos_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE cascade;