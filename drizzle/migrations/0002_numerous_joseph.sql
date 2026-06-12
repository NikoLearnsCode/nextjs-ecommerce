ALTER TABLE "products" ADD COLUMN "search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', "products"."name"), 'A') || setweight(to_tsvector('english', "products"."brand"), 'B') || setweight(to_tsvector('english', "products"."category"), 'C') || setweight(to_tsvector('english', "products"."gender"), 'D')) STORED;--> statement-breakpoint
CREATE INDEX "products_search_vector_idx" ON "products" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "products_name_trgm_idx" ON "products" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "products_brand_trgm_idx" ON "products" USING gin ("brand" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "products_category_trgm_idx" ON "products" USING gin ("category" gin_trgm_ops);