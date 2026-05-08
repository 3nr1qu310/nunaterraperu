-- Datos demo para Nuna Terra Perú
-- Ejecutar después de schema.sql en el SQL Editor de Supabase.

insert into regions (name, slug, headline, description, hero_image_url, card_image_url, is_active)
values
('Costa', 'costa', 'Mar, desierto, gastronomía y cultura viva.', 'La costa peruana combina historia, desierto, mar y experiencias gastronómicas memorables.', '/images/regions/costa-hero.jpg', '/images/regions/costa-card.jpg', true),
('Sierra', 'sierra', 'Montañas, historia, tradición y paisajes sagrados.', 'La sierra del Perú reúne cultura viva, paisajes andinos y destinos icónicos como Cusco, Machu Picchu, Arequipa y Puno.', '/images/regions/sierra-hero.jpg', '/images/regions/sierra-card.jpg', true),
('Selva', 'selva', 'Naturaleza, biodiversidad y conexión profunda.', 'La selva peruana invita a descubrir ríos, biodiversidad, lodges y experiencias de conexión con la naturaleza.', '/images/regions/selva-hero.jpg', '/images/regions/selva-card.jpg', true)
on conflict (slug) do update set
name = excluded.name,
headline = excluded.headline,
description = excluded.description,
hero_image_url = excluded.hero_image_url,
card_image_url = excluded.card_image_url,
is_active = true;

insert into destinations (region_id, name, slug, subtitle, short_description, description, hero_image_url, card_image_url, altitude, best_time_to_visit, recommended_days, ideal_for, is_active, sort_order)
select r.id, d.name, d.slug, d.subtitle, d.short_description, d.description, d.hero_image_url, d.card_image_url, d.altitude, d.best_time_to_visit, d.recommended_days, d.ideal_for, true, d.sort_order
from (values
('sierra','Cusco','cusco','Historia viva, cultura andina y paisajes sagrados.','Antigua capital del Imperio Inca.','Antigua capital del Imperio Inca, punto de partida hacia Machu Picchu, Valle Sagrado y rutas andinas.','/images/destinations/cusco-hero.jpg','/images/destinations/cusco-card.jpg','3,399 m s. n. m.','Abril a octubre','4 a 6 días', array['Cultura','Historia','Aventura'],1),
('sierra','Machu Picchu','machu-picchu','Una experiencia icónica en el corazón andino.','Maravilla del mundo y símbolo de la cultura inca.','Maravilla del mundo y símbolo de la cultura inca.','/images/destinations/machu-picchu-hero.jpg','/images/destinations/machu-picchu-card.jpg',null,'Abril a octubre','1 a 2 días', array['Cultura','Fotografía'],2),
('costa','Lima','lima','Gastronomía, historia y vida cultural frente al Pacífico.','Capital del Perú, ideal para iniciar rutas por la costa.','Capital del Perú, ideal para iniciar rutas por la costa y conectar con otros destinos.','/images/destinations/lima-hero.jpg','/images/destinations/lima-card.jpg',null,'Todo el año','1 a 3 días', array['Gastronomía','Cultura'],3),
('costa','Ica','ica','Desierto, viñedos y aventura en Huacachina.','Dunas, bodegas y experiencias visuales únicas.','Un destino costero que combina dunas, bodegas y experiencias visuales únicas.','/images/destinations/ica-hero.jpg','/images/destinations/ica-card.jpg',null,'Todo el año','1 a 2 días', array['Aventura','Naturaleza'],4),
('sierra','Puno','puno','Lago Titicaca y cultura altiplánica.','Destino de tradición viva, islas y paisajes del altiplano.','Destino de tradición viva, islas y paisajes del altiplano peruano.','/images/destinations/puno-hero.jpg','/images/destinations/puno-card.jpg',null,'Abril a noviembre','2 a 3 días', array['Cultura','Familia'],5),
('selva','Puerto Maldonado','puerto-maldonado','Amazonía, lodges y biodiversidad.','Puerta de entrada a experiencias amazónicas.','Puerta de entrada a experiencias amazónicas de naturaleza y conexión profunda.','/images/destinations/puerto-maldonado-hero.jpg','/images/destinations/puerto-maldonado-card.jpg',null,'Mayo a octubre','3 a 4 días', array['Naturaleza','Aventura'],6)
) as d(region_slug,name,slug,subtitle,short_description,description,hero_image_url,card_image_url,altitude,best_time_to_visit,recommended_days,ideal_for,sort_order)
join regions r on r.slug = d.region_slug
on conflict (slug) do update set
name = excluded.name,
region_id = excluded.region_id,
subtitle = excluded.subtitle,
short_description = excluded.short_description,
description = excluded.description,
hero_image_url = excluded.hero_image_url,
card_image_url = excluded.card_image_url,
best_time_to_visit = excluded.best_time_to_visit,
recommended_days = excluded.recommended_days,
ideal_for = excluded.ideal_for,
is_active = true;

insert into travel_categories (name, slug, description, is_active)
values
('Cultural','cultural','Experiencias culturales e históricas.',true),
('Familiar','familiar','Rutas pensadas para familias.',true),
('Premium','premium','Experiencias con mayor nivel de personalización.',true),
('Aventura','aventura','Experiencias activas y naturales.',true),
('Full Day','full-day','Tours de día completo.',true)
on conflict (slug) do update set name = excluded.name, description = excluded.description, is_active = true;

insert into products (product_type, title, slug, subtitle, short_description, description, duration_days, duration_nights, duration_text, region_id, price_from, currency, service_type, difficulty_level, card_image_url, hero_image_url, is_featured, is_active, status, sort_order)
select p.product_type, p.title, p.slug, p.subtitle, p.short_description, p.description, p.duration_days, p.duration_nights, p.duration_text, r.id, p.price_from, p.currency, p.service_type, p.difficulty_level, p.card_image_url, p.hero_image_url, p.is_featured, true, 'published', p.sort_order
from (values
('package','Cusco y Machu Picchu 5 días','cusco-machu-picchu-5-dias','Historia, cultura andina y la experiencia de Machu Picchu en una ruta organizada.','Ruta de 5 días por Cusco, Valle Sagrado y Machu Picchu.','Una experiencia diseñada para descubrir Cusco, el Valle Sagrado y Machu Picchu con acompañamiento y atención personalizada.',5,4,'5 días / 4 noches','sierra',690,'USD','Privado o compartido','Fácil a moderada','/images/products/cusco-machu-picchu-card.jpg','/images/products/cusco-machu-picchu-hero.jpg',true,1),
('package','Perú Esencial 7 días','peru-esencial-7-dias','Una ruta por destinos clave del Perú para primera visita.','Combina Lima, Cusco y Machu Picchu.','Combina Lima, Cusco y Machu Picchu en una experiencia completa.',7,6,'7 días / 6 noches','sierra',990,'USD','Personalizable','Fácil a moderada','/images/products/peru-esencial-card.jpg','/images/products/peru-esencial-hero.jpg',true,2),
('tour','Valle Sagrado Full Day','valle-sagrado-full-day','Paisajes, pueblos y sitios arqueológicos desde Cusco.','Tour de día completo por el Valle Sagrado.','Tour de día completo para conocer el Valle Sagrado con organización y acompañamiento.',1,0,'Full Day','sierra',45,'USD','Privado o compartido','Fácil a moderada','/images/products/valle-sagrado-card.jpg','/images/products/valle-sagrado-hero.jpg',true,3),
('tour','Ica y Huacachina Full Day','ica-huacachina-full-day','Desierto, viñedos y aventura suave en la costa.','Experiencia de un día para descubrir Ica y Huacachina.','Una experiencia de un día para descubrir Ica y la magia de Huacachina.',1,0,'Full Day','costa',55,'USD','Privado o compartido','Fácil','/images/products/ica-huacachina-card.jpg','/images/products/ica-huacachina-hero.jpg',true,4)
) as p(product_type,title,slug,subtitle,short_description,description,duration_days,duration_nights,duration_text,region_slug,price_from,currency,service_type,difficulty_level,card_image_url,hero_image_url,is_featured,sort_order)
join regions r on r.slug = p.region_slug
on conflict (slug) do update set
product_type = excluded.product_type,
title = excluded.title,
subtitle = excluded.subtitle,
description = excluded.description,
duration_text = excluded.duration_text,
region_id = excluded.region_id,
price_from = excluded.price_from,
currency = excluded.currency,
service_type = excluded.service_type,
difficulty_level = excluded.difficulty_level,
card_image_url = excluded.card_image_url,
hero_image_url = excluded.hero_image_url,
is_featured = excluded.is_featured,
is_active = true,
status = 'published';

-- Relaciones producto-destino
insert into product_destinations (product_id, destination_id, sort_order, is_primary)
select p.id, d.id, x.sort_order, x.is_primary
from (values
('cusco-machu-picchu-5-dias','cusco',1,true),
('cusco-machu-picchu-5-dias','machu-picchu',2,false),
('peru-esencial-7-dias','lima',1,true),
('peru-esencial-7-dias','cusco',2,false),
('peru-esencial-7-dias','machu-picchu',3,false),
('valle-sagrado-full-day','cusco',1,true),
('ica-huacachina-full-day','ica',1,true)
) as x(product_slug,destination_slug,sort_order,is_primary)
join products p on p.slug = x.product_slug
join destinations d on d.slug = x.destination_slug
on conflict (product_id, destination_id) do nothing;

-- Datos de itinerario/inclusiones demo
insert into product_itinerary_days (product_id, day_number, title, description, sort_order)
select p.id, x.day_number, x.title, x.description, x.day_number
from (values
('cusco-machu-picchu-5-dias',1,'Llegada a Cusco','Recepción, traslado al hotel y tiempo de aclimatación.'),
('cusco-machu-picchu-5-dias',2,'City Tour Cusco','Visita a Qorikancha y principales centros arqueológicos cercanos.'),
('cusco-machu-picchu-5-dias',3,'Valle Sagrado','Recorrido por paisajes andinos y conexión hacia Aguas Calientes.'),
('cusco-machu-picchu-5-dias',4,'Machu Picchu','Visita guiada a la ciudadela y retorno a Cusco.'),
('cusco-machu-picchu-5-dias',5,'Salida','Traslado final según horario de viaje.')
) as x(product_slug,day_number,title,description)
join products p on p.slug = x.product_slug
where not exists (select 1 from product_itinerary_days pid where pid.product_id = p.id and pid.day_number = x.day_number);

insert into product_inclusions (product_id, item_type, content, sort_order)
select p.id, x.item_type, x.content, x.sort_order
from (values
('cusco-machu-picchu-5-dias','included','Traslados turísticos',1),
('cusco-machu-picchu-5-dias','included','Guía profesional',2),
('cusco-machu-picchu-5-dias','included','Asistencia durante el viaje',3),
('cusco-machu-picchu-5-dias','not_included','Vuelos internacionales',1),
('cusco-machu-picchu-5-dias','not_included','Gastos personales',2),
('cusco-machu-picchu-5-dias','recommendation','Llevar documento de identidad o pasaporte',1),
('cusco-machu-picchu-5-dias','recommendation','Reservar con anticipación',2)
) as x(product_slug,item_type,content,sort_order)
join products p on p.slug = x.product_slug
where not exists (select 1 from product_inclusions pi where pi.product_id = p.id and pi.item_type = x.item_type and pi.content = x.content);
