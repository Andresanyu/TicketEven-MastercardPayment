CREATE TABLE IF NOT EXISTS tarjetas_mastercard (
  id SERIAL PRIMARY KEY,
  number VARCHAR(50) NOT NULL,
  cvc VARCHAR(10) NOT NULL,
  saldo NUMERIC(12, 2) NOT NULL DEFAULT 0,
  estado VARCHAR(20) NOT NULL DEFAULT 'activo'
);

INSERT INTO tarjetas_mastercard (number, cvc, saldo, estado) VALUES
('5000000000000000', '111', 100000.00, 'activo'),
('5111111111111111', '222', 500000.00, 'activo'),
('5222222222222222', '333', 250000.00, 'activo'),
('5333333333333333', '444', 0.00, 'activo'),
('5444444444444444', '555', 750000.00, 'inactivo');