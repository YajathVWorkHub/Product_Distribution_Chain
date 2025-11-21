
// server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "supplychaindistributiondb",
  multipleStatements: true,
});

db.connect(err => {
  if (err) {
    console.error("MySQL connection failed:", err);
  } else {
    console.log("Connected to MySQL database!");
  }
});

app.get("/", (req, res) => res.send("Backend API is running "));

//   MANUFACTURERS

app.get("/manufacturers", (req, res) => {
  db.query("SELECT * FROM Manufacturer ORDER BY manufacturer_id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post("/manufacturers", (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `INSERT INTO Manufacturer (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, contact_person, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

// UPDATE manufacturer
app.put("/manufacturers/:id", (req, res) => {
  const id = req.params.id;
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `UPDATE Manufacturer
               SET name = ?, contact_person = ?, phone = ?, email = ?, address = ?
               WHERE manufacturer_id = ?`;
  db.query(sql, [name, contact_person, phone, email, address, id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Manufacturer updated" });
  });
});

// DELETE manufacturer
app.delete("/manufacturers/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Manufacturer WHERE manufacturer_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Manufacturer deleted" });
  });
});

//   DISTRIBUTORS

app.get("/distributors", (req, res) => {
  db.query("SELECT * FROM Distributor ORDER BY distributor_id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post("/distributors", (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `INSERT INTO Distributor (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, contact_person, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put("/distributors/:id", (req, res) => {
  const id = req.params.id;
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `UPDATE Distributor
               SET name=?, contact_person=?, phone=?, email=?, address=?
               WHERE distributor_id=?`;
  db.query(sql, [name, contact_person, phone, email, address, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Distributor updated" });
  });
});

app.delete("/distributors/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Distributor WHERE distributor_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Distributor deleted" });
  });
});


//   RETAILERS

app.get("/retailers", (req, res) => {
  db.query("SELECT * FROM Retailer ORDER BY retailer_id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post("/retailers", (req, res) => {
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `INSERT INTO Retailer (name, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, contact_person, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put("/retailers/:id", (req, res) => {
  const id = req.params.id;
  const { name, contact_person, phone, email, address } = req.body;
  const sql = `UPDATE Retailer SET name=?, contact_person=?, phone=?, email=?, address=? WHERE retailer_id=?`;
  db.query(sql, [name, contact_person, phone, email, address, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Retailer updated" });
  });
});

app.delete("/retailers/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Retailer WHERE retailer_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Retailer deleted" });
  });
});


//   CUSTOMERS

app.get("/customers", (req, res) => {
  db.query("SELECT * FROM Customer ORDER BY customer_id DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post("/customers", (req, res) => {
  const { name, phone, email, address } = req.body;
  const sql = `INSERT INTO Customer (name, phone, email, address) VALUES (?, ?, ?, ?)`;
  db.query(sql, [name, phone, email, address], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put("/customers/:id", (req, res) => {
  const id = req.params.id;
  const { name, phone, email, address } = req.body;
  const sql = `UPDATE Customer SET name=?, phone=?, email=?, address=? WHERE customer_id=?`;
  db.query(sql, [name, phone, email, address, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Customer updated" });
  });
});

app.delete("/customers/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Customer WHERE customer_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Customer deleted" });
  });
});


// ---------- ORDERS ----------
app.get("/orders", (req, res) => {
  const sql = "SELECT order_id, order_type, source_id, destination_id, order_date, status FROM `Order` ORDER BY order_id DESC";
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

/**
 * POST /orders
 * body:
 * {
 *   order_type, source_id, destination_id, order_date (optional, yyyy-mm-dd or null),
 *   status (optional), total_amount (optional),
 *   payment_method (optional),
 *   order_items: [ { product_id, quantity, unit_price }, ... ] (optional)
 * }
 *
 * Tries to call stored procedure PlaceNewOrder(...) if available.
 * If procedure call fails (not present), falls back to normal INSERT into Order.
 * After order creation, inserts OrderItem rows if provided.
 */
app.post("/orders", (req, res) => {
  try {
    let {
      order_type,
      source_id,
      destination_id,
      order_date = null,
      status = "Placed",
      total_amount = 0.00,
      payment_method = "Cash",
      order_items = []
    } = req.body;

    if (!order_type || source_id == null || destination_id == null) {
      return res.status(400).json({ error: "order_type, source_id and destination_id are required" });
    }

    // Normalize order_type: accept both arrow chars and convert to '->'
    order_type = String(order_type).replace(/→/g, '->');

    const allowedTypes = [
      "Manufacturer->Distributor",
      "Distributor->Retailer",
      "Retailer->Customer"
    ];
    const allowedStatus = ["Placed", "In Transit", "Delivered", "Cancelled"];

    if (!allowedTypes.includes(order_type)) {
      return res.status(400).json({ error: "Invalid order_type. Allowed: " + allowedTypes.join(", ") });
    }
    if (!allowedStatus.includes(status)) {
      status = "Placed";
    }

    // Prepare parameters for procedure call
    const procParams = [
      order_type,
      Number(source_id),
      Number(destination_id),
      order_date,      // can be null
      status,
      Number(total_amount || 0),
      payment_method
    ];

    // Try calling stored procedure PlaceNewOrder; if it fails, fallback to INSERT
    db.query("CALL PlaceNewOrder(?,?,?,?,?,?,?)", procParams, (procErr, procResults) => {
      if (procErr) {
        // If procedure not found (or other proc error), fallback to plain INSERT
        console.warn("PlaceNewOrder proc call failed, falling back to direct INSERT. Error:", procErr.code || procErr);

        const useCurDate = !order_date;
        const insertSql = `
          INSERT INTO \`Order\` (order_type, source_id, destination_id, order_date, status)
          VALUES (?, ?, ?, ${useCurDate ? "CURDATE()" : "?"}, ?)
        `;
        const insertParams = useCurDate
          ? [order_type, source_id, destination_id, status]
          : [order_type, source_id, destination_id, order_date, status];

        db.query(insertSql, insertParams, (insErr, insResult) => {
          if (insErr) {
            console.error("Fallback INSERT failed:", insErr);
            return res.status(500).json({ error: insErr });
          }
          const newOrderId = insResult.insertId;
          // Insert order items if provided
          insertOrderItemsIfAny(newOrderId, order_items, res);
        });

      } else {
        // proc succeeded — procResults[0] should contain SELECT new_order_id AS order_id
        // MySQL returns nested arrays; guard against different mysql2 behaviors
        let newOrderId = null;
        try {
          if (Array.isArray(procResults) && procResults.length > 0 && Array.isArray(procResults[0]) && procResults[0].length > 0) {
            // results shape: [ [ { order_id: X } ], ... ]
            newOrderId = procResults[0][0].order_id || procResults[0][0].new_order_id || null;
          } else if (Array.isArray(procResults) && procResults[0] && procResults[0].order_id) {
            newOrderId = procResults[0].order_id;
          }
        } catch (ex) {
          console.warn("Could not parse procResults for new order id:", ex);
        }

        if (!newOrderId) {
          // If procedure created order but didn't return id, attempt to fetch last insert id
          // Note: In some mysql2 configs LAST_INSERT_ID may not be accessible via procResults
          // As a fallback, we can query latest order with same attributes (best-effort), but here we will inform caller
          console.warn("Procedure did not return new order id. Returning procedure result.");
          return res.status(201).json({ message: "Procedure executed", procResults });
        }

        // Insert order items if provided
        insertOrderItemsIfAny(newOrderId, order_items, res);
      }
    });

    // helper function - inserts OrderItem rows and sends final response
    function insertOrderItemsIfAny(orderId, items, expressRes) {
      if (!Array.isArray(items) || items.length === 0) {
        return expressRes.status(201).json({ order_id: orderId });
      }

      // sanitize and build values: [[orderId, product_id, quantity, unit_price], ...]
      const vals = items.map(it => [
        Number(orderId),
        Number(it.product_id),
        Number(it.quantity),
        Number(it.unit_price)
      ]);

      const oiSql = "INSERT INTO OrderItem (order_id, product_id, quantity, unit_price) VALUES ?";
      db.query(oiSql, [vals], (oiErr) => {
        if (oiErr) {
          console.error("OrderItem insert failed for order", orderId, oiErr);
          // We still return 201 because order exists; caller gets warning
          return expressRes.status(201).json({
            order_id: orderId,
            warning: "Order created but inserting order items failed",
            orderItemsError: oiErr
          });
        }
        return expressRes.status(201).json({ order_id: orderId });
      });
    }

  } catch (outerErr) {
    console.error("POST /orders unexpected error:", outerErr);
    return res.status(500).json({ error: outerErr });
  }
});

// Update order (partial update) - supports changing status to 'Delivered' (fires trigger)
app.put("/orders/:id", (req, res) => {
  const id = req.params.id;
  const { order_type, source_id, destination_id, order_date, status } = req.body;
  const fields = [];
  const params = [];

  if (order_type !== undefined) {
    // normalize incoming order_type arrows
    fields.push("order_type=?");
    params.push(String(order_type).replace(/→/g, '->'));
  }
  if (source_id !== undefined) { fields.push("source_id=?"); params.push(source_id); }
  if (destination_id !== undefined) { fields.push("destination_id=?"); params.push(destination_id); }
  if (order_date !== undefined) { fields.push("order_date=?"); params.push(order_date); }
  if (status !== undefined) { fields.push("status=?"); params.push(status); }

  if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

  const sql = `UPDATE \`Order\` SET ${fields.join(", ")} WHERE order_id = ?`;
  params.push(id);
  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err });
    // If status changed to Delivered, the DB trigger will run automatically.
    return res.json({ message: "Order updated" });
  });
});

app.delete("/orders/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM `Order` WHERE order_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Order deleted" });
  });
});



// PRODUCTS

app.get("/products", (req, res) => {
  db.query(
    `SELECT p.product_id, p.name, p.category, p.unit_price, m.name AS manufacturer
     FROM Product p JOIN Manufacturer m ON p.manufacturer_id = m.manufacturer_id
     ORDER BY p.product_id DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err });
      res.json(rows);
    }
  );
});

app.post("/products", (req, res) => {
  const { manufacturer_id, name, category, unit_price, description } = req.body;
  const sql = `INSERT INTO Product (manufacturer_id, name, category, unit_price, description)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [manufacturer_id, name, category, unit_price, description], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ id: result.insertId });
  });
});

app.put("/products/:id", (req, res) => {
  const id = req.params.id;
  const { manufacturer_id, name, category, unit_price, description } = req.body;
  const sql = `UPDATE Product SET manufacturer_id=?, name=?, category=?, unit_price=?, description=? WHERE product_id=?`;
  db.query(sql, [manufacturer_id, name, category, unit_price, description, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product updated" });
  });
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM Product WHERE product_id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Product deleted" });
  });
});


//  START
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
