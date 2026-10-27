ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "campus_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_campus_id_campi_id_fk" FOREIGN KEY ("campus_id") REFERENCES "public"."campi"("id") ON DELETE cascade ON UPDATE no action;