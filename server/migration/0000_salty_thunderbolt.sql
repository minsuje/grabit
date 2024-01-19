CREATE TABLE IF NOT EXISTS "account" (
	"account_id" serial PRIMARY KEY NOT NULL,
	"transaction_description" varchar(100) NOT NULL,
	"transaction" varchar(20) NOT NULL,
	"transaction_name" integer NOT NULL,
	"status" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"userid_num" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"userid_num" serial PRIMARY KEY NOT NULL,
	"login_type" varchar(50) NOT NULL,
	"userid" varchar(20),
	"social_userid" varchar(50),
	"password" varchar(200),
	"name" varchar(100),
	"nickname" varchar(50),
	"profile_img" varchar(200),
	"score_num" integer NOT NULL,
	"money" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authentication" (
	"authentication_id" serial PRIMARY KEY NOT NULL,
	"challenge_num" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"userid_num" integer NOT NULL,
	"authentication_img" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authentication_img_emoticon" (
	"authentication_img_emoticon_id" serial PRIMARY KEY NOT NULL,
	"authentication_id" integer,
	"authentication_img_comment_userid_num" integer NOT NULL,
	"authentication_img_comment_emoticon" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenge" (
	"challenge_num" serial PRIMARY KEY NOT NULL,
	"userid_num" integer,
	"challenge_name" varchar(200) NOT NULL,
	"topic" varchar(50) NOT NULL,
	"challenger_userid_num" integer NOT NULL,
	"goalMoney" integer NOT NULL,
	"deadline" varchar(20) NOT NULL,
	"winner_userid_num" integer,
	"authentication_term" integer NOT NULL,
	"authentication_time" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "alarm" (
	"alarm_id" serial NOT NULL,
	"userid_num" integer NOT NULL,
	"challenge_num" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dailyMission" (
	"mission_id" serial NOT NULL,
	"mission_content" varchar(200) NOT NULL,
	"success_userid_num" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userid_num_users_userid_num_fk" FOREIGN KEY ("userid_num") REFERENCES "users"("userid_num") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authentication" ADD CONSTRAINT "authentication_challenge_num_challenge_challenge_num_fk" FOREIGN KEY ("challenge_num") REFERENCES "challenge"("challenge_num") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authentication_img_emoticon" ADD CONSTRAINT "authentication_img_emoticon_authentication_id_authentication_authentication_id_fk" FOREIGN KEY ("authentication_id") REFERENCES "authentication"("authentication_id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenge" ADD CONSTRAINT "challenge_userid_num_users_userid_num_fk" FOREIGN KEY ("userid_num") REFERENCES "users"("userid_num") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alarm" ADD CONSTRAINT "alarm_userid_num_users_userid_num_fk" FOREIGN KEY ("userid_num") REFERENCES "users"("userid_num") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
