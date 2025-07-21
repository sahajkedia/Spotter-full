import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Paper,
	Typography,
	Box,
	Card,
	CardContent,
	CardActions,
	Button,
	Grid,
	Chip,
	CircularProgress,
	Alert,
} from "@mui/material";
import {
	LocalShipping,
	Route,
	AccessTime,
	Visibility,
} from "@mui/icons-material";
import axios from "axios";

function TripList() {
	const navigate = useNavigate();
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchTrips();
	}, []);

	const fetchTrips = async () => {
		try {
			const response = await axios.get("/api/trips/");
			setTrips(response.data);
		} catch (err) {
			setError("Failed to load trips");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	const getStatusColor = (trip) => {
		if (trip.total_distance > 1000) return "error";
		if (trip.total_distance > 500) return "warning";
		return "success";
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert
				severity="error"
				sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Box>
			<Typography
				variant="h4"
				gutterBottom>
				Trip History
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				paragraph>
				View all created trips and their generated ELD logs
			</Typography>

			{trips.length === 0 ? (
				<Paper
					elevation={3}
					sx={{ p: 4, textAlign: "center" }}>
					<Typography
						variant="h6"
						color="text.secondary">
						No trips created yet
					</Typography>
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{ mt: 1 }}>
						Create your first trip to get started
					</Typography>
					<Button
						variant="contained"
						onClick={() => navigate("/")}
						sx={{ mt: 2 }}
						startIcon={<LocalShipping />}>
						Create New Trip
					</Button>
				</Paper>
			) : (
				<Grid
					container
					spacing={3}>
					{trips.map((trip) => (
						<Grid
							item
							xs={12}
							md={6}
							lg={4}
							key={trip.id}>
							<Card elevation={3}>
								<CardContent>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											mb: 2,
										}}>
										<Typography
											variant="h6"
											component="div">
											Trip #{trip.id}
										</Typography>
										<Chip
											label={`${Number(trip.total_distance ?? 0).toFixed(
												0
											)} miles`}
											color={getStatusColor(trip)}
											size="small"
										/>
									</Box>

									<Typography
										variant="body2"
										color="text.secondary"
										gutterBottom>
										<strong>Pickup:</strong> {trip.pickup_location}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										gutterBottom>
										<strong>Dropoff:</strong> {trip.dropoff_location}
									</Typography>

									<Box sx={{ mt: 2 }}>
										<Typography
											variant="body2"
											color="text.secondary">
											<AccessTime
												sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
											/>
											Created: {formatDate(trip.created_at)}
										</Typography>

										{trip.total_distance && (
											<Typography
												variant="body2"
												color="text.secondary">
												<Route
													sx={{
														fontSize: 16,
														mr: 0.5,
														verticalAlign: "middle",
													}}
												/>
												Distance: {Number(trip.total_distance).toFixed(1)} miles
											</Typography>
										)}

										{trip.estimated_duration && (
											<Typography
												variant="body2"
												color="text.secondary">
												<LocalShipping
													sx={{
														fontSize: 16,
														mr: 0.5,
														verticalAlign: "middle",
													}}
												/>
												Duration: {Number(trip.estimated_duration).toFixed(1)}{" "}
												hours
											</Typography>
										)}
									</Box>

									<Box sx={{ mt: 2 }}>
										<Typography
											variant="body2"
											color="text.secondary">
											<strong>Cycle Hours:</strong> {trip.current_cycle_hours} /
											70
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary">
											<strong>Log Sheets:</strong>{" "}
											{trip.log_sheets?.length || 0}
										</Typography>
									</Box>
								</CardContent>

								<CardActions>
									<Button
										size="small"
										onClick={() => navigate(`/trips/${trip.id}`)}
										startIcon={<Visibility />}>
										View Details
									</Button>
								</CardActions>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export default TripList;
