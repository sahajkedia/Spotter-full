import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, Tab, Box } from "@mui/material";
import { Add, List } from "@mui/icons-material";

function Navigation() {
	const navigate = useNavigate();
	const location = useLocation();

	const getCurrentTab = () => {
		if (location.pathname === "/") return 0;
		if (location.pathname === "/trips") return 1;
		if (location.pathname.startsWith("/trips/")) return 1;
		return 0;
	};

	const handleTabChange = (event, newValue) => {
		switch (newValue) {
			case 0:
				navigate("/");
				break;
			case 1:
				navigate("/trips");
				break;
			default:
				navigate("/");
		}
	};

	return (
		<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
			<Tabs
				value={getCurrentTab()}
				onChange={handleTabChange}
				aria-label="trucking navigation tabs"
				centered>
				<Tab
					icon={<Add />}
					label="New Trip"
					iconPosition="start"
				/>
				<Tab
					icon={<List />}
					label="Trip History"
					iconPosition="start"
				/>
			</Tabs>
		</Box>
	);
}

export default Navigation;
