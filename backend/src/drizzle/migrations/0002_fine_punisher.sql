ALTER TABLE "error_reports" DROP CONSTRAINT "error_reports_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "error_reports" ADD CONSTRAINT "error_reports_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;