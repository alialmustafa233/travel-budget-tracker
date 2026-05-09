const express = require("express");
const router = express.Router();
const tripService = require("../services/tripService");

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search trips by name, destination, or country
 *     responses:
 *       200:
 *         description: List of trips
 */
router.get("/", async (req, res) => {
  try {
    const { search } = req.query;
    const trips = search
      ? await tripService.searchTrips(search)
      : await tripService.getAllTrips();
    res.json({ success: true, data: trips });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip found
 *       404:
 *         description: Trip not found
 */
router.get("/:id", async (req, res) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, destination, country, start_date, end_date, budget]
 *             properties:
 *               name: { type: string }
 *               destination: { type: string }
 *               country: { type: string }
 *               start_date: { type: string, format: date }
 *               end_date: { type: string, format: date }
 *               budget: { type: number }
 *               currency: { type: string }
 *     responses:
 *       201:
 *         description: Trip created
 *       400:
 *         description: Validation error
 */
router.post("/", async (req, res) => {
  try {
    const result = await tripService.createTrip(req.body);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   put:
 *     summary: Update a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Trip updated
 *       404:
 *         description: Trip not found
 */
router.put("/:id", async (req, res) => {
  try {
    const result = await tripService.updateTrip(req.params.id, req.body);
    if (!result.success) {
      const status = result.errors.includes("Trip not found") ? 404 : 400;
      return res.status(status).json(result);
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip deleted
 *       404:
 *         description: Trip not found
 */
router.delete("/:id", async (req, res) => {
  try {
    const result = await tripService.deleteTrip(req.params.id);
    if (!result.success) return res.status(404).json(result);
    res.json({ success: true, message: "Trip deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
