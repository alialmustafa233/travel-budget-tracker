const express = require("express");
const router = express.Router();
const expenseService = require("../services/expenseService");

/**
 * @swagger
 * /api/trips/{tripId}/expenses:
 *   get:
 *     summary: Get all expenses for a trip
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of expenses
 */
router.get("/trips/:tripId/expenses", async (req, res) => {
  try {
    const expenses = await expenseService.getExpensesByTrip(req.params.tripId);
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{tripId}/summary:
 *   get:
 *     summary: Get budget summary for a trip
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip summary with total spent and category breakdown
 */
router.get("/trips/:tripId/summary", async (req, res) => {
  try {
    const summary = await expenseService.getTripSummary(req.params.tripId);
    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/expenses:
 *   post:
 *     summary: Create a new expense
 *     tags: [Expenses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [trip_id, category, description, amount, date]
 *             properties:
 *               trip_id: { type: integer }
 *               category: { type: string, enum: [Food, Hotel, Transport, Activities, Shopping, Other] }
 *               description: { type: string }
 *               amount: { type: number }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Expense created
 *       400:
 *         description: Validation error
 */
router.post("/expenses", async (req, res) => {
  try {
    const result = await expenseService.createExpense(req.body);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/expenses/{id}:
 *   put:
 *     summary: Update an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense updated
 *       404:
 *         description: Expense not found
 */
router.put("/expenses/:id", async (req, res) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    if (!result.success) {
      const status = result.errors.includes("Expense not found") ? 404 : 400;
      return res.status(status).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/expenses/{id}:
 *   delete:
 *     summary: Delete an expense
 *     tags: [Expenses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expense deleted
 *       404:
 *         description: Expense not found
 */
router.delete("/expenses/:id", async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    if (!result.success) return res.status(404).json(result);
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
