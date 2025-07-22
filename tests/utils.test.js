// Here I import the formatDate function from the utils file
const { formatDate } = require("../utils");

// This part here is my test for the formatDate function
describe("formatDate", () => {
  test("should convert dd/mm/yyyy to yyyy-mm-dd", () => {
    // Here I check if the function gives the correct output
    expect(formatDate("31/12/2023")).toBe("2023-12-31");
    expect(formatDate("01/01/2024")).toBe("2024-01-01");
    expect(formatDate("15/07/2025")).toBe("2025-07-15");
  });
});
