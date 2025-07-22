const axios = require("axios");

const API_BASE_URL = "https://eld-connect.onrender.com";

async function testHealth() {
	console.log("🏥 Testing health endpoint...");

	try {
		const response = await axios.get(`${API_BASE_URL}/health/`);
		console.log("✅ Health check successful!");
		console.log("📊 Status:", response.status);
		console.log("📄 Data:", response.data);
	} catch (error) {
		console.log("❌ Health check failed:");
		console.log("📊 Status:", error.response?.status);
		console.log("📄 Data:", error.response?.data);
	}
}

testHealth();
