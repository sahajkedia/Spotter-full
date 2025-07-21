import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Box,
	Container,
	Tabs,
	Tab,
	useMediaQuery,
	useTheme,
	Paper,
	Typography,
} from "@mui/material";
import { Add as AddIcon, History as HistoryIcon } from "@mui/icons-material";

function Navigation() {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	// Mobile detection for responsive design
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const handleTabChange = (event, newValue) => {
		if (newValue === 0) {
			navigate("/");
		} else if (newValue === 1) {
			navigate("/trips");
		}
	};

	const getCurrentTab = () => {
		if (location.pathname === "/") return 0;
		if (location.pathname.startsWith("/trips")) return 1;
		return 0;
	};

	return (
		<Box
			sx={{
				backgroundColor: "background.paper",
				borderBottom: "1px solid",
				borderColor: "grey.200",
				position: "sticky",
				top: 0,
				zIndex: 1000,
			}}>
			<Container maxWidth="xl">
				{isMobile ? (
					// Mobile: Card-based navigation
					<Box sx={{ py: 2 }}>
						<Typography
							variant="body2"
							sx={{
								color: "text.secondary",
								fontWeight: 600,
								mb: 2,
								textAlign: "center",
							}}>
							Navigation
						</Typography>
						<Box
							sx={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 2,
							}}>
							<Paper
								elevation={getCurrentTab() === 0 ? 4 : 1}
								sx={{
									p: 2,
									textAlign: "center",
									cursor: "pointer",
									transition: "all 0.2s ease-in-out",
									backgroundColor:
										getCurrentTab() === 0 ? "primary.main" : "background.paper",
									color: getCurrentTab() === 0 ? "white" : "text.primary",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
									},
								}}
								onClick={() => navigate("/")}>
								<AddIcon sx={{ fontSize: 28, mb: 1 }} />
								<Typography
									variant="body2"
									sx={{
										fontWeight: 600,
										fontSize: "0.875rem",
									}}>
									New Trip
								</Typography>
							</Paper>
							<Paper
								elevation={getCurrentTab() === 1 ? 4 : 1}
								sx={{
									p: 2,
									textAlign: "center",
									cursor: "pointer",
									transition: "all 0.2s ease-in-out",
									backgroundColor:
										getCurrentTab() === 1 ? "primary.main" : "background.paper",
									color: getCurrentTab() === 1 ? "white" : "text.primary",
									"&:hover": {
										transform: "translateY(-2px)",
										boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
									},
								}}
								onClick={() => navigate("/trips")}>
								<HistoryIcon sx={{ fontSize: 28, mb: 1 }} />
								<Typography
									variant="body2"
									sx={{
										fontWeight: 600,
										fontSize: "0.875rem",
									}}>
									Trip History
								</Typography>
							</Paper>
						</Box>
					</Box>
				) : (
					// Desktop: Traditional tabs
					<Box sx={{ borderBottom: 1, borderColor: "grey.200" }}>
						<Tabs
							value={getCurrentTab()}
							onChange={handleTabChange}
							sx={{
								"& .MuiTab-root": {
									minHeight: 64,
									fontSize: "1rem",
									fontWeight: 600,
									textTransform: "none",
									"&.Mui-selected": {
										color: "primary.main",
									},
								},
								"& .MuiTabs-indicator": {
									height: 3,
									borderRadius: "3px 3px 0 0",
								},
							}}>
							<Tab
								label="Create New Trip"
								icon={<AddIcon />}
								iconPosition="start"
								sx={{ mr: 4 }}
							/>
							<Tab
								label="Trip History"
								icon={<HistoryIcon />}
								iconPosition="start"
							/>
						</Tabs>
					</Box>
				)}
			</Container>
		</Box>
	);
}

export default Navigation;
