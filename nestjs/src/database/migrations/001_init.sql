-- ============================================================
-- INVENTORY MANAGEMENT SYSTEM - PostgreSQL Schema
-- ============================================================

-- Enable UUID extension (optional, using BIGSERIAL instead)
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- 1. UNITS — Đơn vị
-- ============================================================
CREATE TABLE IF NOT EXISTS units (
    id         BIGSERIAL PRIMARY KEY,
    code       VARCHAR(20)  NOT NULL UNIQUE,
    name       VARCHAR(200) NOT NULL,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. DIVISIONS — Bộ phận / Phòng ban
-- ============================================================
CREATE TABLE IF NOT EXISTS divisions (
    id         BIGSERIAL PRIMARY KEY,
    code       VARCHAR(20)  NOT NULL UNIQUE,
    name       VARCHAR(200) NOT NULL,
    unit_id    BIGINT       REFERENCES units(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. WAREHOUSES — Kho hàng
-- ============================================================
CREATE TABLE IF NOT EXISTS warehouses (
    id           BIGSERIAL PRIMARY KEY,
    code         VARCHAR(20)  NOT NULL UNIQUE,
    name         VARCHAR(200) NOT NULL,
    location     VARCHAR(300),           -- địa điểm
    address      TEXT,
    manager_name VARCHAR(150),
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4. PRODUCTS — Vật tư / Hàng hoá
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id                BIGSERIAL PRIMARY KEY,
    code              VARCHAR(50)  NOT NULL UNIQUE,   -- Mã số (cột C)
    name              VARCHAR(300) NOT NULL,           -- Tên, nhãn hiệu, quy cách, phẩm chất (cột B)
    description       TEXT,
    calculation_unit  VARCHAR(30),                    -- Đơn vị tính toán
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. GOODS RECEIVED NOTES — Phiếu nhập kho (Header)
-- ============================================================
CREATE TABLE IF NOT EXISTS goods_received_notes (
    id                      BIGSERIAL    PRIMARY KEY,
    receipt_date            DATE         NOT NULL,          -- Ngày tháng năm
    deliverer_name          VARCHAR(200),
    preparer_name           VARCHAR(200),
    storekeeper_name        VARCHAR(200),
    chief_accountant_name   VARCHAR(200),
    delivery_date           DATE,
    warehouse_id            BIGINT       NOT NULL REFERENCES warehouses(id),
    division_id             BIGINT       REFERENCES divisions(id) ON DELETE SET NULL,

    -- "Theo ... số ... ngày ... tháng ... năm ... của ..."
    ref_doc_type            VARCHAR(100),  -- loại chứng từ (hợp đồng, đơn hàng, ...)
    ref_doc_number          VARCHAR(50),   -- số chứng từ tham chiếu
    ref_doc_date            DATE,          -- ngày chứng từ tham chiếu
    ref_doc_issuer          VARCHAR(200),  -- của (đơn vị phát hành)

    -- Số tiền nợ/có
    debit_amount            NUMERIC(18,2) NOT NULL DEFAULT 0, -- Số tiền nợ
    credit_amount           NUMERIC(18,2) NOT NULL DEFAULT 0, -- Số tiền có

    -- Chứng từ gốc kèm theo
    source_documents        INTEGER,       -- Số chứng từ gốc kèm theo (dạng số)

    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 6. GOODS RECEIVED NOTE PRODUCTS — Chi tiết vật tư phiếu nhập
-- ============================================================
CREATE TABLE IF NOT EXISTS goods_received_note_products (
    id                      BIGSERIAL    PRIMARY KEY,
    grn_id                  BIGINT       NOT NULL REFERENCES goods_received_notes(id) ON DELETE CASCADE,
    product_id              BIGINT       NOT NULL REFERENCES products(id),
    qty_actual              NUMERIC(15,3) NOT NULL DEFAULT 0,
    qty_document            NUMERIC(15,3) NOT NULL DEFAULT 0,
    unit_price              NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_amount            NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_amount_in_words   TEXT,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 7. PRODUCT STOCK SUMMARIES — Tổng hợp tồn kho
-- ============================================================
CREATE TABLE IF NOT EXISTS product_stock_summaries (
    id                      BIGSERIAL    PRIMARY KEY,
    product_id              BIGINT       NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    total_actual_qty        NUMERIC(15,3) NOT NULL DEFAULT 0,
    total_document_qty      NUMERIC(15,3) NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_grn_date     ON goods_received_notes(receipt_date DESC);
CREATE INDEX IF NOT EXISTS idx_grn_warehouse ON goods_received_notes(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_products_code               ON products(code);

-- ============================================================
-- AUTO UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_units_updated_at
    BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_divisions_updated_at
    BEFORE UPDATE ON divisions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_warehouses_updated_at
    BEFORE UPDATE ON warehouses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_grn_updated_at
    BEFORE UPDATE ON goods_received_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_grn_products_updated_at
    BEFORE UPDATE ON goods_received_note_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_product_summaries_updated_at
    BEFORE UPDATE ON product_stock_summaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- SEED DATA — Dữ liệu mẫu
-- ============================================================
INSERT INTO units (code, name) VALUES
    ('UNIT-01', 'Đơn vị Tổng'),
    ('UNIT-02', 'Đơn vị 2')
ON CONFLICT (code) DO NOTHING;

INSERT INTO divisions (code, name, unit_id) VALUES
    ('DIV-01', 'Phòng Vật tư', 1),
    ('DIV-02', 'Phòng Vật tư 2', 1),
    ('DIV-03', 'Phòng Vật tư 3', 1),
    ('DIV-04', 'Phòng Vật tư 4 DIV-04', 2)
ON CONFLICT (code) DO NOTHING;

INSERT INTO warehouses (code, name, location, address) VALUES
    ('KHO-01', 'Kho Tổng', 'Tầng 1, Toà nhà A', '123 Đường Lê Lợi, Q.1, TP.HCM'),
    ('KHO-02', 'Kho Thành Phẩm', 'Tầng 2, Toà nhà B', '456 Đường Nguyễn Huệ, Q.1, TP.HCM')
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (code, name, description, calculation_unit) VALUES
    ('PROD-001', 'Thép cuộn CB300-V', 'Thép cuộn xây dựng phi 6', 'kg'),
    ('PROD-002', 'Xi măng Portland hỗn hợp PCB40', 'Xi măng bao 50kg', 'bao'),
    ('PROD-003', 'Gạch xây tuynel 2 lỗ', 'Gạch kích thước 180x80x80mm', 'viên'),
    ('PROD-004', 'Cát xây tô', 'Cát sạch dùng cho xây trát', 'm3'),
    ('PROD-005', 'Đá 1x2', 'Đá xây dựng kích thước 10-20mm', 'm3')
ON CONFLICT (code) DO NOTHING;

INSERT INTO product_stock_summaries (product_id, total_actual_qty, total_document_qty) VALUES
    (1, 1000.000, 1000.000),
    (2, 500.000, 500.000),
    (3, 5000.000, 5000.000),
    (4, 20.000, 20.000),
    (5, 15.000, 15.000)
ON CONFLICT (product_id) DO NOTHING;
