import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container, AppBar, Toolbar, Typography, Box } from "@mui/material";
import { LocalShipping } from "@mui/icons-material";

import TripForm from "./components/TripForm";
import TripList from "./components/TripList";
import TripDetail from "./components/TripDetail";
import Navigation from "./components/Navigation";

const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#dc004e",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Router>
				<Box sx={{ flexGrow: 1 }}>
					<AppBar position="static">
						<Toolbar>
							<LocalShipping sx={{ mr: 2 }} />
							<Typography
								variant="h6"
								component="div"
								sx={{ flexGrow: 1 }}>
								Trucking ELD System
							</Typography>
						</Toolbar>
					</AppBar>

					<Navigation />

					<Container
						maxWidth="lg"
						sx={{ mt: 4, mb: 4 }}>
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
