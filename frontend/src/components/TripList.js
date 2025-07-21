import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Typography,
	Box,
	Card,
	CardContent,
	CardActions,
	Button,
	Grid,
	CircularProgress,
	Alert,
	useMediaQuery,
	useTheme,
	Fade,
	Zoom,
	Divider,
	Avatar,
	IconButton,
	Chip,
} from "@mui/material";
import {
	LocalShipping,
	Route,
	AccessTime,
	Visibility,
	History,
	LocationOn,
	CalendarToday,
	Speed,
	TrendingUp,
	DirectionsCar,
} from "@mui/icons-material";
import axios from "axios";

function TripList() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const getStatusColor = (trip) => {
		const distance = Number(trip.total_distance);
		if (distance > 1000) return "error";
		if (distance > 500) return "warning";
		return "success";
	};

	const getStatusText = (trip) => {
		const distance = Number(trip.total_distance);
		if (distance > 1000) return "Long Haul";
		if (distance > 500) return "Medium";
		return "Short";
	};

	if (loading) {
		return (
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					minHeight: 400,
					gap: 2,
				}}>
				<CircularProgress size={60} />
				<Typography
					variant="h6"
					sx={{ color: "text.secondary" }}>
					Loading your trips...
				</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
				<Alert
					severity="error"
					sx={{ fontSize: "1rem" }}>
					{error}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1400, mx: "auto" }}>
			{/* Header */}
			<Box sx={{ mb: 4, textAlign: { xs: "center", md: "left" } }}>
				<Typography
					variant="h1"
					sx={{
						fontWeight: 700,
						color: "text.primary",
						mb: 2,
						fontSize: { xs: "2rem", md: "2.5rem" },
					}}>
					Trip History
				</Typography>
				<Typography
					variant="body1"
					sx={{
						color: "text.secondary",
						fontSize: "1.125rem",
						maxWidth: 600,
					}}>
					View all your created trips, generated ELD logs, and route details
				</Typography>
			</Box>

			{/* Stats Summary */}
			{trips.length > 0 && (
				<Fade in={trips.length > 0}>
					<Grid
						container
						spacing={3}
						sx={{ mb: 4 }}>
						<Grid
							item
							xs={6}
							sm={3}>
							<Card sx={{ textAlign: "center", p: 2 }}>
								<Typography
									variant="h4"
									sx={{ fontWeight: 700, color: "primary.main" }}>
									{trips.length}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", fontWeight: 500 }}>
									Total Trips
								</Typography>
							</Card>
						</Grid>
						<Grid
							item
							xs={6}
							sm={3}>
							<Card sx={{ textAlign: "center", p: 2 }}>
								<Typography
									variant="h4"
									sx={{ fontWeight: 700, color: "secondary.main" }}>
									{trips
										.reduce(
											(sum, trip) => sum + Number(trip.total_distance || 0),
											0
										)
										.toFixed(0)}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", fontWeight: 500 }}>
									Total Miles
								</Typography>
							</Card>
						</Grid>
						<Grid
							item
							xs={6}
							sm={3}>
							<Card sx={{ textAlign: "center", p: 2 }}>
								<Typography
									variant="h4"
									sx={{ fontWeight: 700, color: "success.main" }}>
									{trips.reduce(
										(sum, trip) => sum + (trip.log_sheets?.length || 0),
										0
									)}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", fontWeight: 500 }}>
									Log Sheets
								</Typography>
							</Card>
						</Grid>
						<Grid
							item
							xs={6}
							sm={3}>
							<Card sx={{ textAlign: "center", p: 2 }}>
								<Typography
									variant="h4"
									sx={{ fontWeight: 700, color: "warning.main" }}>
									{
										trips.filter((trip) => Number(trip.total_distance) > 500)
											.length
									}
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", fontWeight: 500 }}>
									Long Hauls
								</Typography>
							</Card>
						</Grid>
					</Grid>
				</Fade>
			)}

			{/* Trip Cards */}
			{trips.length === 0 ? (
				<Zoom in={trips.length === 0}>
					<Card
						sx={{
							textAlign: "center",
							p: 6,
							maxWidth: 500,
							mx: "auto",
							background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
						}}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								width: 100,
								height: 100,
								borderRadius: "50%",
								backgroundColor: "primary.50",
								color: "primary.main",
								mx: "auto",
								mb: 3,
							}}>
							<History sx={{ fontSize: 48 }} />
						</Box>
						<Typography
							variant="h4"
							sx={{
								fontWeight: 700,
								color: "text.primary",
								mb: 2,
							}}>
							No trips yet
						</Typography>
						<Typography
							variant="body1"
							sx={{
								color: "text.secondary",
								mb: 4,
								maxWidth: 300,
								mx: "auto",
							}}>
							Create your first trip to start planning routes and generating ELD
							logs
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={() => navigate("/")}
							startIcon={<LocalShipping />}
							sx={{ px: 4, py: 1.5 }}>
							Create Your First Trip
						</Button>
					</Card>
				</Zoom>
			) : (
				<Grid
					container
					spacing={3}>
					{trips.map((trip, index) => (
						<Grid
							item
							xs={12}
							sm={6}
							lg={4}
							key={trip.id}>
							<Zoom
								in={true}
								style={{ transitionDelay: `${index * 100}ms` }}>
								<Card
									sx={{
										height: "100%",
										display: "flex",
										flexDirection: "column",
										transition: "all 0.2s ease-in-out",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow:
												"0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
										},
									}}>
									<CardContent sx={{ p: 3, flex: 1 }}>
										{/* Header */}
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "flex-start",
												mb: 2,
											}}>
											<Box>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 700,
														color: "text.primary",
														mb: 0.5,
													}}>
													Trip #{trip.id}
												</Typography>
												<Chip
													label={getStatusText(trip)}
													color={getStatusColor(trip)}
													size="small"
													sx={{ fontWeight: 600 }}
												/>
											</Box>
											<Avatar
												sx={{
													width: 48,
													height: 48,
													backgroundColor: "primary.50",
													color: "primary.main",
												}}>
												<LocalShipping />
											</Avatar>
										</Box>

										{/* Route Info */}
										<Box sx={{ mb: 3 }}>
											<Box
												sx={{ display: "flex", alignItems: "center", mb: 1 }}>
												<LocationOn
													sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
												/>
												<Typography
													variant="body2"
													sx={{ color: "text.secondary", fontWeight: 500 }}>
													From: {trip.pickup_location}
												</Typography>
											</Box>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<LocationOn
													sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
												/>
												<Typography
													variant="body2"
													sx={{ color: "text.secondary", fontWeight: 500 }}>
													To: {trip.dropoff_location}
												</Typography>
											</Box>
										</Box>

										<Divider sx={{ my: 2 }} />

										{/* Stats */}
										<Grid
											container
											spacing={2}
											sx={{ mb: 3 }}>
											<Grid
												item
												xs={6}>
												<Box sx={{ textAlign: "center" }}>
													<Typography
														variant="h5"
														sx={{ fontWeight: 700, color: "primary.main" }}>
														{Number(trip.total_distance).toFixed(0)}
													</Typography>
													<Typography
														variant="caption"
														sx={{ color: "text.secondary", fontWeight: 500 }}>
														miles
													</Typography>
												</Box>
											</Grid>
											<Grid
												item
												xs={6}>
												<Box sx={{ textAlign: "center" }}>
													<Typography
														variant="h5"
														sx={{ fontWeight: 700, color: "secondary.main" }}>
														{Number(trip.estimated_duration).toFixed(1)}
													</Typography>
													<Typography
														variant="caption"
														sx={{ color: "text.secondary", fontWeight: 500 }}>
														hours
													</Typography>
												</Box>
											</Grid>
										</Grid>

										{/* Additional Info */}
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: 2,
											}}>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<CalendarToday
													sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
												/>
												<Typography
													variant="body2"
													sx={{ color: "text.secondary" }}>
													{formatDate(trip.created_at)}
												</Typography>
											</Box>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Speed
													sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
												/>
												<Typography
													variant="body2"
													sx={{ color: "text.secondary" }}>
													{trip.current_cycle_hours || 0}/70h
												</Typography>
											</Box>
										</Box>

										{/* Log Sheets */}
										<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
											<AccessTime
												sx={{ fontSize: 16, color: "text.secondary", mr: 1 }}
											/>
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}>
												{trip.log_sheets?.length || 0} log sheets generated
											</Typography>
										</Box>
									</CardContent>

									<CardActions sx={{ p: 3, pt: 0 }}>
										<Button
											fullWidth
											variant="contained"
											onClick={() => navigate(`/trips/${trip.id}`)}
											startIcon={<Visibility />}
											sx={{ py: 1.5 }}>
											View Details
										</Button>
									</CardActions>
								</Card>
							</Zoom>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	);
}

export default TripList;
