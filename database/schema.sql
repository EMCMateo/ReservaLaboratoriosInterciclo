-- =====================================================================
-- Gestión de Reservas de Laboratorios - Esquema SQLite
-- Basado en el DDL de Oracle del grupo (mismos nombres de tablas,
-- columnas y constraints). Ejecutar con: npm run db:init
-- =====================================================================
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS LAB_NOTIFICACIONES;
DROP TABLE IF EXISTS LAB_RESERVAS;
DROP TABLE IF EXISTS LAB_INCIDENCIAS;
DROP TABLE IF EXISTS LAB_BLOQUEOS;
DROP TABLE IF EXISTS LAB_FRANJAS_HORARIAS;
DROP TABLE IF EXISTS LAB_EQUIPOS;
DROP TABLE IF EXISTS LAB_LABORATORIOS;
DROP TABLE IF EXISTS LAB_ASIGNATURAS;
DROP TABLE IF EXISTS LAB_TIPOS_EQUIPO;
DROP TABLE IF EXISTS LAB_UBICACIONES;
DROP TABLE IF EXISTS LAB_USUARIOS;

CREATE TABLE LAB_USUARIOS (
    usu_codigo     INTEGER NOT NULL CONSTRAINT LAB_USUARIOS_PK PRIMARY KEY AUTOINCREMENT,
    usu_usuario    VARCHAR2 (100) NOT NULL UNIQUE,
    usu_contraseña VARCHAR2 (100) NOT NULL,  -- hash bcrypt, nunca texto plano
    usu_rol        CHAR (1) NOT NULL
                   CHECK (usu_rol IN ('A','D','E'))  -- A: Administrador; D: Docente; E: Estudiante
);

CREATE TABLE LAB_UBICACIONES (
    ubi_codigo   INTEGER NOT NULL CONSTRAINT LAB_UBICACIONES_PK PRIMARY KEY AUTOINCREMENT,
    ubi_piso     NUMBER (2) NOT NULL,
    ubi_edificio VARCHAR2 (50) NOT NULL
);

CREATE TABLE LAB_TIPOS_EQUIPO (
    tip_codigo      INTEGER NOT NULL CONSTRAINT LAB_TIPOS_EQUIPO_PK PRIMARY KEY AUTOINCREMENT,
    tip_descripcion VARCHAR2 (75) NOT NULL
);

CREATE TABLE LAB_ASIGNATURAS (
    asg_codigo INTEGER NOT NULL CONSTRAINT LAB_ASIGNATURAS_PK PRIMARY KEY AUTOINCREMENT,
    asg_nombre CLOB NOT NULL
);

CREATE TABLE LAB_LABORATORIOS (
    lab_codigo                 INTEGER NOT NULL CONSTRAINT LAB_LABORATORIOS_PK PRIMARY KEY AUTOINCREMENT,
    lab_nombre                 VARCHAR2 (150) NOT NULL,
    lab_capacidad              NUMBER (2) NOT NULL CHECK (lab_capacidad > 0),
    lab_software_usado         VARCHAR2 (100) NOT NULL,
    lab_foto_url               CLOB,  -- opcional
    lab_estado                 CHAR (1) NOT NULL
                               CHECK (lab_estado IN ('D','M')),  -- D: disponible; M: mantenimiento
    LAB_UBICACIONES_ubi_codigo NUMBER (4) NOT NULL,
    CONSTRAINT LAB_LABORATORIOS_LAB_UBICACIONES_FK FOREIGN KEY (LAB_UBICACIONES_ubi_codigo)
        REFERENCES LAB_UBICACIONES (ubi_codigo)
);

CREATE TABLE LAB_EQUIPOS (
    equ_id                      INTEGER NOT NULL CONSTRAINT LAB_EQUIPOS_PK PRIMARY KEY AUTOINCREMENT,
    equ_codigo                  NUMBER (4) NOT NULL UNIQUE,
    equ_estado                  CHAR (1) NOT NULL
                                CHECK (equ_estado IN ('O','D','R')),  -- O: operativo; D: dañado; R: en reparación
    LAB_LABORATORIOS_lab_codigo NUMBER (4) NOT NULL,
    LAB_TIPOS_EQUIPO_tip_codigo NUMBER (4) NOT NULL,
    CONSTRAINT LAB_EQUIPOS_LAB_LABORATORIOS_FK FOREIGN KEY (LAB_LABORATORIOS_lab_codigo)
        REFERENCES LAB_LABORATORIOS (lab_codigo),
    CONSTRAINT LAB_EQUIPOS_LAB_TIPOS_EQUIPO_FK FOREIGN KEY (LAB_TIPOS_EQUIPO_tip_codigo)
        REFERENCES LAB_TIPOS_EQUIPO (tip_codigo)
);

CREATE TABLE LAB_FRANJAS_HORARIAS (
    fra_codigo                  INTEGER NOT NULL CONSTRAINT LAB_FRANJAS_HORARIAS_PK PRIMARY KEY AUTOINCREMENT,
    fra_dia_semana              INTEGER NOT NULL CHECK (fra_dia_semana BETWEEN 1 AND 7),  -- 1 = lunes
    fra_hora_inicio             CLOB NOT NULL,  -- 'HH:MM'
    fra_hora_fin                CLOB NOT NULL,  -- 'HH:MM'
    LAB_LABORATORIOS_lab_codigo NUMBER (4) NOT NULL,
    CONSTRAINT LAB_FRANJAS_HORARIAS_LAB_LABORATORIOS_FK FOREIGN KEY (LAB_LABORATORIOS_lab_codigo)
        REFERENCES LAB_LABORATORIOS (lab_codigo)
);

CREATE TABLE LAB_BLOQUEOS (
    blo_codigo                  INTEGER NOT NULL CONSTRAINT LAB_BLOQUEOS_PK PRIMARY KEY AUTOINCREMENT,
    blo_fecha                   DATE NOT NULL,  -- 'YYYY-MM-DD'
    blo_hora_inicio             CLOB NOT NULL,  -- 'HH:MM'
    blo_hora_fin                CLOB NOT NULL,  -- 'HH:MM'
    blo_tipo                    CHAR (1) NOT NULL
                                CHECK (blo_tipo IN ('C','M','F')),  -- C: clase fija; M: mantenimiento; F: feriado
    blo_motivo                  VARCHAR2 (200) NOT NULL,
    LAB_USUARIOS_usu_codigo     NUMBER NOT NULL,
    LAB_LABORATORIOS_lab_codigo NUMBER (4) NOT NULL,
    CONSTRAINT LAB_BLOQUEOS_LAB_LABORATORIOS_FK FOREIGN KEY (LAB_LABORATORIOS_lab_codigo)
        REFERENCES LAB_LABORATORIOS (lab_codigo),
    CONSTRAINT LAB_BLOQUEOS_LAB_USUARIOS_FK FOREIGN KEY (LAB_USUARIOS_usu_codigo)
        REFERENCES LAB_USUARIOS (usu_codigo)
);

CREATE TABLE LAB_INCIDENCIAS (
    inc_codigo              INTEGER NOT NULL CONSTRAINT LAB_INCIDENCIAS_PK PRIMARY KEY AUTOINCREMENT,
    inc_descripcion         CLOB NOT NULL,
    inc_prioridad           CHAR (1) NOT NULL
                            CHECK (inc_prioridad IN ('B','M','A')),  -- B: baja; M: media; A: alta
    inc_creado_en           DATE NOT NULL,
    inc_actualizado_en      DATE,  -- vacío hasta que el administrador la actualiza
    LAB_USUARIOS_usu_codigo NUMBER NOT NULL,
    LAB_EQUIPOS_equ_id      NUMBER (4) NOT NULL,
    CONSTRAINT LAB_INCIDENCIAS_LAB_EQUIPOS_FK FOREIGN KEY (LAB_EQUIPOS_equ_id)
        REFERENCES LAB_EQUIPOS (equ_id),
    CONSTRAINT LAB_INCIDENCIAS_LAB_USUARIOS_FK FOREIGN KEY (LAB_USUARIOS_usu_codigo)
        REFERENCES LAB_USUARIOS (usu_codigo)
);

-- Reservas: L = laboratorio completo (docente, sin equipo); P = puesto (estudiante, con equipo)
CREATE TABLE LAB_RESERVAS (
    res_codigo                  INTEGER NOT NULL CONSTRAINT LAB_RESERVAS_PK PRIMARY KEY AUTOINCREMENT,
    res_tipo                    CHAR (1) NOT NULL
                                CHECK (res_tipo IN ('L','P')),
    res_fecha                   DATE NOT NULL,  -- 'YYYY-MM-DD'
    res_hora_inicio             CLOB NOT NULL,  -- 'HH:MM'
    res_hora_fin                CLOB NOT NULL,  -- 'HH:MM'
    res_motivo                  CLOB,
    res_estado                  CHAR (1) NOT NULL
                                CHECK (res_estado IN ('P','A','R','C','F')),  -- Pendiente, Aprobada, Rechazada, Cancelada, Finalizada
    res_mensaje_admin           CLOB,  -- respuesta de aprobación o rechazo
    res_creado_en               DATE NOT NULL,
    LAB_USUARIOS_usu_codigo     NUMBER NOT NULL,       -- quien reserva
    LAB_LABORATORIOS_lab_codigo NUMBER (4) NOT NULL,
    LAB_EQUIPOS_equ_id          NUMBER (4),            -- solo si res_tipo = 'P'
    LAB_USUARIOS_usu_codigo2    NUMBER,                -- administrador que aprueba/rechaza
    LAB_ASIGNATURAS_asg_codigo  NUMBER (4),            -- solo docentes
    CHECK ((res_tipo = 'L' AND LAB_EQUIPOS_equ_id IS NULL)
        OR (res_tipo = 'P' AND LAB_EQUIPOS_equ_id IS NOT NULL)),
    CONSTRAINT LAB_RESERVAS_LAB_ASIGNATURAS_FK FOREIGN KEY (LAB_ASIGNATURAS_asg_codigo)
        REFERENCES LAB_ASIGNATURAS (asg_codigo),
    CONSTRAINT LAB_RESERVAS_LAB_EQUIPOS_FK FOREIGN KEY (LAB_EQUIPOS_equ_id)
        REFERENCES LAB_EQUIPOS (equ_id),
    CONSTRAINT LAB_RESERVAS_LAB_LABORATORIOS_FK FOREIGN KEY (LAB_LABORATORIOS_lab_codigo)
        REFERENCES LAB_LABORATORIOS (lab_codigo),
    CONSTRAINT LAB_RESERVAS_LAB_USUARIOS_FK FOREIGN KEY (LAB_USUARIOS_usu_codigo)
        REFERENCES LAB_USUARIOS (usu_codigo),
    CONSTRAINT LAB_RESERVAS_LAB_USUARIOS_FKv2 FOREIGN KEY (LAB_USUARIOS_usu_codigo2)
        REFERENCES LAB_USUARIOS (usu_codigo)
);

CREATE TABLE LAB_NOTIFICACIONES (
    not_codigo                 INTEGER NOT NULL CONSTRAINT LAB_NOTIFICACIONES_PK PRIMARY KEY AUTOINCREMENT,
    not_tipo                   CHAR (1) NOT NULL
                               CHECK (not_tipo IN ('N','A','R','I')),  -- N: nueva solicitud; A: aprobada; R: rechazada; I: incidencia
    not_mensaje                CLOB NOT NULL,
    not_creada_en              DATE NOT NULL,
    LAB_USUARIOS_usu_codigo    NUMBER NOT NULL,   -- destinatario
    LAB_RESERVAS_res_codigo    NUMBER (4),        -- si la notificación es de una reserva
    LAB_INCIDENCIAS_inc_codigo NUMBER (4),        -- si la notificación es de una incidencia
    CONSTRAINT LAB_NOTIFICACIONES_LAB_INCIDENCIAS_FK FOREIGN KEY (LAB_INCIDENCIAS_inc_codigo)
        REFERENCES LAB_INCIDENCIAS (inc_codigo),
    CONSTRAINT LAB_NOTIFICACIONES_LAB_RESERVAS_FK FOREIGN KEY (LAB_RESERVAS_res_codigo)
        REFERENCES LAB_RESERVAS (res_codigo),
    CONSTRAINT LAB_NOTIFICACIONES_LAB_USUARIOS_FK FOREIGN KEY (LAB_USUARIOS_usu_codigo)
        REFERENCES LAB_USUARIOS (usu_codigo)
);
