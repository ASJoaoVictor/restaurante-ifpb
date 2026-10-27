ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_gestor" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_colaborador" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_aluno" boolean DEFAULT false NOT NULL;--> statement-breakpoint

UPDATE "users" SET "is_admin" = true WHERE "role" = 'admin';--> statement-breakpoint
UPDATE "users" SET "is_gestor" = true WHERE "role" = 'gestor';--> statement-breakpoint
UPDATE "users" SET "is_colaborador" = true WHERE "role" = 'colaborador';--> statement-breakpoint
UPDATE "users" SET "is_aluno" = true WHERE "role" = 'aluno';--> statement-breakpoint

-- Define o status is_aluno automaticamente
CREATE OR REPLACE FUNCTION update_is_aluno()
RETURNS trigger AS $$
BEGIN
  UPDATE "users" SET "is_aluno" = false WHERE "id" = OLD.usuario_id; -- Define o is_aluno como false no usuário anterior
  UPDATE "users" SET "is_aluno" = true WHERE "id" = NEW.usuario_id; -- Define o is_aluno como true no novo usuário
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint

-- Atualiza o is_aluno do usuário ao criar, editar ou excluir um aluno
CREATE OR REPLACE TRIGGER alunos_after_change
AFTER INSERT OR DELETE OR UPDATE ON "alunos"
FOR EACH ROW EXECUTE FUNCTION update_is_aluno();--> statement-breakpoint

-- Atualiza o is_aluno dos alunos existentes
UPDATE "users" SET "is_aluno" = EXISTS (SELECT 1 FROM "alunos" WHERE "usuario_id" = "users"."id");
