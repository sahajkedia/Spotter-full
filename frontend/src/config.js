// API Configuration
const API_CONFIG = {
	development: "http://localhost:8000",
	production:
		process.env.REACT_APP_API_URL || "https://eld-connect.onrender.com",
};

export const API_BASE_URL =
	API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;
