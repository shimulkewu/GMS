-- ============================================================
--  GMS — Garment Management System
--  Database Schema (MySQL 8.0+ / MariaDB 10.6+)
--  File: gms_schema.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS gms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gms;

-- ============================================================
-- 1. USERS & ROLES
-- ============================================================
CREATE TABLE roles (
  id          TINYINT      UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(50)  NOT NULL UNIQUE,
  description VARCHAR(200)
);

CREATE TABLE users (
  id          INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role_id     TINYINT      UNSIGNED NOT NULL,
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

INSERT INTO roles (name, description) VALUES
  ('admin',      'Full system access'),
  ('manager',    'Operational management'),
  ('production', 'Production line access'),
  ('qc',         'Quality control inspector'),
  ('accounts',   'Finance and documentation');

-- ============================================================
-- 2. BUYERS (Customer / Importer)
-- ============================================================
CREATE TABLE buyers (
  id          INT          UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  country     VARCHAR(100),
  city        VARCHAR(100),
  address     TEXT,
  contact_person VARCHAR(100),
  email       VARCHAR(150),
  phone       VARCHAR(30),
  currency    CHAR(3)      DEFAULT 'USD',
  payment_terms VARCHAR(100),
  is_active   BOOLEAN      DEFAULT TRUE,
  notes       TEXT,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. BUYER INQUIRIES
-- ============================================================
CREATE TABLE inquiries (
  id              VARCHAR(20)     PRIMARY KEY,
  buyer_id        INT UNSIGNED    NOT NULL,
  product_name    VARCHAR(200)    NOT NULL,
  product_category VARCHAR(100),
  quantity        INT UNSIGNED    NOT NULL DEFAULT 0,
  estimated_value DECIMAL(14,2),
  currency        CHAR(3)         DEFAULT 'USD',
  sample_required BOOLEAN         DEFAULT FALSE,
  inquiry_date    DATE            NOT NULL,
  response_due    DATE,
  status          ENUM('pending','active','completed','rejected','on_hold') DEFAULT 'pending',
  remarks         TEXT,
  created_by      INT UNSIGNED,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id)    REFERENCES buyers(id),
  FOREIGN KEY (created_by)  REFERENCES users(id)
);

CREATE TABLE inquiry_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  inquiry_id  VARCHAR(20)  NOT NULL,
  description VARCHAR(300) NOT NULL,
  size_range  VARCHAR(100),
  color       VARCHAR(100),
  quantity    INT UNSIGNED DEFAULT 0,
  unit_price  DECIMAL(10,4),
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. PRODUCTS & STYLES
-- ============================================================
CREATE TABLE products (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  style_no    VARCHAR(50)  NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  category    VARCHAR(100),
  sub_category VARCHAR(100),
  description TEXT,
  buyer_id    INT UNSIGNED,
  season      VARCHAR(50),
  is_active   BOOLEAN      DEFAULT TRUE,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES buyers(id)
);

-- ============================================================
-- 5. ORDERS (Sales Orders)
-- ============================================================
CREATE TABLE orders (
  id              VARCHAR(20)     PRIMARY KEY,
  inquiry_id      VARCHAR(20),
  buyer_id        INT UNSIGNED    NOT NULL,
  product_id      INT UNSIGNED,
  order_date      DATE            NOT NULL,
  delivery_date   DATE,
  payment_terms   VARCHAR(100),
  incoterm        ENUM('FOB','CIF','CFR','EXW','FCA','CPT') DEFAULT 'FOB',
  port_of_loading VARCHAR(100)    DEFAULT 'Chittagong',
  destination_port VARCHAR(100),
  total_qty       INT UNSIGNED    NOT NULL DEFAULT 0,
  unit_price      DECIMAL(10,4)   NOT NULL DEFAULT 0,
  total_value     DECIMAL(14,2)   NOT NULL DEFAULT 0,
  currency        CHAR(3)         DEFAULT 'USD',
  status          ENUM('pending','active','completed','cancelled','on_hold') DEFAULT 'pending',
  progress_pct    TINYINT UNSIGNED DEFAULT 0,
  lc_number       VARCHAR(100),
  lc_bank         VARCHAR(150),
  lc_expiry       DATE,
  remarks         TEXT,
  created_by      INT UNSIGNED,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id)   REFERENCES buyers(id),
  FOREIGN KEY (inquiry_id) REFERENCES inquiries(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE order_items (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id    VARCHAR(20)  NOT NULL,
  size        VARCHAR(20),
  color       VARCHAR(50),
  quantity    INT UNSIGNED NOT NULL DEFAULT 0,
  unit_price  DECIMAL(10,4),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================================
-- 6. SUPPLIERS
-- ============================================================
CREATE TABLE suppliers (
  id          VARCHAR(20)  PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  type        ENUM('fabric','accessory','packaging','chemical','machinery','other') NOT NULL,
  country     VARCHAR(100),
  city        VARCHAR(100),
  address     TEXT,
  contact     VARCHAR(100),
  email       VARCHAR(150),
  phone       VARCHAR(30),
  trade_license VARCHAR(100),
  rating      DECIMAL(2,1) DEFAULT 4.0,
  status      ENUM('active','pending','inactive','blacklisted') DEFAULT 'pending',
  notes       TEXT,
  created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. FABRIC & MATERIALS INVENTORY
-- ============================================================
CREATE TABLE fabric_categories (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE
);

CREATE TABLE fabrics (
  id              VARCHAR(20)     PRIMARY KEY,
  name            VARCHAR(200)    NOT NULL,
  type            VARCHAR(80),
  composition     VARCHAR(200),
  color           VARCHAR(100),
  gsm             SMALLINT UNSIGNED,
  width_cm        DECIMAL(6,2),
  stock           DECIMAL(12,3)   DEFAULT 0,
  unit            ENUM('kg','yard','meter','roll') DEFAULT 'kg',
  min_stock       DECIMAL(12,3)   DEFAULT 0,
  cost_per_unit   DECIMAL(10,4),
  supplier_id     VARCHAR(20),
  location        VARCHAR(100),
  last_reorder    DATE,
  notes           TEXT,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE fabric_movements (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  fabric_id   VARCHAR(20)  NOT NULL,
  order_id    VARCHAR(20),
  movement    ENUM('in','out','adjustment') NOT NULL,
  quantity    DECIMAL(12,3) NOT NULL,
  unit_cost   DECIMAL(10,4),
  date        DATE          NOT NULL,
  reference   VARCHAR(100),
  remarks     TEXT,
  created_by  INT UNSIGNED,
  created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fabric_id)  REFERENCES fabrics(id),
  FOREIGN KEY (order_id)   REFERENCES orders(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Trigger: auto update fabric stock after movement
DELIMITER $$
CREATE TRIGGER trg_fabric_stock_after_movement
AFTER INSERT ON fabric_movements FOR EACH ROW
BEGIN
  IF NEW.movement = 'in' THEN
    UPDATE fabrics SET stock = stock + NEW.quantity WHERE id = NEW.fabric_id;
  ELSEIF NEW.movement = 'out' THEN
    UPDATE fabrics SET stock = stock - NEW.quantity WHERE id = NEW.fabric_id;
  ELSE
    UPDATE fabrics SET stock = stock + NEW.quantity WHERE id = NEW.fabric_id;
  END IF;
END$$
DELIMITER ;

-- ============================================================
-- 8. BOM (Bill of Materials)
-- ============================================================
CREATE TABLE bom (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        VARCHAR(20)  NOT NULL,
  fabric_id       VARCHAR(20),
  item_name       VARCHAR(200),
  item_type       ENUM('fabric','trimming','accessory','packing') NOT NULL,
  quantity_needed DECIMAL(12,3),
  unit            VARCHAR(20),
  unit_cost       DECIMAL(10,4),
  total_cost      DECIMAL(14,2),
  supplier_id     VARCHAR(20),
  remarks         TEXT,
  FOREIGN KEY (order_id)    REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (fabric_id)   REFERENCES fabrics(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- ============================================================
-- 9. PRODUCTION PLANNING
-- ============================================================
CREATE TABLE production (
  id              VARCHAR(20)     PRIMARY KEY,
  order_id        VARCHAR(20)     NOT NULL,
  plan_start_date DATE,
  plan_end_date   DATE,
  actual_start    DATE,
  actual_end      DATE,
  total_qty       INT UNSIGNED    NOT NULL DEFAULT 0,
  cut_qty         INT UNSIGNED    DEFAULT 0,
  sewing_qty      INT UNSIGNED    DEFAULT 0,
  finishing_qty   INT UNSIGNED    DEFAULT 0,
  qc_passed_qty   INT UNSIGNED    DEFAULT 0,
  status          ENUM('pending','active','completed','on_hold') DEFAULT 'pending',
  floor           VARCHAR(50),
  line_no         VARCHAR(20),
  supervisor      VARCHAR(100),
  remarks         TEXT,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE production_daily_log (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  production_id VARCHAR(20)  NOT NULL,
  log_date      DATE         NOT NULL,
  stage         ENUM('cutting','sewing','finishing','qc') NOT NULL,
  target_qty    INT UNSIGNED DEFAULT 0,
  achieved_qty  INT UNSIGNED DEFAULT 0,
  reject_qty    INT UNSIGNED DEFAULT 0,
  remarks       TEXT,
  logged_by     INT UNSIGNED,
  created_at    DATETIME     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (production_id) REFERENCES production(id) ON DELETE CASCADE,
  FOREIGN KEY (logged_by)     REFERENCES users(id)
);

-- ============================================================
-- 10. QUALITY CONTROL
-- ============================================================
CREATE TABLE qc_inspections (
  id              VARCHAR(20)     PRIMARY KEY,
  order_id        VARCHAR(20)     NOT NULL,
  production_id   VARCHAR(20),
  inspection_type ENUM('inline','final','pre-shipment','lab') NOT NULL DEFAULT 'final',
  inspection_date DATE            NOT NULL,
  inspector_id    INT UNSIGNED,
  inspector_name  VARCHAR(100),
  total_inspected INT UNSIGNED    DEFAULT 0,
  passed          INT UNSIGNED    DEFAULT 0,
  failed          INT UNSIGNED    DEFAULT 0,
  fail_rate       DECIMAL(5,2)    DEFAULT 0.00,
  aql_level       VARCHAR(10)     DEFAULT '2.5',
  result          ENUM('pass','fail','conditional') DEFAULT 'pass',
  status          ENUM('active','completed','rejected') DEFAULT 'active',
  report_url      VARCHAR(500),
  remarks         TEXT,
  created_at      DATETIME        DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)      REFERENCES orders(id),
  FOREIGN KEY (production_id) REFERENCES production(id),
  FOREIGN KEY (inspector_id)  REFERENCES users(id)
);

CREATE TABLE qc_defects (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  inspection_id   VARCHAR(20)  NOT NULL,
  defect_type     VARCHAR(100) NOT NULL,
  defect_category ENUM('critical','major','minor') NOT NULL,
  quantity        INT UNSIGNED DEFAULT 1,
  location        VARCHAR(100),
  description     TEXT,
  FOREIGN KEY (inspection_id) REFERENCES qc_inspections(id) ON DELETE CASCADE
);

-- Trigger: auto-calc fail rate and result on insert
DELIMITER $$
CREATE TRIGGER trg_qc_fail_rate
BEFORE INSERT ON qc_inspections FOR EACH ROW
BEGIN
  IF NEW.total_inspected > 0 THEN
    SET NEW.fail_rate = ROUND((NEW.failed / NEW.total_inspected) * 100, 2);
  END IF;
  IF NEW.fail_rate > 4.0 THEN
    SET NEW.result = 'fail';
  ELSEIF NEW.fail_rate > 2.5 THEN
    SET NEW.result = 'conditional';
  ELSE
    SET NEW.result = 'pass';
  END IF;
END$$
DELIMITER ;

-- ============================================================
-- 11. SHIPMENT
-- ============================================================
CREATE TABLE shipments (
  id                  VARCHAR(20)  PRIMARY KEY,
  order_id            VARCHAR(20)  NOT NULL,
  vessel_name         VARCHAR(150),
  voyage_no           VARCHAR(50),
  port_of_loading     VARCHAR(100) DEFAULT 'Chittagong',
  port_of_destination VARCHAR(100),
  etd                 DATE,
  eta                 DATE,
  actual_departure    DATE,
  actual_arrival      DATE,
  total_qty           INT UNSIGNED DEFAULT 0,
  total_cartons       INT UNSIGNED DEFAULT 0,
  gross_weight_kg     DECIMAL(10,3),
  net_weight_kg       DECIMAL(10,3),
  cbm                 DECIMAL(8,3),
  container_no        VARCHAR(100),
  container_type      VARCHAR(30),
  seal_no             VARCHAR(50),
  freight_amount      DECIMAL(12,2),
  freight_currency    CHAR(3)      DEFAULT 'USD',
  status              ENUM('pending','loaded','shipped','arrived','delivered') DEFAULT 'pending',
  remarks             TEXT,
  created_at          DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- ============================================================
-- 12. EXPORT DOCUMENTS
-- ============================================================
CREATE TABLE export_documents (
  id              VARCHAR(20)  PRIMARY KEY,
  order_id        VARCHAR(20)  NOT NULL,
  shipment_id     VARCHAR(20),
  doc_type        ENUM(
    'commercial_invoice',
    'packing_list',
    'bill_of_lading',
    'certificate_of_origin',
    'gsp_form_a',
    'inspection_certificate',
    'insurance_certificate',
    'lc_amendment',
    'test_report',
    'other'
  ) NOT NULL,
  doc_no          VARCHAR(100),
  issue_date      DATE,
  expiry_date     DATE,
  issuing_body    VARCHAR(150),
  amount          DECIMAL(14,2),
  currency        CHAR(3)      DEFAULT 'USD',
  file_url        VARCHAR(500),
  status          ENUM('draft','submitted','approved','rejected','archived') DEFAULT 'draft',
  remarks         TEXT,
  created_by      INT UNSIGNED,
  created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id)    REFERENCES orders(id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  FOREIGN KEY (created_by)  REFERENCES users(id)
);

-- ============================================================
-- 13. COMMERCIAL INVOICE (detail)
-- ============================================================
CREATE TABLE invoice_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id     VARCHAR(20)  NOT NULL,
  description     VARCHAR(300) NOT NULL,
  hs_code         VARCHAR(20),
  quantity        INT UNSIGNED NOT NULL DEFAULT 0,
  unit            VARCHAR(20)  DEFAULT 'pcs',
  unit_price      DECIMAL(10,4) NOT NULL,
  total_price     DECIMAL(14,2) NOT NULL,
  FOREIGN KEY (document_id) REFERENCES export_documents(id) ON DELETE CASCADE
);

-- ============================================================
-- 14. PACKING LIST (detail)
-- ============================================================
CREATE TABLE packing_list_items (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id     VARCHAR(20)  NOT NULL,
  carton_from     INT UNSIGNED,
  carton_to       INT UNSIGNED,
  style           VARCHAR(100),
  color           VARCHAR(80),
  size            VARCHAR(20),
  quantity        INT UNSIGNED NOT NULL DEFAULT 0,
  net_weight      DECIMAL(8,3),
  gross_weight    DECIMAL(8,3),
  cbm             DECIMAL(7,4),
  FOREIGN KEY (document_id) REFERENCES export_documents(id) ON DELETE CASCADE
);

-- ============================================================
-- 15. FINANCIAL OVERVIEW
-- ============================================================
CREATE TABLE cost_breakdown (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id        VARCHAR(20)  NOT NULL UNIQUE,
  fabric_cost     DECIMAL(14,2) DEFAULT 0,
  trimming_cost   DECIMAL(14,2) DEFAULT 0,
  labor_cost      DECIMAL(14,2) DEFAULT 0,
  overhead_cost   DECIMAL(14,2) DEFAULT 0,
  packing_cost    DECIMAL(14,2) DEFAULT 0,
  freight_cost    DECIMAL(14,2) DEFAULT 0,
  total_cost      DECIMAL(14,2) DEFAULT 0,
  selling_price   DECIMAL(14,2) DEFAULT 0,
  profit          DECIMAL(14,2) DEFAULT 0,
  profit_pct      DECIMAL(5,2)  DEFAULT 0,
  currency        CHAR(3)       DEFAULT 'USD',
  notes           TEXT,
  updated_at      DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- ============================================================
-- 16. AUDIT LOG
-- ============================================================
CREATE TABLE audit_log (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED,
  action      VARCHAR(50)  NOT NULL,
  table_name  VARCHAR(80)  NOT NULL,
  record_id   VARCHAR(50),
  old_data    JSON,
  new_data    JSON,
  ip_address  VARCHAR(45),
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

-- SP: Get full order summary
DELIMITER $$
CREATE PROCEDURE sp_order_summary(IN p_order_id VARCHAR(20))
BEGIN
  SELECT
    o.id                AS order_id,
    b.name              AS buyer,
    b.country           AS buyer_country,
    o.order_date,
    o.delivery_date,
    o.total_qty,
    o.unit_price,
    o.total_value,
    o.currency,
    o.status,
    o.progress_pct,
    o.incoterm,
    o.port_of_loading,
    o.destination_port,
    p.id                AS production_id,
    p.cut_qty,
    p.sewing_qty,
    p.finishing_qty,
    p.qc_passed_qty,
    p.status            AS prod_status,
    q.fail_rate         AS qc_fail_rate,
    q.result            AS qc_result,
    s.vessel_name,
    s.etd,
    s.eta,
    s.status            AS shipment_status
  FROM orders o
  LEFT JOIN buyers      b ON o.buyer_id = b.id
  LEFT JOIN production  p ON p.order_id = o.id
  LEFT JOIN qc_inspections q ON q.order_id = o.id AND q.inspection_type = 'final'
  LEFT JOIN shipments   s ON s.order_id = o.id
  WHERE o.id = p_order_id
  LIMIT 1;
END$$
DELIMITER ;

-- SP: Dashboard KPIs
DELIMITER $$
CREATE PROCEDURE sp_dashboard_kpis()
BEGIN
  SELECT
    (SELECT COUNT(*) FROM orders WHERE status IN ('active','pending'))        AS active_orders,
    (SELECT COUNT(*) FROM orders WHERE status = 'completed')                  AS completed_orders,
    (SELECT COALESCE(SUM(total_value),0) FROM orders)                         AS total_export_value,
    (SELECT COUNT(*) FROM inquiries WHERE status = 'active')                  AS active_inquiries,
    (SELECT COUNT(*) FROM fabrics WHERE stock < min_stock)                    AS low_stock_alerts,
    (SELECT COALESCE(AVG(fail_rate),0) FROM qc_inspections)                   AS avg_qc_fail_rate,
    (SELECT COUNT(*) FROM shipments WHERE status = 'shipped')                 AS shipments_in_transit,
    (SELECT COALESCE(SUM(stock * cost_per_unit),0) FROM fabrics)              AS fabric_inventory_value;
END$$
DELIMITER ;

-- SP: Monthly export value
DELIMITER $$
CREATE PROCEDURE sp_monthly_export(IN p_year YEAR)
BEGIN
  SELECT
    MONTHNAME(order_date)   AS month_name,
    MONTH(order_date)       AS month_num,
    COUNT(*)                AS order_count,
    SUM(total_value)        AS total_value
  FROM orders
  WHERE YEAR(order_date) = p_year AND status != 'cancelled'
  GROUP BY MONTH(order_date), MONTHNAME(order_date)
  ORDER BY month_num;
END$$
DELIMITER ;

-- SP: Low stock alert list
DELIMITER $$
CREATE PROCEDURE sp_low_stock_fabrics()
BEGIN
  SELECT
    f.id,
    f.name,
    f.type,
    f.stock,
    f.min_stock,
    f.unit,
    (f.min_stock - f.stock) AS shortage,
    s.name                  AS supplier,
    s.email                 AS supplier_email
  FROM fabrics f
  LEFT JOIN suppliers s ON f.supplier_id = s.id
  WHERE f.stock < f.min_stock
  ORDER BY (f.min_stock - f.stock) DESC;
END$$
DELIMITER ;

-- SP: Create full order with items
DELIMITER $$
CREATE PROCEDURE sp_create_order(
  IN  p_id            VARCHAR(20),
  IN  p_inquiry_id    VARCHAR(20),
  IN  p_buyer_id      INT UNSIGNED,
  IN  p_product_id    INT UNSIGNED,
  IN  p_order_date    DATE,
  IN  p_delivery_date DATE,
  IN  p_total_qty     INT UNSIGNED,
  IN  p_unit_price    DECIMAL(10,4),
  IN  p_currency      CHAR(3),
  IN  p_incoterm      VARCHAR(10),
  IN  p_loading_port  VARCHAR(100),
  IN  p_dest_port     VARCHAR(100),
  IN  p_created_by    INT UNSIGNED,
  OUT p_result        VARCHAR(100)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    SET p_result = 'ERROR: Transaction failed';
  END;

  START TRANSACTION;

  INSERT INTO orders (id, inquiry_id, buyer_id, product_id, order_date, delivery_date,
    total_qty, unit_price, total_value, currency, incoterm,
    port_of_loading, destination_port, status, created_by)
  VALUES (p_id, p_inquiry_id, p_buyer_id, p_product_id, p_order_date, p_delivery_date,
    p_total_qty, p_unit_price, p_total_qty * p_unit_price, p_currency, p_incoterm,
    p_loading_port, p_dest_port, 'pending', p_created_by);

  -- Update inquiry status if linked
  IF p_inquiry_id IS NOT NULL AND p_inquiry_id != '' THEN
    UPDATE inquiries SET status = 'completed' WHERE id = p_inquiry_id;
  END IF;

  -- Initialise production record
  INSERT INTO production (id, order_id, total_qty, status)
  VALUES (CONCAT('PROD-', SUBSTRING(p_id, 5)), p_id, p_total_qty, 'pending');

  -- Initialise cost breakdown
  INSERT INTO cost_breakdown (order_id, selling_price, currency)
  VALUES (p_id, p_total_qty * p_unit_price, p_currency);

  -- Audit
  INSERT INTO audit_log (action, table_name, record_id, new_data)
  VALUES ('INSERT', 'orders', p_id, JSON_OBJECT('id', p_id, 'buyer_id', p_buyer_id));

  COMMIT;
  SET p_result = CONCAT('OK: Order ', p_id, ' created');
END$$
DELIMITER ;

-- SP: Shipment document bundle check
DELIMITER $$
CREATE PROCEDURE sp_document_checklist(IN p_order_id VARCHAR(20))
BEGIN
  SELECT
    doc_type,
    MAX(CASE WHEN status IN ('approved','submitted') THEN 'READY' ELSE 'MISSING/DRAFT' END) AS status,
    MAX(doc_no)    AS doc_no,
    MAX(issue_date) AS issue_date
  FROM export_documents
  WHERE order_id = p_order_id
  GROUP BY doc_type

  UNION ALL

  SELECT req_doc, 'MISSING', NULL, NULL
  FROM (
    SELECT 'commercial_invoice' req_doc UNION
    SELECT 'packing_list'               UNION
    SELECT 'bill_of_lading'             UNION
    SELECT 'certificate_of_origin'
  ) required
  WHERE req_doc NOT IN (
    SELECT doc_type FROM export_documents WHERE order_id = p_order_id
  );
END$$
DELIMITER ;

-- ============================================================
-- VIEWS
-- ============================================================

CREATE VIEW v_order_overview AS
SELECT
  o.id, o.order_date, o.delivery_date,
  b.name          AS buyer,
  b.country       AS buyer_country,
  o.total_qty, o.total_value, o.currency,
  o.status, o.progress_pct,
  o.incoterm, o.port_of_loading, o.destination_port,
  p.cut_qty, p.sewing_qty, p.finishing_qty, p.qc_passed_qty,
  p.status        AS prod_status,
  s.status        AS ship_status,
  s.etd, s.eta
FROM orders o
JOIN buyers b ON o.buyer_id = b.id
LEFT JOIN production p ON p.order_id = o.id
LEFT JOIN shipments  s ON s.order_id = o.id;

CREATE VIEW v_fabric_stock_alert AS
SELECT
  f.id, f.name, f.type, f.composition,
  f.stock, f.min_stock, f.unit,
  (f.min_stock - f.stock) AS shortage,
  f.cost_per_unit,
  (f.stock * f.cost_per_unit) AS inventory_value,
  s.name AS supplier_name,
  s.email AS supplier_email
FROM fabrics f
LEFT JOIN suppliers s ON f.supplier_id = s.id
WHERE f.stock < f.min_stock;

CREATE VIEW v_qc_summary AS
SELECT
  q.id, q.order_id, q.inspection_date,
  o.buyer_id,
  b.name              AS buyer,
  q.inspection_type,
  q.total_inspected, q.passed, q.failed,
  q.fail_rate, q.result, q.aql_level,
  q.inspector_name,
  q.status
FROM qc_inspections q
JOIN orders o ON q.order_id = o.id
JOIN buyers b ON o.buyer_id = b.id;

CREATE VIEW v_export_pipeline AS
SELECT
  o.id         AS order_id,
  b.name       AS buyer,
  o.total_qty,
  o.total_value,
  o.delivery_date,
  p.status     AS prod_status,
  p.finishing_qty,
  qi.result    AS qc_result,
  s.vessel_name,
  s.etd,
  s.status     AS ship_status,
  COUNT(d.id)  AS doc_count
FROM orders o
JOIN buyers b ON o.buyer_id = b.id
LEFT JOIN production     p  ON p.order_id  = o.id
LEFT JOIN qc_inspections qi ON qi.order_id = o.id AND qi.inspection_type = 'final'
LEFT JOIN shipments      s  ON s.order_id  = o.id
LEFT JOIN export_documents d ON d.order_id = o.id AND d.status = 'approved'
WHERE o.status IN ('active','completed')
GROUP BY o.id, b.name, o.total_qty, o.total_value, o.delivery_date,
         p.status, p.finishing_qty, qi.result, s.vessel_name, s.etd, s.status;

-- ============================================================
-- SEED DATA
-- ============================================================

INSERT INTO buyers (name, country, city, contact_person, email, phone, currency, payment_terms) VALUES
  ('H&M Sweden',      'Sweden',    'Stockholm', 'Erik Larsson',   'erik.larsson@hm.com',           '+46-8-7961000', 'USD', 'L/C at sight'),
  ('Zara Spain',      'Spain',     'Madrid',    'Maria Garcia',   'maria.garcia@zara.com',         '+34-981-185400','EUR', 'L/C 30 days'),
  ('Gap USA',         'USA',       'San Francisco','John Smith',   'j.smith@gap.com',               '+1-415-9270550','USD', 'L/C at sight'),
  ('Uniqlo Japan',    'Japan',     'Tokyo',     'Tanaka Kenji',   'tanaka.k@uniqlo.com',           '+81-3-6226-6800','USD', 'L/C at sight'),
  ('Primark Ireland', 'Ireland',   'Dublin',    'Patrick Brown',  'p.brown@primark.com',           '+353-1-6855555','EUR', 'L/C 60 days');

INSERT INTO suppliers (id, name, type, country, contact, email, phone, rating, status) VALUES
  ('SUP-001','Mahmud Fabrics Ltd', 'fabric',    'Bangladesh','Mahmud Ali',   'mahmud@mahmudfabrics.com','+880-2-9887654',4.8,'active'),
  ('SUP-002','Denim World',        'fabric',    'Bangladesh','Rahim Sheikh',  'info@denimworld.com.bd',  '+880-2-8765432',4.5,'active'),
  ('SUP-003','Poly Mills',         'fabric',    'Bangladesh','Kamal Hossain', 'sales@polymills.com',     '+880-2-7654321',4.2,'active'),
  ('SUP-004','Global Accessories', 'accessory', 'China',     'Chen Wei',      'global@accessories.cn',   '+86-21-6543210',3.9,'active'),
  ('SUP-005','Zippers & More',     'accessory', 'Bangladesh','Nasrin Akter',  'info@zippersmore.com',    '+880-2-6543210',4.0,'pending');

INSERT INTO fabrics (id, name, type, composition, color, gsm, stock, unit, min_stock, cost_per_unit, supplier_id) VALUES
  ('FAB-001','100% Cotton Pique', 'Pique',  '100% Cotton',             'White',   180, 25000, 'kg', 5000, 3.20,'SUP-001'),
  ('FAB-002','Stretch Denim',     'Denim',  '98% Cotton 2% Elastane',  'Indigo',  320, 18000, 'kg', 8000, 5.50,'SUP-002'),
  ('FAB-003','Polar Fleece',      'Fleece', '100% Polyester',          'Charcoal',280, 8000,  'kg', 3000, 4.80,'SUP-003'),
  ('FAB-004','Single Jersey',     'Jersey', '100% Cotton',             'Various', 160, 3200,  'kg', 5000, 2.40,'SUP-001'),
  ('FAB-005','Twill Woven',       'Woven',  '65% Polyester 35% Cotton','Navy',    240, 12000, 'kg', 4000, 3.80,'SUP-001');

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_inquiries_buyer     ON inquiries (buyer_id);
CREATE INDEX idx_inquiries_status    ON inquiries (status);
CREATE INDEX idx_orders_buyer        ON orders (buyer_id);
CREATE INDEX idx_orders_status       ON orders (status);
CREATE INDEX idx_orders_delivery     ON orders (delivery_date);
CREATE INDEX idx_production_order    ON production (order_id);
CREATE INDEX idx_production_status   ON production (status);
CREATE INDEX idx_qc_order            ON qc_inspections (order_id);
CREATE INDEX idx_shipments_order     ON shipments (order_id);
CREATE INDEX idx_shipments_status    ON shipments (status);
CREATE INDEX idx_documents_order     ON export_documents (order_id);
CREATE INDEX idx_fabric_stock        ON fabrics (stock, min_stock);
CREATE INDEX idx_audit_table         ON audit_log (table_name, record_id);

-- END OF SCHEMA
