const axios = require("axios");

const API_BASE_URL = "https://eld-connect.onrender.com";

async function testRoot() {
	console.log("🏠 Testing root endpoint...");

	try {
		const response = await axios.get(`${API_BASE_URL}/`);
		console.log("✅ Root check successful!");
		console.log("📊 Status:", response.status);
		console.log("📄 Data:", response.data);
	} catch (error) {
		console.log("❌ Root check failed:");
		console.log("📊 Status:", error.response?.status);
		console.log("📄 Data:", error.response?.data);
	}
}

async function testAdmin() {
	console.log("\n👨‍💼 Testing admin endpoint...");

	try {
		const response = await axios.get(`${API_BASE_URL}/admin/`);
		console.log("✅ Admin check successful!");
		console.log("📊 Status:", response.status);
	} catch (error) {
		console.log("❌ Admin check failed:");
		console.log("📊 Status:", error.response?.status);
	}
}

async function runTests() {
	await testRoot();
	await testAdmin();
}

runTests();
