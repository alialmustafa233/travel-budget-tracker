const { getDb, saveDb } = require("../db/database");

function validateTrip(data) {
  const errors = [];
  if (!data.name || data.name.trim() === "") errors.push("Name is required");
  if (!data.destination || data.destination.trim() === "") errors.push("Destination is required");
  if (!data.country || data.country.trim() === "") errors.push("Country is required");
  if (!data.start_date) errors.push("Start date is required");
  if (!data.end_date) errors.push("End date is required");
  if (data.start_date && data.end_date && data.start_date > data.end_date)
    errors.push("Start date must be before end date");
  if (!data.budget || isNaN(data.budget) || Number(data.budget) <= 0)
    errors.push("Budget must be a positive number");
  return errors;
}

async function getAllTrips() {
  const db = await getDb();
  const result = db.exec("SELECT * FROM trips ORDER BY created_at DESC");
  if (!result.length) return [];
  const [{ columns, values }] = result;
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

async function getTripById(id) {
  const db = await getDb();
  const result = db.exec(`SELECT * FROM trips WHERE id = ${Number(id)}`);
  if (!result.length) return null;
  const [{ columns, values }] = result;
  if (!values.length) return null;
  return Object.fromEntries(columns.map((col, i) => [col, values[0][i]]));
}

async function createTrip(data) {
  const errors = validateTrip(data);
  if (errors.length) return { success: false, errors };

  const db = await getDb();
  db.run(
    `INSERT INTO trips (name, destination, country, start_date, end_date, budget, currency)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name.trim(),
      data.destination.trim(),
      data.country.trim(),
      data.start_date,
      data.end_date,
      Number(data.budget),
      data.currency || "USD",
    ]
  );
  saveDb();

  const result = db.exec("SELECT last_insert_rowid() as id");
  const id = result[0].values[0][0];
  const trip = await getTripById(id);
  return { success: true, data: trip };
}

async function updateTrip(id, data) {
  const existing = await getTripById(id);
  if (!existing) return { success: false, errors: ["Trip not found"] };

  const errors = validateTrip(data);
  if (errors.length) return { success: false, errors };

  const db = await getDb();
  db.run(
    `UPDATE trips SET name=?, destination=?, country=?, start_date=?, end_date=?, budget=?, currency=?
     WHERE id=?`,
    [
      data.name.trim(),
      data.destination.trim(),
      data.country.trim(),
      data.start_date,
      data.end_date,
      Number(data.budget),
      data.currency || "USD",
      Number(id),
    ]
  );
  saveDb();

  const trip = await getTripById(id);
  return { success: true, data: trip };
}

async function deleteTrip(id) {
  const existing = await getTripById(id);
  if (!existing) return { success: false, errors: ["Trip not found"] };

  const db = await getDb();
  db.run(`DELETE FROM expenses WHERE trip_id = ?`, [Number(id)]);
  db.run(`DELETE FROM trips WHERE id = ?`, [Number(id)]);
  saveDb();
  return { success: true };
}

async function searchTrips(query) {
  const db = await getDb();
  const q = `%${query}%`;
  const result = db.exec(
    `SELECT * FROM trips WHERE name LIKE '${q}' OR destination LIKE '${q}' OR country LIKE '${q}' ORDER BY created_at DESC`
  );
  if (!result.length) return [];
  const [{ columns, values }] = result;
  return values.map((row) =>
    Object.fromEntries(columns.map((col, i) => [col, row[i]]))
  );
}

module.exports = { getAllTrips, getTripById, createTrip, updateTrip, deleteTrip, searchTrips, validateTrip };
