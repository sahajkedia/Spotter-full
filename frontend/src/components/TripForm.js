import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Paper,
	TextField,
	Button,
	Typography,
	Box,
	Grid,
	Alert,
	CircularProgress,
	Card,
	CardContent,
} from "@mui/material";
import { LocalShipping, Route } from "@mui/icons-material";
import axios from "axios";

function TripForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		current_location: "",
		pickup_location: "",
		dropoff_location: "",
		current_cycle_hours: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [routePreview, setRoutePreview] = useState(null);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCalculateRoute = async () => {
		if (!formData.pickup_location || !formData.dropoff_location) {
			setError("Please enter pickup and dropoff locations");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await axios.get("/api/calculate-route/", {
				params: {
					pickup_location: formData.pickup_location,
					dropoff_location: formData.dropoff_location,
					current_cycle_hours: formData.current_cycle_hours || 0,
				},
			});

			setRoutePreview(response.data);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to calculate route");
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTrip = async () => {
		if (!formData.pickup_location || !formData.dropoff_location) {
			setError("Please enter pickup and dropoff locations");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await axios.post("/api/trips/create/", formData);
			navigate(`/trips/${response.data.trip.id}`);
		} catch (err) {
			setError(err.response?.data?.error || "Failed to create trip");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography
				variant="h4"
				gutterBottom>
				Create New Trip
			</Typography>
			<Typography
				variant="body1"
				color="text.secondary"
				paragraph>
				Enter trip details to generate route instructions and ELD logs
			</Typography>

			<Grid
				container
				spacing={3}>
				<Grid
					item
					xs={12}
					md={6}>
					<Paper
						elevation={3}
						sx={{ p: 3 }}>
						<Typography
							variant="h6"
							gutterBottom>
							Trip Information
						</Typography>

						<TextField
							fullWidth
							label="Current Location"
							name="current_location"
							value={formData.current_location}
							onChange={handleInputChange}
							margin="normal"
							placeholder="e.g., New York, NY"
						/>

						<TextField
							fullWidth
							label="Pickup Location"
							name="pickup_location"
							value={formData.pickup_location}
							onChange={handleInputChange}
							margin="normal"
							placeholder="e.g., Los Angeles, CA"
							required
						/>

						<TextField
							fullWidth
							label="Dropoff Location"
							name="dropoff_location"
							value={formData.dropoff_location}
							onChange={handleInputChange}
							margin="normal"
							placeholder="e.g., Chicago, IL"
							required
						/>

						<TextField
							fullWidth
							label="Current Cycle Hours Used"
							name="current_cycle_hours"
							type="number"
							value={formData.current_cycle_hours}
							onChange={handleInputChange}
							margin="normal"
							placeholder="0.00"
							inputProps={{ step: 0.01, min: 0, max: 70 }}
						/>

						<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
							<Button
								variant="outlined"
								onClick={handleCalculateRoute}
								disabled={loading}
								startIcon={<Route />}>
								Calculate Route
							</Button>

							<Button
								variant="contained"
								onClick={handleCreateTrip}
								disabled={loading}
								startIcon={<LocalShipping />}>
								Create Trip & Generate Logs
							</Button>
						</Box>

						{loading && (
							<Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
								<CircularProgress
									size={20}
									sx={{ mr: 1 }}
								/>
								<Typography>Processing...</Typography>
							</Box>
						)}

						{error && (
							<Alert
								severity="error"
								sx={{ mt: 2 }}>
								{error}
							</Alert>
						)}
					</Paper>
				</Grid>

				<Grid
					item
					xs={12}
					md={6}>
					{routePreview && (
						<Paper
							elevation={3}
							sx={{ p: 3 }}>
							<Typography
								variant="h6"
								gutterBottom>
								Route Preview
							</Typography>

							<Card sx={{ mb: 2 }}>
								<CardContent>
									<Typography
										variant="h6"
										color="primary">
										<Route sx={{ mr: 1, verticalAlign: "middle" }} />
										Route Summary
									</Typography>
									<Typography variant="body2">
										Total Distance:{" "}
										{routePreview.total_distance
											? Number(routePreview.total_distance).toFixed(1)
											: "Calculating..."}{" "}
										miles
									</Typography>
									<Typography variant="body2">
										Estimated Driving Time:{" "}
										{routePreview.estimated_driving_hours
											? Number(routePreview.estimated_driving_hours).toFixed(1)
											: "Calculating..."}{" "}
										hours
									</Typography>
									<Typography variant="body2">
										Rest Stops Needed: {routePreview.rest_periods_needed}
									</Typography>
									<Typography variant="body2">
										Fuel Stops Needed: {routePreview.fuel_stops_needed}
									</Typography>
								</CardContent>
							</Card>

							<Typography
								variant="subtitle1"
								gutterBottom>
								Route Waypoints:
							</Typography>

							{routePreview.route_points?.map((point, index) => (
								<Card
									key={index}
									sx={{ mb: 1 }}>
									<CardContent sx={{ py: 1 }}>
										<Typography
											variant="body2"
											fontWeight="bold">
											{point.sequence}. {point.location}
										</Typography>
										<Typography
											variant="caption"
											color="text.secondary">
											Type: {point.location_type} | Duration:{" "}
											{point.duration_hours} hours
										</Typography>
									</CardContent>
								</Card>
							))}
						</Paper>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default TripForm;
