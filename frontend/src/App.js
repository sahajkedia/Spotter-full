import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	ThemeProvider,
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Container,
	Box,
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import theme from "./theme";
import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import TripDetail from "./components/TripDetail";
import Navigation from "./components/Navigation";

// Add Inter font
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
	"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
document.head.appendChild(link);

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
					{/* Header */}
					<AppBar
						position="static"
						elevation={0}>
						<Container maxWidth="xl">
							<Toolbar sx={{ px: { xs: 0 } }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										gap: 2,
										flex: 1,
									}}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 40,
											height: 40,
											borderRadius: "10px",
											backgroundColor: "primary.main",
											color: "white",
										}}>
										<LocalShipping sx={{ fontSize: 24 }} />
									</Box>
									<Typography
										variant="h6"
										sx={{
											fontWeight: 700,
											color: "text.primary",
											display: { xs: "none", sm: "block" },
										}}>
										Trucking ELD
									</Typography>
								</Box>
							</Toolbar>
						</Container>
					</AppBar>

					{/* Navigation */}
					<Navigation />

					{/* Main Content */}
					<Container
						maxWidth="xl"
						sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
						<Routes>
							<Route
								path="/"
								element={<TripForm />}
							/>
							<Route
								path="/trips"
								element={<TripList />}
							/>
							<Route
								path="/trips/:id"
								element={<TripDetail />}
							/>
						</Routes>
					</Container>
				</Box>
			</Router>
		</ThemeProvider>
	);
}

export default App;
