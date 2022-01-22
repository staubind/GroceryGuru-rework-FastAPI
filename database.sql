
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!

CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "user_id" INT REFERENCES "user" ON DELETE CASCADE,
    "recipe_id" INT,
    "in_cart" BOOLEAN,
    "servings" INT
);

CREATE TABLE "ingredients" (
    "id" SERIAL PRIMARY KEY,
    "ingredient_id" INT,
    "recipes_id" INT REFERENCES "recipes" ON DELETE CASCADE
)