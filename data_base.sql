CREATE DATABASE SupplyChainDistributionDB;
USE SupplyChainDistributionDB;

-- =====================================================
--  PRODUCT DISTRIBUTION CHAIN DATABASE STRUCTURE
-- =====================================================

-- 1. Manufacturer
CREATE TABLE Manufacturer (
    manufacturer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 2. Product
CREATE TABLE Product (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    manufacturer_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    unit_price DECIMAL(10,2),
    description TEXT,
    FOREIGN KEY (manufacturer_id) REFERENCES Manufacturer(manufacturer_id)
);

-- 3. Distributor
CREATE TABLE Distributor (
    distributor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 4. Retailer
CREATE TABLE Retailer (
    retailer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 5. Customer
CREATE TABLE Customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT
);

-- 6. Inventory
CREATE TABLE Inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    owner_type ENUM('Distributor','Retailer') NOT NULL,
    owner_id INT NOT NULL,
    quantity INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- 7. Order Table
CREATE TABLE `Order` (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_type ENUM('Manufacturer→Distributor','Distributor→Retailer','Retailer→Customer') NOT NULL,
    source_id INT NOT NULL,
    destination_id INT NOT NULL,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Placed','In Transit','Delivered','Cancelled') DEFAULT 'Placed'
);

-- 8. OrderItem
CREATE TABLE OrderItem (
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2),
    PRIMARY KEY (order_id, product_id),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Product(product_id)
);

-- 9. Shipment
CREATE TABLE Shipment (
    shipment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    ship_date DATE,
    delivery_date DATE,
    tracking_no VARCHAR(50),
    carrier VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

-- 10. Payment
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_date DATE,
    amount DECIMAL(10,2),
    payment_method ENUM('Cash','Card','BankTransfer'),
    status ENUM('Pending','Completed','Failed') DEFAULT 'Pending',
    FOREIGN KEY (order_id) REFERENCES `Order`(order_id)
);

-- ================================================
-- INSERT SAMPLE DATA FOR PRODUCT DISTRIBUTION CHAIN
-- ================================================

-- Manufacturer
INSERT INTO Manufacturer (name, contact_person, phone, email, address) VALUES
('TechNova Industries', 'Alice Morgan', '9876543210', 'alice@technova.com', 'New York, USA'),
('FreshFoods Co.', 'John Davis', '9123456789', 'john@freshfoods.com', 'Chicago, USA'),
('AutoMax Corp.', 'David Lee', '9784512369', 'david@automax.com', 'Detroit, USA');

-- Product
INSERT INTO Product (manufacturer_id, name, category, unit_price, description) VALUES
(1, 'Smart TV 50"', 'Electronics', 400.00, '4K LED Smart TV with WiFi'),
(1, 'Bluetooth Speaker', 'Electronics', 80.00, 'Portable wireless speaker'),
(2, 'Organic Honey', 'Food', 12.50, 'Pure organic honey 500g'),
(2, 'Olive Oil', 'Food', 18.00, 'Extra virgin olive oil 1L'),
(3, 'Car Battery', 'Automotive', 120.00, '12V maintenance-free car battery'),
(3, 'Brake Pads', 'Automotive', 45.00, 'Front disc brake pads set');

-- Distributor
INSERT INTO Distributor (name, contact_person, phone, email, address) VALUES
('Global Distributors', 'Michael Scott', '9001234567', 'michael@globald.com', 'Los Angeles, USA'),
('Sunrise Supplies', 'Emily Clark', '9887654321', 'emily@sunrise.com', 'Houston, USA');

-- Retailer
INSERT INTO Retailer (name, contact_person, phone, email, address) VALUES
('TechMart', 'Robert Hill', '9011223344', 'robert@techmart.com', 'San Francisco, USA'),
('DailyNeeds Store', 'Rachel Adams', '9099887766', 'rachel@dailyneeds.com', 'Dallas, USA');

-- Customer
INSERT INTO Customer (name, phone, email, address) VALUES
('Ethan Brown', '9991122334', 'ethan@gmail.com', 'Seattle, USA'),
('Sophia Wilson', '9992233445', 'sophia@gmail.com', 'Miami, USA'),
('Liam Johnson', '9993344556', 'liam@gmail.com', 'Boston, USA');

-- Inventory
INSERT INTO Inventory (product_id, owner_type, owner_id, quantity, last_updated) VALUES
(1, 'Distributor', 1, 50, NOW()),
(2, 'Distributor', 1, 100, NOW()),
(3, 'Distributor', 2, 200, NOW()),
(4, 'Distributor', 2, 150, NOW()),
(5, 'Retailer', 1, 20, NOW()),
(6, 'Retailer', 2, 30, NOW());

-- Orders
INSERT INTO `Order` (order_type, source_id, destination_id, order_date, status) VALUES
('Manufacturer→Distributor', 1, 1, '2025-10-01', 'Delivered'),
('Distributor→Retailer', 1, 1, '2025-10-03', 'Delivered'),
('Retailer→Customer', 1, 1, '2025-10-05', 'In Transit'),
('Manufacturer→Distributor', 2, 2, '2025-10-02', 'Delivered'),
('Distributor→Retailer', 2, 2, '2025-10-06', 'Placed'),
('Retailer→Customer', 2, 2, '2025-10-07', 'Placed');

-- OrderItem
INSERT INTO OrderItem (order_id, product_id, quantity, unit_price) VALUES
(1, 1, 10, 400.00),
(1, 2, 15, 80.00),
(2, 1, 5, 420.00),
(2, 2, 10, 85.00),
(3, 3, 2, 15.00),
(4, 4, 8, 18.00),
(5, 5, 3, 125.00),
(6, 6, 5, 50.00);

-- Shipment
INSERT INTO Shipment (order_id, ship_date, delivery_date, tracking_no, carrier) VALUES
(1, '2025-10-01', '2025-10-02', 'TRK1001', 'FedEx'),
(2, '2025-10-03', '2025-10-04', 'TRK1002', 'UPS'),
(3, '2025-10-05', NULL, 'TRK1003', 'DHL'),
(4, '2025-10-02', '2025-10-03', 'TRK1004', 'FedEx'),
(5, '2025-10-06', NULL, 'TRK1005', 'BlueDart'),
(6, '2025-10-07', NULL, 'TRK1006', 'DTDC');

-- Payment
INSERT INTO Payment (order_id, payment_date, amount, payment_method, status) VALUES
(1, '2025-10-02', 8200.00, 'BankTransfer', 'Completed'),
(2, '2025-10-04', 4650.00, 'Card', 'Completed'),
(3, NULL, 30.00, 'Cash', 'Pending'),
(4, '2025-10-03', 144.00, 'BankTransfer', 'Completed'),
(5, NULL, 375.00, 'Cash', 'Pending'),
(6, NULL, 250.00, 'Card', 'Pending');

