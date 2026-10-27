ALTER TABLE "users" ADD COLUMN "roles" "roles"[] GENERATED ALWAYS AS (
        ARRAY_REMOVE(ARRAY[
          CASE WHEN "users"."is_admin" THEN 'admin'::"roles" END,
          CASE WHEN "users"."is_gestor" THEN 'gestor'::"roles" END,
          CASE WHEN "users"."is_colaborador" THEN 'colaborador'::"roles" END,
          CASE WHEN "users"."is_aluno" THEN 'aluno'::"roles" END
        ], NULL)
      ) STORED;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";