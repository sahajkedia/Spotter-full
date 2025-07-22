const axios = require("axios");

const API_BASE_URL = "https://eld-connect.onrender.com";

// Test data similar to what the frontend sends
const testData = {
	current_location: "Los Angeles, CA",
	pickup_location: "San Francisco, CA",
	dropoff_location: "Seattle, WA",
	current_cycle_hours: "5.5", // This is a string, which might be the issue
};

async function testCreateTrip() {
	console.log("🧪 Testing trip creation API...");
	console.log("📤 Sending data:", JSON.stringify(testData, null, 2));

	try {
		const response = await axios.post(
			`${API_BASE_URL}/api/trips/create/`,
			testData,
			{
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			}
		);

		console.log("✅ Success!");
		console.log("📊 Response status:", response.status);
		console.log("📄 Response data:", JSON.stringify(response.data, null, 2));
	} catch (error) {
		console.log("❌ Error occurred:");
		console.log("📊 Status:", error.response?.status);
		console.log(
			"📄 Error data:",
			JSON.stringify(error.response?.data, null, 2)
		);
		console.log("🔍 Error message:", error.message);
	}
}

// Test with numeric current_cycle_hours
async function testWithNumericHours() {
	console.log("\n🧪 Testing with numeric current_cycle_hours...");

	const numericData = {
		...testData,
		current_cycle_hours: 5.5, // Numeric instead of string
	};

	try {
		const response = await axios.post(
			`${API_BASE_URL}/api/trips/create/`,
			numericData,
			{
				headers: {
					"Content-Type": "application/json",
				},
				timeout: 10000,
			}
		);

		console.log("✅ Success with numeric hours!");
		console.log("📊 Response status:", response.status);
	} catch (error) {
		console.log("❌ Still failed with numeric hours:");
		console.log("📊 Status:", error.response?.status);
		console.log(
			"📄 Error data:",
			JSON.stringify(error.response?.data, null, 2)
		);
	}
}

// Run tests
async function runTests() {
	await testCreateTrip();
	await testWithNumericHours();
}

runTests();
