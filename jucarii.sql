--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-05-10 21:38:14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 828 (class 1247 OID 32824)
-- Name: categ_jucarie; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_jucarie AS ENUM (
    'dezvoltare',
    'lego',
    'figurine',
    'masinute',
    'papusi',
    'exterior',
    'comuna'
);


ALTER TYPE public.categ_jucarie OWNER TO postgres;

--
-- TOC entry 831 (class 1247 OID 32840)
-- Name: grupa_varsta; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.grupa_varsta AS ENUM (
    'bebelusi',
    'pana in 7 ani',
    'intre 7 si 14 ani',
    'nespecificat'
);


ALTER TYPE public.grupa_varsta OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 212 (class 1259 OID 32850)
-- Name: jucarii; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jucarii (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    dimensiune integer NOT NULL,
    culoare character varying(50),
    grupa_varsta public.grupa_varsta DEFAULT 'nespecificat'::public.grupa_varsta,
    greutate integer NOT NULL,
    categorie public.categ_jucarie DEFAULT 'comuna'::public.categ_jucarie,
    materiale character varying[],
    parti_mici boolean DEFAULT false NOT NULL,
    imagine character varying(300),
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT jucarii_dimensiune_check CHECK ((dimensiune >= 0)),
    CONSTRAINT jucarii_greutate_check CHECK ((greutate >= 0))
);


ALTER TABLE public.jucarii OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 32849)
-- Name: jucarii_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jucarii_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jucarii_id_seq OWNER TO postgres;

--
-- TOC entry 3338 (class 0 OID 0)
-- Dependencies: 211
-- Name: jucarii_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jucarii_id_seq OWNED BY public.jucarii.id;


--
-- TOC entry 210 (class 1259 OID 24578)
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id integer NOT NULL,
    nume character varying(100) NOT NULL,
    pret integer DEFAULT 100 NOT NULL
);


ALTER TABLE public.test OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 24577)
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.test ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3176 (class 2604 OID 32853)
-- Name: jucarii id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jucarii ALTER COLUMN id SET DEFAULT nextval('public.jucarii_id_seq'::regclass);


--
-- TOC entry 3331 (class 0 OID 32850)
-- Dependencies: 212
-- Data for Name: jucarii; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (1, 'suzeta
', NULL, 24.00, 4, 'rosu', 'bebelusi', 25, 'dezvoltare', '{plastic,cauciuc}', false, NULL, '2022-05-02 14:07:53.732509');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (3, 'pix magic', 'pix inventat pentru a vindeca lipsa de creativitate', 7.00, 10, 'albastru', 'nespecificat', 5, 'dezvoltare', '{plastic,metal}', false, NULL, '2022-05-02 14:10:59.023766');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (5, 'Bila', 'just a ball', 3.00, 5, 'galben', 'bebelusi', 7, 'exterior', '{cauciuc}', true, NULL, '2022-05-09 16:50:59.029804');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (6, 'Papusa Barbie', 'Mult cunoscuta papusa barbie', 50.00, 15, 'roz', 'pana in 7 ani', 200, 'papusi', '{plastic}', false, NULL, '2022-05-09 17:04:08.425284');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (7, 'Avion Lego', 'Din pacate nu zboara', 78.00, 32, 'albastru', 'intre 7 si 14 ani', 88, 'dezvoltare', '{plastic}', false, NULL, '2022-05-09 17:07:47.63992');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (8, 'Papusa Anabelle', 'cea mai infricosatoare papusa din lume', 20.00, 40, 'rosu', 'nespecificat', 200, 'papusi', '{textil}', false, NULL, '2022-05-09 17:10:08.679695');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (9, 'Carte de colorat', 'perfecta pentru dezvoltarea abilitatilor de desenat', 30.00, 20, 'mov', 'pana in 7 ani', 150, 'dezvoltare', '{hartie}', false, NULL, '2022-05-09 17:12:10.228014');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (10, 'Set Bucatarie Plastic', 'Uneltele perfecte pentru micul tau bucatar', 150.00, 67, 'multicolor', 'pana in 7 ani', 90, 'figurine', '{plastic,hartie}', false, NULL, '2022-05-09 17:13:27.292158');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (13, 'Craiasa Zapezii', 'cea mai rece imparateaza acum si in magazinul nostru', 80.00, 20, 'alb', 'pana in 7 ani', 150, 'papusi', '{plastic}', false, NULL, '2022-05-09 17:18:01.811708');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (12, 'Prima mea ferma', 'Pentru micul tau fermier', 299.99, 45, 'multicolor', 'pana in 7 ani', 200, 'figurine', '{plastic}', true, NULL, '2022-05-09 17:16:47.047147');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (14, 'Masinuta cu telecomanda', 'usor de controlat', 200.00, 30, 'rosu', 'intre 7 si 14 ani', 500, 'masinute', '{plastic,lemn,metal}', true, NULL, '2022-05-09 17:19:24.750739');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (15, 'Figurina Anei', 'cealalta fata din frozen', 60.00, 10, 'maro', 'pana in 7 ani', 200, 'figurine', '{plastic}', true, NULL, '2022-05-09 17:22:12.383455');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (2, 'minge frunze', 'O minge de frunze', 1.00, 30, 'verde', 'nespecificat', 40, 'exterior', '{frunze}', true, NULL, '2022-05-02 14:10:59.023766');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (4, 'Lego', 'Imbunatateste abilitatile creative ale copilului tau', 70.00, 57, 'multicolor', 'nespecificat', 36, 'dezvoltare', '{plastic}', true, NULL, '2022-05-09 16:46:50.884622');
INSERT INTO public.jucarii (id, nume, descriere, pret, dimensiune, culoare, grupa_varsta, greutate, categorie, materiale, parti_mici, imagine, data_adaugare) VALUES (11, 'Minge saltareata', 'sare pana la 15 m inaltime', 20.00, 80, 'rosu', 'nespecificat', 800, 'exterior', '{textile,cauciuc}', false, NULL, '2022-05-09 17:14:49.289512');


--
-- TOC entry 3329 (class 0 OID 24578)
-- Dependencies: 210
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (1, 'abcd', 100);
INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (2, 'def', 17);
INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (3, 'xyz', 100);
INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (4, 'mere', 100);


--
-- TOC entry 3342 (class 0 OID 0)
-- Dependencies: 211
-- Name: jucarii_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jucarii_id_seq', 15, true);


--
-- TOC entry 3343 (class 0 OID 0)
-- Dependencies: 209
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 4, true);


--
-- TOC entry 3186 (class 2606 OID 32865)
-- Name: jucarii jucarii_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jucarii
    ADD CONSTRAINT jucarii_nume_key UNIQUE (nume);


--
-- TOC entry 3188 (class 2606 OID 32863)
-- Name: jucarii jucarii_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jucarii
    ADD CONSTRAINT jucarii_pkey PRIMARY KEY (id);


--
-- TOC entry 3184 (class 2606 OID 24583)
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jucarii; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jucarii TO andrei;


--
-- TOC entry 3339 (class 0 OID 0)
-- Dependencies: 211
-- Name: SEQUENCE jucarii_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jucarii_id_seq TO andrei;


--
-- TOC entry 3340 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE test; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.test TO andrei;


--
-- TOC entry 3341 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE test_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.test_id_seq TO andrei;


-- Completed on 2022-05-10 21:38:14

--
-- PostgreSQL database dump complete
--

