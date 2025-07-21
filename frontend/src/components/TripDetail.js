import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Paper,
	Typography,
	Box,
	Grid,
	Chip,
	CircularProgress,
	Alert,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import {
	LocalShipping,
	Route,
	ExpandMore,
	ArrowBack,
} from "@mui/icons-material";
import axios from "axios";

function TripDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [trip, setTrip] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const fetchTrip = useCallback(async () => {
		try {
			const response = await axios.get(`/api/trips/${id}/`);
			setTrip(response.data);
		} catch (err) {
			setError("Failed to load trip details");
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchTrip();
	}, [fetchTrip]);

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString();
	};

	const formatTime = (timeString) => {
		return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getLocationTypeColor = (type) => {
		switch (type) {
			case "pickup":
				return "primary";
			case "dropoff":
				return "secondary";
			case "rest":
				return "warning";
			case "fuel":
				return "info";
			default:
				return "default";
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "driving":
				return "primary";
			case "on_duty":
				return "warning";
			case "off_duty":
				return "success";
			case "sleeper":
				return "info";
			default:
				return "default";
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error || !trip) {
		return (
			<Alert
				severity="error"
				sx={{ mt: 2 }}>
				{error || "Trip not found"}
			</Alert>
		);
	}

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate("/trips")}
					sx={{ mr: 2 }}>
					Back to Trips
				</Button>
				<Typography variant="h4">Trip #{trip.id} Details</Typography>
			</Box>

			<Grid
				container
				spacing={3}>
				{/* Trip Information */}
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

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Pickup Location:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.pickup_location}
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Dropoff Location:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.dropoff_location}
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Current Location:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.current_location || "Not specified"}
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Cycle Hours Used:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.current_cycle_hours} / 70 hours
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Created:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{formatDate(trip.created_at)}
							</Typography>
						</Box>
					</Paper>
				</Grid>

				{/* Route Summary */}
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
							Route Summary
						</Typography>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<Route
									sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
								/>
								<strong>Total Distance:</strong>
							</Typography>
							<Typography
								variant="h5"
								color="primary"
								sx={{ ml: 2 }}>
								{trip.total_distance
									? Number(trip.total_distance).toFixed(1)
									: "Calculating..."}{" "}
								miles
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<LocalShipping
									sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }}
								/>
								<strong>Estimated Duration:</strong>
							</Typography>
							<Typography
								variant="h5"
								color="secondary"
								sx={{ ml: 2 }}>
								{trip.estimated_duration
									? Number(trip.estimated_duration).toFixed(1)
									: "Calculating..."}{" "}
								hours
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Route Waypoints:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.routes?.length || 0} stops
							</Typography>
						</Box>

						<Box sx={{ mb: 2 }}>
							<Typography
								variant="body2"
								color="text.secondary">
								<strong>Log Sheets Generated:</strong>
							</Typography>
							<Typography
								variant="body1"
								sx={{ ml: 2 }}>
								{trip.log_sheets?.length || 0} sheets
							</Typography>
						</Box>
					</Paper>
				</Grid>

				{/* Route Details */}
				<Grid
					item
					xs={12}>
					<Paper
						elevation={3}
						sx={{ p: 3 }}>
						<Typography
							variant="h6"
							gutterBottom>
							Route Details
						</Typography>

						{trip.routes && trip.routes.length > 0 ? (
							<TableContainer>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell>Sequence</TableCell>
											<TableCell>Location</TableCell>
											<TableCell>Type</TableCell>
											<TableCell>Distance</TableCell>
											<TableCell>Duration</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{trip.routes.map((route) => (
											<TableRow key={route.id}>
												<TableCell>{route.sequence}</TableCell>
												<TableCell>{route.location}</TableCell>
												<TableCell>
													<Chip
														label={route.location_type}
														color={getLocationTypeColor(route.location_type)}
														size="small"
													/>
												</TableCell>
												<TableCell>
													{route.distance_from_previous
														? Number(route.distance_from_previous).toFixed(1)
														: "-"}{" "}
													miles
												</TableCell>
												<TableCell>{route.duration_hours} hours</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						) : (
							<Typography color="text.secondary">
								No route details available
							</Typography>
						)}
					</Paper>
				</Grid>

				{/* ELD Log Sheets */}
				<Grid
					item
					xs={12}>
					<Paper
						elevation={3}
						sx={{ p: 3 }}>
						<Typography
							variant="h6"
							gutterBottom>
							ELD Log Sheets
						</Typography>

						{trip.log_sheets && trip.log_sheets.length > 0 ? (
							trip.log_sheets.map((logSheet, index) => (
								<Accordion
									key={logSheet.id}
									sx={{ mb: 2 }}>
									<AccordionSummary expandIcon={<ExpandMore />}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												width: "100%",
											}}>
											<Typography
												variant="h6"
												sx={{ flexGrow: 1 }}>
												Log Sheet - {formatDate(logSheet.date)}
											</Typography>
											<Chip
												label={`${logSheet.driving_hours} hrs driving`}
												color="primary"
												size="small"
												sx={{ mr: 1 }}
											/>
											<Chip
												label={`${
													logSheet.total_distance
														? Number(logSheet.total_distance).toFixed(0)
														: 0
												} miles`}
												color="secondary"
												size="small"
											/>
										</Box>
									</AccordionSummary>
									<AccordionDetails>
										<Grid
											container
											spacing={2}>
											<Grid
												item
												xs={12}
												md={6}>
												<Typography
													variant="subtitle2"
													gutterBottom>
													Hours of Service
												</Typography>
												<Typography variant="body2">
													Driving: {logSheet.driving_hours} hours
												</Typography>
												<Typography variant="body2">
													On Duty: {logSheet.on_duty_hours} hours
												</Typography>
												<Typography variant="body2">
													Off Duty: {logSheet.off_duty_hours} hours
												</Typography>
												<Typography variant="body2">
													Sleeper: {logSheet.sleeper_hours} hours
												</Typography>
											</Grid>

											<Grid
												item
												xs={12}
												md={6}>
												<Typography
													variant="subtitle2"
													gutterBottom>
													Cycle Information
												</Typography>
												<Typography variant="body2">
													Cycle Hours Used: {logSheet.cycle_hours_used} / 70
												</Typography>
												<Typography variant="body2">
													Cycle Hours Remaining:{" "}
													{logSheet.cycle_hours_remaining}
												</Typography>
												<Typography variant="body2">
													Fuel Stops: {logSheet.fuel_stops}
												</Typography>
												<Typography variant="body2">
													Rest Stops: {logSheet.rest_stops}
												</Typography>
											</Grid>

											{logSheet.entries && logSheet.entries.length > 0 && (
												<Grid
													item
													xs={12}>
													<Typography
														variant="subtitle2"
														gutterBottom>
														Daily Log Entries
													</Typography>
													<TableContainer>
														<Table size="small">
															<TableHead>
																<TableRow>
																	<TableCell>Time</TableCell>
																	<TableCell>Status</TableCell>
																	<TableCell>Location</TableCell>
																	<TableCell>Remarks</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{logSheet.entries.map((entry) => (
																	<TableRow key={entry.id}>
																		<TableCell>
																			{formatTime(entry.time)}
																		</TableCell>
																		<TableCell>
																			<Chip
																				label={entry.status}
																				color={getStatusColor(entry.status)}
																				size="small"
																			/>
																		</TableCell>
																		<TableCell>{entry.location}</TableCell>
																		<TableCell>{entry.remarks}</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</TableContainer>
												</Grid>
											)}
										</Grid>
									</AccordionDetails>
								</Accordion>
							))
						) : (
							<Typography color="text.secondary">
								No log sheets generated yet
							</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default TripDetail;
