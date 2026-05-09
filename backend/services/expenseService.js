const { getDb, saveDb } = require("../db/database");

const VALID_CATEGORIES = ["Food", "Hotel", "Transport", "Activities", "Shopping", "Other"];

function validateExpense(data) {
  const errors = [];
  if (!data.trip_id) errors.push("Trip ID is required");
  if (!data.category || !VALID_CATEGORIES.includes(data.category))
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(", ")}`);
  if (!data.description || data.description.trim() === "")
    errors.push("Description is required");
  if (!data.amount || isNaN(data.amount) || Number(data.amount) <= 0)
    errors.push("Amount must be a positive number");
  if (!data.date) errors.push("Date is required");
  return errors;
}

async function getExpensesByTrip(tripId) {
  const db = await getDb();
  const result = db.exec(
    `SELECT * FROM expenses WHERE trip_id = ${Number(tripId)} ORDER BY date DESC`
  );
  if (!result.length) return [];
  const [{ columns, values }] = result;
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

async function getExpenseById(id) {
  const db = await getDb();
  const result = db.exec(`SELECT * FROM expenses WHERE id = ${Number(id)}`);
  if (!result.length) return null;
  const [{ columns, values }] = result;
  if (!values.length) return null;
  return Object.fromEntries(columns.map((col, i) => [col, values[0][i]]));
}

async function createExpense(data) {
  const errors = validateExpense(data);
  if (errors.length) return { success: false, errors };

  const db = await getDb();
  db.run(
    `INSERT INTO expenses (trip_id, category, description, amount, date)
     VALUES (?, ?, ?, ?, ?)`,
    [
      Number(data.trip_id),
      data.category,
      data.description.trim(),
      Number(data.amount),
      data.date,
    ]
  );
  saveDb();

  const result = db.exec("SELECT last_insert_rowid() as id");
  const id = result[0].values[0][0];
  const expense = await getExpenseById(id);
  return { success: true, data: expense };
}

async function updateExpense(id, data) {
  const existing = await getExpenseById(id);
  if (!existing) return { success: false, errors: ["Expense not found"] };

  const errors = validateExpense({ ...data, trip_id: existing.trip_id });
  if (errors.length) return { success: false, errors };

  const db = await getDb();
  db.run(
    `UPDATE expenses SET category=?, description=?, amount=?, date=? WHERE id=?`,
    [data.category, data.description.trim(), Number(data.amount), data.date, Number(id)]
  );
  saveDb();

  const expense = await getExpenseById(id);
  return { success: true, data: expense };
}

async function deleteExpense(id) {
  const existing = await getExpenseById(id);
  if (!existing) return { success: false, errors: ["Expense not found"] };

  const db = await getDb();
  db.run(`DELETE FROM expenses WHERE id = ?`, [Number(id)]);
  saveDb();
  return { success: true };
}

async function getTripSummary(tripId) {
  const expenses = await getExpensesByTrip(tripId);
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const byCategory = {};
  for (const e of expenses) {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
  }
  return { total, byCategory, count: expenses.length };
}

module.exports = {
  getExpensesByTrip, getExpenseById, createExpense,
  updateExpense, deleteExpense, getTripSummary, validateExpense, VALID_CATEGORIES
};
