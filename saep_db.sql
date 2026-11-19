
CREATE DATABASE IF NOT EXISTS saep_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE saep_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(180) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    perfil ENUM('ADMIN') NOT NULL DEFAULT 'ADMIN',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    proprietario_slot TINYINT
      GENERATED ALWAYS AS (1) STORED,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_usuarios_email (email),
    UNIQUE KEY uq_um_admin_proprietario (proprietario_slot)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tutores (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    nome VARCHAR(160) NOT NULL,
    cpf_ciphertext VARBINARY(255) NOT NULL,
    cpf_iv BINARY(12) NOT NULL,
    cpf_auth_tag BINARY(16) NOT NULL,
    cpf_hash CHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
    telefone VARCHAR(25) NOT NULL,
    email VARCHAR(180) NULL,
    logradouro VARCHAR(180) NULL,
    numero VARCHAR(20) NULL,
    complemento VARCHAR(100) NULL,
    bairro VARCHAR(100) NULL,
    cidade VARCHAR(100) NULL,
    estado CHAR(2) NULL,
    cep VARCHAR(9) NULL,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_tutores_cpf_hash (cpf_hash),
    UNIQUE KEY uq_tutores_email (email),
    KEY idx_tutores_nome (nome),
    KEY idx_tutores_telefone (telefone)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS pets (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    tutor_id BIGINT UNSIGNED NOT NULL,
    nome VARCHAR(120) NOT NULL,
    especie VARCHAR(60) NOT NULL,
    raca VARCHAR(100) NULL,
    sexo ENUM('MACHO', 'FEMEA', 'NAO_INFORMADO')
      NOT NULL DEFAULT 'NAO_INFORMADO',
    data_nascimento DATE NULL,
    observacoes TEXT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_pets_tutor (tutor_id),
    KEY idx_pets_nome (nome),
    CONSTRAINT fk_pets_tutor
      FOREIGN KEY (tutor_id) REFERENCES tutores(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS agendamentos (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    pet_id BIGINT UNSIGNED NOT NULL,
    data_hora DATETIME NOT NULL,
    motivo VARCHAR(240) NOT NULL,
    observacoes TEXT NULL,
    status ENUM('PENDENTE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO')
      NOT NULL DEFAULT 'PENDENTE',
    horario_ativo DATETIME
      GENERATED ALWAYS AS (
        CASE
          WHEN status IN ('PENDENTE', 'CONFIRMADO') THEN data_hora
          ELSE NULL
        END
      ) STORED,
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY idx_agendamentos_data (data_hora),
    KEY idx_agendamentos_pet (pet_id),
    KEY idx_agendamentos_status (status),
    UNIQUE KEY uq_pet_horario_ativo (pet_id, horario_ativo),
    CONSTRAINT fk_agendamentos_pet
      FOREIGN KEY (pet_id) REFERENCES pets(id)
      ON UPDATE CASCADE
      ON DELETE RESTRICT
) ENGINE=InnoDB;

-- alteraçoes na tabela


USE saep_db;

ALTER TABLE usuarios
DROP INDEX uq_um_admin_proprietario,
DROP COLUMN proprietario_slot;

-- testes do banco

-- teste de cadastro
SELECT id, nome, email, perfil, ativo
FROM usuarios;