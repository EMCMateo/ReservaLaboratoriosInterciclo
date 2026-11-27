-- =====================================================================
-- Datos semilla. Credenciales de prueba:
--   admin        / Admin123!        (rol A)
--   docente1     / Docente123!      (rol D)
--   estudiante1  / Estudiante123!   (rol E)
--   estudiante2  / Estudiante123!   (rol E)
-- Las contraseñas están guardadas como hash bcrypt.
-- =====================================================================
PRAGMA foreign_keys = ON;

INSERT INTO LAB_USUARIOS (usu_codigo, usu_usuario, usu_contraseña, usu_rol) VALUES
 (1, 'admin',       '$2b$10$uYtRptnwodwEAlhY.BRB.OQ4fTXX1DkqsGTEwEnlCsuhtJbxfMA/G', 'A',1),
 (2, 'docente1',    '$2b$10$LBarpIJIK9LI4437TcrCAuK2FDLuKxwsQ2bezBSoIaiBpois9xzTa', 'D',1),
 (3, 'estudiante1', '$2b$10$KSmKKPdudy/NTZioa758su0HtWT2PSvYjsqwWwGKI.7FDOl67R0Q.', 'E',1),
 (4, 'estudiante2', '$2b$10$KSmKKPdudy/NTZioa758su0HtWT2PSvYjsqwWwGKI.7FDOl67R0Q.', 'E',1);

INSERT INTO LAB_UBICACIONES (ubi_codigo, ubi_piso, ubi_edificio) VALUES
 (1, 1, 'Edificio A'),
 (2, 2, 'Edificio A'),
 (3, 1, 'Edificio B');

INSERT INTO LAB_TIPOS_EQUIPO (tip_codigo, tip_descripcion) VALUES
 (1, 'PC'),
 (2, 'Proyector'),
 (3, 'Router');

INSERT INTO LAB_ASIGNATURAS (asg_codigo, asg_nombre) VALUES
 (1, 'Programación y Plataformas Web'),
 (2, 'Redes de Computadoras II'),
 (3, 'Sistemas Embebidos');

INSERT INTO LAB_LABORATORIOS (lab_codigo, lab_nombre, lab_capacidad, lab_software_usado, lab_foto_url, lab_estado, LAB_UBICACIONES_ubi_codigo) VALUES
 (1, 'Laboratorio de Redes',       20, 'Packet Tracer, Wireshark, GNS3', 'img/laboratorios/redes.jpg',       'D', 1),
 (2, 'Laboratorio de Software',    30, 'VS Code, Node.js, Docker, Git',  'img/laboratorios/software.jpg',    'D', 2),
 (3, 'Laboratorio de Electrónica', 15, 'Vivado, Proteus, KiCad',         'img/laboratorios/electronica.jpg', 'M', 3);

INSERT INTO LAB_EQUIPOS (equ_id, equ_codigo, equ_estado, LAB_LABORATORIOS_lab_codigo, LAB_TIPOS_EQUIPO_tip_codigo) VALUES
 (1, 1001, 'O', 1, 1),
 (2, 1002, 'O', 1, 1),
 (3, 1003, 'D', 1, 1),
 (4, 2001, 'O', 2, 1),
 (5, 2002, 'O', 2, 1),
 (6, 2003, 'O', 2, 2),
 (7, 3001, 'R', 3, 1);

-- Franjas de lunes (1) a viernes (5) para los laboratorios 1 y 2
WITH dias(d) AS (VALUES (1),(2),(3),(4),(5)),
     horas(ini, fin) AS (VALUES ('07:00','09:00'),('09:00','11:00'),('11:00','13:00'),
                                ('14:00','16:00'),('16:00','18:00'),('18:00','20:00'))
INSERT INTO LAB_FRANJAS_HORARIAS (fra_dia_semana, fra_hora_inicio, fra_hora_fin, LAB_LABORATORIOS_lab_codigo)
SELECT dias.d, horas.ini, horas.fin, l.lab_codigo
FROM LAB_LABORATORIOS l, dias, horas
WHERE l.lab_codigo IN (1, 2);

INSERT INTO LAB_BLOQUEOS (blo_codigo, blo_fecha, blo_hora_inicio, blo_hora_fin, blo_tipo, blo_motivo, LAB_USUARIOS_usu_codigo, LAB_LABORATORIOS_lab_codigo) VALUES
 (1, '2026-12-25', '07:00', '20:00', 'F', 'Navidad',                      1, 1),
 (2, '2026-12-01', '09:00', '11:00', 'C', 'Clase fija de Programación',   1, 2),
 (3, '2026-12-02', '07:00', '20:00', 'M', 'Revisión eléctrica',           1, 3);

INSERT INTO LAB_RESERVAS (res_codigo, res_tipo, res_fecha, res_hora_inicio, res_hora_fin, res_motivo, res_estado, res_mensaje_admin, res_creado_en, LAB_USUARIOS_usu_codigo, LAB_LABORATORIOS_lab_codigo, LAB_EQUIPOS_equ_id, LAB_USUARIOS_usu_codigo2, LAB_ASIGNATURAS_asg_codigo) VALUES
 (1, 'L', '2026-12-03', '09:00', '11:00', 'Práctica de Angular',        'P', NULL,                                          '2026-11-19', 2, 2, NULL, NULL, 1),
 (2, 'P', '2026-12-03', '14:00', '16:00', 'Práctica de redes',          'A', NULL,                                          '2026-11-19', 3, 1, 1,    NULL, NULL),
 (3, 'L', '2026-12-04', '07:00', '09:00', 'Práctica de enrutamiento',   'A', 'Aprobada, laboratorio asignado.',             '2026-11-18', 2, 1, NULL, 1,    2),
 (4, 'P', '2026-11-10', '14:00', '16:00', 'Estudio individual',         'F', NULL,                                          '2026-11-09', 4, 2, 4,    NULL, NULL),
 (5, 'L', '2026-12-08', '11:00', '13:00', 'Práctica de electrónica',    'R', 'El laboratorio está en mantenimiento.',       '2026-11-18', 2, 3, NULL, 1,    3);

INSERT INTO LAB_INCIDENCIAS (inc_codigo, inc_descripcion, inc_prioridad, inc_creado_en, inc_actualizado_en, LAB_USUARIOS_usu_codigo, LAB_EQUIPOS_equ_id) VALUES
 (1, 'La pantalla no enciende', 'A', '2026-11-17', NULL, 3, 3);

INSERT INTO LAB_NOTIFICACIONES (not_codigo, not_tipo, not_mensaje, not_creada_en, LAB_USUARIOS_usu_codigo, LAB_RESERVAS_res_codigo, LAB_INCIDENCIAS_inc_codigo) VALUES
 (1, 'N', 'Nueva solicitud de laboratorio completo para el 2026-12-03.', '2026-11-19', 1, 1,    NULL),
 (2, 'A', 'Tu reserva del 2026-12-04 fue aprobada.',                     '2026-11-18', 2, 3,    NULL),
 (3, 'R', 'Tu reserva del 2026-12-08 fue rechazada.',                    '2026-11-18', 2, 5,    NULL),
 (4, 'I', 'Nueva incidencia reportada en el equipo 1003.',               '2026-11-17', 1, NULL, 1);
