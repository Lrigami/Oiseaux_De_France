CREATE TYPE "statut_de_conservation" AS ENUM (
  'EX',
  'EW',
  'RE',
  'CR',
  'EN',
  'VU',
  'NT',
  'LC',
  'DD',
  'NA'
);

CREATE TYPE "repartition" AS ENUM (
  'nicheur',
  'introduit',
  'occasionnel',
  'incertain',
  'extinction_probable',
  'extinction_certaine',
  'hivernant',
  'migration'
);

CREATE TYPE "mois_de_lannee" AS ENUM (
  'janvier',
  'fevrier',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'aout',
  'septembre',
  'octobre',
  'novembre',
  'decembre'
);

CREATE TYPE "couleurs" AS ENUM (
  'blanc',
  'gris',
  'noir',
  'bleu',
  'rouge',
  'vert',
  'jaune',
  'rose',
  'violet',
  'orange',
  'marron',
  'beige'
);

CREATE TYPE "parties_du_corps" AS ENUM (
  'corps',
  'tête',
  'queue',
  'pattes',
  'plumage',
  'bec',
  'front',
  'lore',
  'iris',
  'narine',
  'culmen',
  'caroncule',
  'menton',
  'gorge',
  'poitrine',
  'petites_couvertures_alaires',
  'moyennes_couvertures_alaires',
  'grandes_couvertures_alaires',
  'alule',
  'couvertures_primaires',
  'flanc',
  'ventre',
  'tarse',
  'cuisse',
  'bas_ventre',
  'emargination',
  'remiges_primaires',
  'remiges_secondaires',
  'sous_caudales',
  'rectrices',
  'sus_caudales',
  'croupion',
  'remiges_tertiaires',
  'dos',
  'scapulaires',
  'manteau',
  'nuque',
  'parotiques',
  'calotte'
);

CREATE TYPE "rythmes_biologiques" AS ENUM (
  'diurne',
  'nocturne',
  'crepusculaire',
  'marée'
);

CREATE TYPE "comportements_sexuels" AS ENUM (
  'monogame',
  'monogame_en_serie',
  'polygame'
);

CREATE TABLE "ordres" (
  "id" serial PRIMARY KEY,
  "ordre" varchar,
  "created_at" timestamp
);

CREATE TABLE "familles" (
  "ordre_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "famille" varchar,
  "created_at" timestamp
);

CREATE TABLE "genres" (
  "famille_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "genre" varchar,
  "created_at" timestamp
);

CREATE TABLE "especes" (
  "genre_id" integer NOT NULL,
  "id" serial PRIMARY KEY,
  "espece" varchar,
  "created_at" timestamp
);

CREATE TABLE "pays_europe" (
  "id" serial PRIMARY KEY,
  "pays_name" varchar
);

CREATE TABLE "zones_repartition" (
  "id" serial PRIMARY KEY,
  "presence" repartition,
  "pays_id" integer,
  "region_id" integer,
  "oiseau_id" integer NOT NULL
);

CREATE TABLE "regions_fr" (
  "id" serial PRIMARY KEY,
  "region" varchar
);

CREATE TABLE "oiseaux" (
  "id" serial PRIMARY KEY,
  "descripteur" integer,
  "espece_id" integer,
  "name" varchar NOT NULL,
  "scientific_name" varchar NOT NULL,
  "taille_min" intger,
  "taille_max" integer,
  "envergure_min" integer,
  "envergure_max" integer,
  "poids_min" integer,
  "poids_max" integer,
  "longevite_sauvage" integer,
  "longevite_captivite" integer,
  "dysmorphie_sexuelle" boolean,
  "capacite_de_vol" boolean,
  "capacite_de_nage" boolean,
  "monogamie" comportement_sexuel,
  "rythme_biologique" rythmes_biologiques,
  "migrateur" boolean,
  "endémique" boolean,
  "statut_conservation" statut_de_conservation, 
  "photo" varchar
);

CREATE TABLE "milieux_habitation" (
  "id" serial PRIMARY KEY,
  "nom_milieu" varchar NOT NULL
);

CREATE TABLE "oiseau_dans_milieu" (
  "id" serial PRIMARY KEY,
  "milieu_id" integer NOT NULL,
  "oiseau_id" integer NOT NULL
);

CREATE TABLE "timeline_migration" (
  "id" serial PRIMARY KEY,
  "temps" mois_de_lannee,
  "zone_id" integer
);

CREATE TABLE "types_alimentation" (
  "id" serial PRIMARY KEY,
  "type" varchar NOT NULL
);

CREATE TABLE "alimentation_oiseau" (
  "id" serial PRIMARY KEY,
  "type_id" integer NOT NULL,
  "oiseau_id" integer NOT NULL
);

CREATE TABLE "particularites_physiques" (
  "id" serial PRIMARY KEY,
  "nom" varchar NOT NULL
);

CREATE TABLE "caracteristiques_physique" (
  "id" serial PRIMARY KEY,
  "oiseau_id" integer NOT NULL,
  "couleur" couleurs,
  "partie_du_corps" parties_du_corps,
  "particularite_id" integer
);

CREATE TABLE "conservation_repartition" (
  "id" serial PRIMARY KEY,
  "statut" statut_de_conservation,
  "reparition" repartition,
  "oiseau_id" integer NOT NULL
);

CREATE TABLE "descripteurs" (
  "id" serial PRIMARY KEY,
  "nom" varchar NOT NULL
);

ALTER TABLE "oiseaux" ADD FOREIGN KEY ("descripteur") REFERENCES "descripteurs" ("id");

ALTER TABLE "familles" ADD CONSTRAINT "familles_ordre" FOREIGN KEY ("ordre_id") REFERENCES "ordres" ("id");

ALTER TABLE "genres" ADD CONSTRAINT "genres_famille" FOREIGN KEY ("famille_id") REFERENCES "familles" ("id");

ALTER TABLE "especes" ADD CONSTRAINT "especes_genre" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id");

ALTER TABLE "oiseaux" ADD CONSTRAINT "oiseaux_espece" FOREIGN KEY ("espece_id") REFERENCES "especes" ("id");

ALTER TABLE "zones_repartition" ADD FOREIGN KEY ("pays_id") REFERENCES "pays_europe" ("id");

ALTER TABLE "zones_repartition" ADD FOREIGN KEY ("region_id") REFERENCES "regions_fr" ("id");

ALTER TABLE "zones_repartition" ADD FOREIGN KEY ("oiseau_id") REFERENCES "oiseaux" ("id");

ALTER TABLE "timeline_migration" ADD FOREIGN KEY ("zone_id") REFERENCES "zones_repartition" ("id");

ALTER TABLE "oiseau_dans_milieu" ADD FOREIGN KEY ("milieu_id") REFERENCES "milieux_habitation" ("id");

ALTER TABLE "oiseau_dans_milieu" ADD FOREIGN KEY ("oiseau_id") REFERENCES "oiseaux" ("id");

ALTER TABLE "alimentation_oiseau" ADD FOREIGN KEY ("type_id") REFERENCES "types_alimentation" ("id");

ALTER TABLE "alimentation_oiseau" ADD FOREIGN KEY ("oiseau_id") REFERENCES "oiseaux" ("id");

ALTER TABLE "caracteristiques_physique" ADD FOREIGN KEY ("oiseau_id") REFERENCES "oiseaux" ("id");

ALTER TABLE "caracteristiques_physique" ADD FOREIGN KEY ("particularite_id") REFERENCES "particularites_physiques" ("id");

ALTER TABLE "conservation_repartition" ADD FOREIGN KEY ("oiseau_id") REFERENCES "oiseaux" ("id");
