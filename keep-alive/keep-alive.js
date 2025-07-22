const axios = require("axios");

// Backend URL
const BACKEND_URL = "https://eld-connect.onrender.com";

// Health check endpoint
const HEALTH_ENDPOINT = `${BACKEND_URL}/health/`;

// API endpoints to ping
const ENDPOINTS = ["/health/", "/api/", "/admin/"];

// Function to make a request
async function pingEndpoint(endpoint) {
	try {
		const response = await axios.get(`${BACKEND_URL}${endpoint}`, {
			timeout: 10000, // 10 second timeout
			headers: {
				"User-Agent": "Keep-Alive-Bot/1.0",
			},
		});
		console.log(`✅ ${endpoint} - Status: ${response.status}`);
		return true;
	} catch (error) {
		if (error.response) {
			console.log(
				`⚠️  ${endpoint} - Status: ${error.response.status} (${error.response.statusText})`
			);
		} else {
			console.log(`❌ ${endpoint} - Error: ${error.message}`);
		}
		return false;
	}
}

// Function to ping all endpoints
async function pingAllEndpoints() {
	console.log(`\n🕐 [${new Date().toLocaleString()}] Pinging backend...`);

	for (const endpoint of ENDPOINTS) {
		await pingEndpoint(endpoint);
		// Small delay between requests
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	console.log("✅ Keep-alive cycle completed\n");
}

// Function to start the keep-alive service
function startKeepAlive() {
	console.log("🚀 Starting keep-alive service...");
	console.log(`🎯 Target: ${BACKEND_URL}`);
	console.log(`⏰ Interval: Every 30 minutes`);
	console.log("Press Ctrl+C to stop\n");

	// Initial ping
	pingAllEndpoints();

	// Set up periodic pinging (every 30 minutes)
	setInterval(pingAllEndpoints, 30 * 60 * 1000);
}

// Handle graceful shutdown
process.on("SIGINT", () => {
	console.log("\n🛑 Keep-alive service stopped");
	process.exit(0);
});

// Start the service
startKeepAlive();
