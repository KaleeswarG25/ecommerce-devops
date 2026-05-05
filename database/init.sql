-- Database schema for DevSecOps E-Commerce Platform

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  image_url TEXT,
  rating NUMERIC(3, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed users
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Platform Admin', 'admin@ecommerce.dev', '$2b$10$FisxKWgqqSB8EYB17iSZIuehT9zcQhxi8INJJ/0whmnioEUQ42ArW', 'admin'),
  ('Alice Customer', 'alice@example.com', '$2b$10$7iNfmpUuiuof28iFb18XSuBGCKWJx1.RDZ1htZF.xq8xpdoUBlqpq', 'customer'),
  ('Bob Shopper', 'bob@example.com', '$2b$10$R52gOylb/FcLjE/cyKDePet0Wd05Mpnm8Z1rCbHVazsf7RMFg4cpK', 'customer');

-- Seed products
INSERT INTO products (name, description, price, category, stock, image_url, rating) VALUES
  ('Urban Leather Backpack', 'A rugged leather backpack with water-resistant coating and laptop compartment.', 129.99, 'Accessories', 42, 'https://via.placeholder.com/400x400?text=Backpack', 4.8),
  ('Wireless Noise-Canceling Headphones', 'Comfortable over-ear headphones with active noise cancellation and long battery life.', 199.99, 'Electronics', 65, 'https://via.placeholder.com/400x400?text=Headphones', 4.7),
  ('Eco-Friendly Running Shoes', 'Lightweight and breathable running shoes made from recycled materials.', 89.99, 'Footwear', 76, 'https://via.placeholder.com/400x400?text=Running+Shoes', 4.5),
  ('Smart Fitness Watch', 'Track workouts, heart rate, sleep, and notifications with a premium AMOLED display.', 159.99, 'Wearables', 58, 'https://via.placeholder.com/400x400?text=Fitness+Watch', 4.6),
  ('Modern Steel Desk Lamp', 'Adjustable LED desk lamp with touch controls and wireless charging pad.', 69.99, 'Home', 120, 'https://via.placeholder.com/400x400?text=Desk+Lamp', 4.4),
  ('Premium Coffee Grinder', 'Precision coffee grinder for espresso and drip coffee lovers.', 79.99, 'Kitchen', 30, 'https://via.placeholder.com/400x400?text=Coffee+Grinder', 4.3),
  ('Compact Bluetooth Speaker', 'Portable speaker with rich bass, 20-hour playtime, and voice assistant support.', 49.99, 'Audio', 95, 'https://via.placeholder.com/400x400?text=Bluetooth+Speaker', 4.5),
  ('Designer Sunglasses', 'UV-protected polarized sunglasses with a matte finish frame.', 109.99, 'Accessories', 52, 'https://via.placeholder.com/400x400?text=Sunglasses', 4.2),
  ('Premium Yoga Mat', 'Non-slip yoga mat with extra cushioning and travel strap.', 39.99, 'Fitness', 140, 'https://via.placeholder.com/400x400?text=Yoga+Mat', 4.7),
  ('Smart Home Security Camera', 'Indoor camera with 1080p video, motion detection, and mobile alerts.', 89.99, 'Smart Home', 43, 'https://via.placeholder.com/400x400?text=Security+Camera', 4.6),
  ('Organic Cotton T-Shirt', 'Soft crew neck t-shirt made from certified organic cotton.', 24.99, 'Apparel', 180, 'https://via.placeholder.com/400x400?text=Cotton+T-Shirt', 4.1),
  ('Performance Cycling Shorts', 'Breathable cycling shorts with padded comfort and compression fit.', 54.99, 'Apparel', 53, 'https://via.placeholder.com/400x400?text=Cycling+Shorts', 4.4),
  ('Minimalist Wallet', 'Slim leather wallet with RFID protection and multiple card slots.', 34.99, 'Accessories', 87, 'https://via.placeholder.com/400x400?text=Wallet', 4.5),
  ('Stainless Steel Water Bottle', 'Vacuum insulated bottle keeps drinks cold or hot for 24 hours.', 29.99, 'Outdoor', 160, 'https://via.placeholder.com/400x400?text=Water+Bottle', 4.8),
  ('Premium Gaming Mouse', 'Ergonomic optical mouse with adjustable DPI and RGB lighting.', 69.99, 'Electronics', 58, 'https://via.placeholder.com/400x400?text=Gaming+Mouse', 4.6),
  ('Home Office Ergonomic Chair', 'Comfortable desk chair with lumbar support and mesh back.', 249.99, 'Furniture', 28, 'https://via.placeholder.com/400x400?text=Office+Chair', 4.4),
  ('Travel Backpack Organizer', 'Multi-compartment organizer for travel essentials and electronics.', 44.99, 'Travel', 130, 'https://via.placeholder.com/400x400?text=Organizer', 4.3),
  ('Portable Projector', 'Mini projector with HDMI and wireless casting support for home cinema.', 179.99, 'Electronics', 34, 'https://via.placeholder.com/400x400?text=Projector', 4.2),
  ('Luxury Scented Candle Set', 'Set of three soy wax candles with premium fragrance oils.', 39.99, 'Home', 95, 'https://via.placeholder.com/400x400?text=Candle+Set', 4.7),
  ('Adjustable Laptop Stand', 'Aluminum laptop stand with cooling airflow and foldable design.', 49.99, 'Office', 72, 'https://via.placeholder.com/400x400?text=Laptop+Stand', 4.6);
