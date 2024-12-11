import * as SQLite from 'expo-sqlite';

(async () => {
  try {
    // Datenbank öffnen oder erstellen
    const db = await SQLite.openDatabaseAsync('databasePickMe');

    // Fremdschlüssel aktivieren
    await db.execAsync(`PRAGMA foreign_keys = ON;`);

    // Tabellen erstellen
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS User (
        user_id INTEGER PRIMARY KEY NOT NULL,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Cart (
        cart_id INTEGER PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL,
        total_price REAL NOT NULL,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );

      CREATE TABLE IF NOT EXISTS CartItem (
        cart_item_id INTEGER PRIMARY KEY NOT NULL,
        cart_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Cart(cart_id),
        FOREIGN KEY (product_id) REFERENCES Product(product_id)
      );

      CREATE TABLE IF NOT EXISTS "Order" (
        order_id INTEGER PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        location TEXT,
        FOREIGN KEY (user_id) REFERENCES User(user_id)
      );

      CREATE TABLE IF NOT EXISTS Payment (
        payment_id INTEGER PRIMARY KEY NOT NULL,
        order_id INTEGER NOT NULL,
        payment_date TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        payment_status TEXT NOT NULL,
        FOREIGN KEY (order_id) REFERENCES "Order"(order_id)
      );

      CREATE TABLE IF NOT EXISTS OrderDetail (
        detail_id INTEGER PRIMARY KEY NOT NULL,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (order_id) REFERENCES "Order"(order_id),
        FOREIGN KEY (product_id) REFERENCES Product(product_id)
      );

      CREATE TABLE IF NOT EXISTS Product (
        product_id INTEGER PRIMARY KEY NOT NULL,
        category_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        evaluation INTEGER,
        FOREIGN KEY (category_id) REFERENCES Category(category_id)
      );

      CREATE TABLE IF NOT EXISTS Category (
        category_id INTEGER PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        description TEXT NOT NULL
      );
    `);

    console.log('Tabellen erfolgreich erstellt.');

    // Daten einfügen
    await db.execAsync(`
      -- Insert into Category
      INSERT OR IGNORE INTO Category (category_id, name, description) VALUES
      (1, 'Electronics', 'Devices and gadgets'),
      (2, 'Clothing', 'Apparel and fashion'),
      (3, 'Books', 'Printed or digital books');

      -- Insert into Product
      INSERT OR IGNORE INTO Product (product_id, category_id, name, description, price, evaluation) VALUES
      (1, 1, 'Smartphone', 'Latest model smartphone with amazing features', 599.99, 4),
      (2, 1, 'Laptop', 'High performance laptop for gaming and work', 999.99, 5),
      (3, 2, 'T-shirt', 'Cotton t-shirt with cool designs', 19.99, 3),
      (4, 3, 'The Great Gatsby', 'Classic novel by F. Scott Fitzgerald', 10.99, 5);

      -- Insert into User
      INSERT OR IGNORE INTO User (user_id, username, email, password) VALUES
      (1, 'john_doe', 'john.doe@example.com', 'securepassword123'),
      (2, 'jane_smith', 'jane.smith@example.com', 'anotherpassword456');

      -- Insert into Cart
      INSERT OR IGNORE INTO Cart (cart_id, user_id, total_price) VALUES
      (1, 1, 639.98),
      (2, 2, 1020.98);

      -- Insert into CartItem
      INSERT OR IGNORE INTO CartItem (cart_item_id, cart_id, product_id, quantity) VALUES
      (1, 1, 1, 1),
      (2, 1, 3, 1),
      (3, 2, 2, 1),
      (4, 2, 4, 1);

      -- Insert into Order
      INSERT OR IGNORE INTO "Order" (order_id, user_id, date, location) VALUES
      (1, 1, '2024-12-11', '123 Main St, Cityville'),
      (2, 2, '2024-12-10', '456 Elm St, Townsville');

      -- Insert into Payment
      INSERT OR IGNORE INTO Payment (payment_id, order_id, payment_date, payment_method, payment_status) VALUES
      (1, 1, '2024-12-11', 'Credit Card', 'Completed'),
      (2, 2, '2024-12-10', 'PayPal', 'Pending');

      -- Insert into OrderDetail
      INSERT OR IGNORE INTO OrderDetail (detail_id, order_id, product_id, quantity) VALUES
      (1, 1, 1, 1),
      (2, 1, 3, 1),
      (3, 2, 2, 1),
      (4, 2, 4, 1);
    `);

    console.log('Daten erfolgreich eingefügt.');

    // Beispielabfrage: Kategorien abrufen
    const allRows = await db.getAllAsync('SELECT * FROM Category');
    for (const row of allRows) {
      console.log(row.category_id, row.name, row.description);
    }
  } catch (error) {
    console.error('Fehler bei der Datenbankoperation:', error);
  }
})();
