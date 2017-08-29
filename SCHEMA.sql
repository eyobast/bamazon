DROP DATABASE IF EXISTS bamazonDB;
CREATE database bamazonDB;

USE bamazonDB;
DROP TABLE IF EXISTS products;
CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,4),
    stock_quantity INT,
    PRIMARY KEY (item_id)
);

SELECT * FROM products;


