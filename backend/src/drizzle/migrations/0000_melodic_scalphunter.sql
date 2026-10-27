CREATE TYPE "public"."roles" AS ENUM('admin', 'manager', 'user');--> statement-breakpoint
CREATE TABLE "alunos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"matricula" text NOT NULL,
	"tem_edital" boolean DEFAULT false NOT NULL,
	"faltas" integer NOT NULL,
	"suspenso_ate" date,
	"observacoes" text,
	"cidade" text NOT NULL,
	"estado" text NOT NULL,
	"usuario_id" uuid NOT NULL,
	"turma_id" uuid NOT NULL,
	CONSTRAINT "alunos_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
CREATE TABLE "campi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"nome" text NOT NULL,
	"cidade" text NOT NULL,
	"estado" text NOT NULL,
	"maximo_de_faltas" integer DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chamada_preset" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"campus_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"horario_abertura" time,
	"horario_fechamento" time,
	"horario_encerramento" time,
	"duracao_aberto" integer,
	"duracao_fechado" integer,
	"vagas" integer,
	"abertura_automatica" boolean NOT NULL,
	"encerramento_automatico" boolean NOT NULL,
	"fechamento_automatico" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chamadas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"campus_id" uuid NOT NULL,
	"preset_id" uuid,
	"criado_por" uuid,
	"nome" text NOT NULL,
	"data_hora_abertura" timestamp,
	"data_hora_fechamento" timestamp,
	"data_hora_encerramento" timestamp,
	"duracao_aberto" integer,
	"duracao_fechado" integer,
	"vagas" integer,
	"abertura_automatica" boolean NOT NULL,
	"encerramento_automatico" boolean NOT NULL,
	"fechamento_automatico" boolean NOT NULL,
	"data" date NOT NULL,
	"data_hora_abertura_real" timestamp,
	"data_hora_fechamento_real" timestamp,
	"data_hora_encerramento_real" timestamp
);
--> statement-breakpoint
CREATE TABLE "cursos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"campus_id" uuid NOT NULL,
	"nome" text NOT NULL,
	"numero_curso" integer NOT NULL,
	CONSTRAINT "cursos_numero_curso_unique" UNIQUE("numero_curso")
);
--> statement-breakpoint
CREATE TABLE "error_reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"time" timestamp with time zone DEFAULT now(),
	"name" text,
	"message" text,
	"stack" text,
	"url" text,
	"user_agent" text,
	"user_ip" text,
	"user_id" uuid
);
--> statement-breakpoint
CREATE TABLE "inscricoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"chamada_id" uuid NOT NULL,
	"aluno_id" uuid NOT NULL,
	"data_hora_inscricao" timestamp with time zone NOT NULL,
	"data_hora_cancelamento" timestamp with time zone,
	"falta" boolean DEFAULT false,
	"posicao_incrementada" integer DEFAULT 0,
	"suap" boolean DEFAULT false,
	"documento_comprobatorio" text,
	"tem_aula_contraturno" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "turmas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"campus_id" uuid NOT NULL,
	"periodo" integer NOT NULL,
	"turma" text NOT NULL,
	"contraturno" boolean DEFAULT false NOT NULL,
	"curso_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"role" "roles" DEFAULT 'user' NOT NULL,
	"phone" text NOT NULL,
	"last_login_at" timestamp with time zone,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_usuario_id_users_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alunos" ADD CONSTRAINT "alunos_turma_id_turmas_id_fk" FOREIGN KEY ("turma_id") REFERENCES "public"."turmas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chamada_preset" ADD CONSTRAINT "chamada_preset_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_preset_id_chamada_preset_id_fk" FOREIGN KEY ("preset_id") REFERENCES "public"."chamada_preset"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chamadas" ADD CONSTRAINT "chamadas_criado_por_users_id_fk" FOREIGN KEY ("criado_por") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cursos" ADD CONSTRAINT "cursos_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_reports" ADD CONSTRAINT "error_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_chamada_id_chamadas_id_fk" FOREIGN KEY ("chamada_id") REFERENCES "public"."chamadas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inscricoes" ADD CONSTRAINT "inscricoes_aluno_id_alunos_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "turmas" ADD CONSTRAINT "turmas_curso_id_cursos_id_fk" FOREIGN KEY ("curso_id") REFERENCES "public"."cursos"("id") ON DELETE cascade ON UPDATE no action;