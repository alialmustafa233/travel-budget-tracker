const { validateTrip } = require("../services/tripService");
const { validateExpense, VALID_CATEGORIES } = require("../services/expenseService");

// ===== TRIP VALIDATION TESTS =====
describe("validateTrip", () => {
  const validTrip = {
    name: "Summer in Paris",
    destination: "Paris",
    country: "France",
    start_date: "2026-07-01",
    end_date: "2026-07-10",
    budget: 2000,
    currency: "USD",
  };

  test("should return no errors for a valid trip", () => {
    expect(validateTrip(validTrip)).toEqual([]);
  });

  test("should return error if name is missing", () => {
    const errors = validateTrip({ ...validTrip, name: "" });
    expect(errors).toContain("Name is required");
  });

  test("should return error if destination is missing", () => {
    const errors = validateTrip({ ...validTrip, destination: "" });
    expect(errors).toContain("Destination is required");
  });

  test("should return error if country is missing", () => {
    const errors = validateTrip({ ...validTrip, country: "" });
    expect(errors).toContain("Country is required");
  });

  test("should return error if start_date is missing", () => {
    const errors = validateTrip({ ...validTrip, start_date: "" });
    expect(errors).toContain("Start date is required");
  });

  test("should return error if end_date is missing", () => {
    const errors = validateTrip({ ...validTrip, end_date: "" });
    expect(errors).toContain("End date is required");
  });

  test("should return error if start_date is after end_date", () => {
    const errors = validateTrip({ ...validTrip, start_date: "2026-07-10", end_date: "2026-07-01" });
    expect(errors).toContain("Start date must be before end date");
  });

  test("should return error if budget is zero", () => {
    const errors = validateTrip({ ...validTrip, budget: 0 });
    expect(errors).toContain("Budget must be a positive number");
  });

  test("should return error if budget is negative", () => {
    const errors = validateTrip({ ...validTrip, budget: -100 });
    expect(errors).toContain("Budget must be a positive number");
  });

  test("should return multiple errors if multiple fields are invalid", () => {
    const errors = validateTrip({ ...validTrip, name: "", budget: -1 });
    expect(errors.length).toBeGreaterThan(1);
  });
});

// ===== EXPENSE VALIDATION TESTS =====
describe("validateExpense", () => {
  const validExpense = {
    trip_id: 1,
    category: "Food",
    description: "Lunch at a cafe",
    amount: 25.5,
    date: "2026-07-03",
  };

  test("should return no errors for a valid expense", () => {
    expect(validateExpense(validExpense)).toEqual([]);
  });

  test("should return error if trip_id is missing", () => {
    const errors = validateExpense({ ...validExpense, trip_id: null });
    expect(errors).toContain("Trip ID is required");
  });

  test("should return error if category is invalid", () => {
    const errors = validateExpense({ ...validExpense, category: "InvalidCat" });
    expect(errors[0]).toContain("Category must be one of");
  });

  test("should accept all valid categories", () => {
    VALID_CATEGORIES.forEach((cat) => {
      const errors = validateExpense({ ...validExpense, category: cat });
      expect(errors).toEqual([]);
    });
  });

  test("should return error if description is empty", () => {
    const errors = validateExpense({ ...validExpense, description: "" });
    expect(errors).toContain("Description is required");
  });

  test("should return error if amount is zero", () => {
    const errors = validateExpense({ ...validExpense, amount: 0 });
    expect(errors).toContain("Amount must be a positive number");
  });

  test("should return error if amount is negative", () => {
    const errors = validateExpense({ ...validExpense, amount: -50 });
    expect(errors).toContain("Amount must be a positive number");
  });

  test("should return error if date is missing", () => {
    const errors = validateExpense({ ...validExpense, date: "" });
    expect(errors).toContain("Date is required");
  });
});
