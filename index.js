// Run with: node index.js
// Works in Node.js 18+ (built-in fetch)

import fs from "fs";

const API_URL =
  "https://api.data.gov.in/resource/ee03643a-ee4c-48c2-ac30-9f2ff26ab722?api-key=579b464db66ec23bdd0000013c3534436fd642404fa1d84db4da1d56&format=json&limit=8880&filters[fin_year]=2023-2024";

async function fetchData() {
  try {
    console.log("⏳ Fetching data from API...");
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.records || !Array.isArray(data.records)) {
      console.error("❌ No valid records found in API response.");
      return;
    }

    console.log(`✅ Total records fetched: ${data.records.length}`);

    // Extract the required fields
    const rows = data.records.map((record) => ({
      state_code: record.state_code?.trim() || "",
      state_name: record.state_name?.trim() || "",
      district_code: record.district_code?.trim() || "",
      district_name: record.district_name?.trim() || "",
    }));

    // Create CSV header
    const headers = ["state_code", "state_name", "district_code", "district_name"];
    const csvRows = [headers.join(",")];

    // Add all rows
    for (const row of rows) {
      csvRows.push(
        [row.state_code, row.state_name, row.district_code, row.district_name]
          .map((value) => `"${value.replace(/"/g, '""')}"`) // Escape quotes
          .join(",")
      );
    }

    const csvContent = csvRows.join("\n");

    // Save to CSV file
    fs.writeFileSync("state_district_data.csv", csvContent, "utf8");

    console.log("✅ CSV file created successfully: state_district_data.csv");
  } catch (error) {
    console.error("❌ Error fetching or processing data:", error);
  }
}

fetchData();
