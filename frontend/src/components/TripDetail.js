import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Card,
	CardContent,
	Grid,
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	CircularProgress,
	Alert,
	Divider,
	Avatar,
	IconButton,
	useMediaQuery,
	useTheme,
	Fade,
	Zoom,
	LinearProgress,
} from "@mui/material";
import {
	LocalShipping,
	Route,
	AccessTime,
	LocationOn,
	Description,
	ExpandMore,
	ArrowBack,
	Download,
	Timeline,
	Speed,
	DirectionsCar,
	CheckCircle,
	Warning,
	Info,
} from "@mui/icons-material";
import axios from "axios";

function TripDetail() {
	const { id } = useParams();
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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

	const handleDownloadPDF = async (logSheetId, date) => {
		try {
			const response = await axios.get(`/api/log-sheets/${logSheetId}/pdf/`, {
				responseType: "blob",
			});

			// Create a blob URL and trigger download
			const blob = new Blob([response.data], { type: "application/pdf" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `eld_log_sheet_${date}.pdf`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error("Error downloading PDF:", error);
			alert("Failed to download PDF. Please try again.");
		}
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
					Loading trip details...
				</Typography>
			</Box>
		);
	}

	if (error || !trip) {
		return (
			<Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
				<Alert
					severity="error"
					sx={{ fontSize: "1rem" }}>
					{error || "Trip not found"}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ maxWidth: 1400, mx: "auto" }}>
			{/* Header */}
			<Box sx={{ mb: 4 }}>
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate("/trips")}
					sx={{ mb: 2 }}>
					Back to Trips
				</Button>
				<Typography
					variant="h1"
					sx={{
						fontWeight: 700,
						color: "text.primary",
						mb: 2,
						fontSize: { xs: "2rem", md: "2.5rem" },
					}}>
					Trip Details
				</Typography>
				<Typography
					variant="body1"
					sx={{
						color: "text.secondary",
						fontSize: "1.125rem",
					}}>
					Complete route information and ELD compliance logs
				</Typography>
			</Box>

			{/* Trip Overview Card */}
			<Card sx={{ mb: 4 }}>
				<CardContent sx={{ p: 4 }}>
					<Typography
						variant="h5"
						sx={{
							fontWeight: 600,
							mb: 3,
							display: "flex",
							alignItems: "center",
							gap: 1,
						}}>
						<LocalShipping color="primary" />
						Trip Overview
					</Typography>

					<Grid
						container
						spacing={4}>
						{/* Basic Info */}
						<Grid
							item
							xs={12}
							md={6}>
							<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
								<Box sx={{ display: "flex", alignItems: "center" }}>
									<LocationOn
										sx={{ fontSize: 20, color: "text.secondary", mr: 2 }}
									/>
									<Box>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", fontWeight: 500 }}>
											From
										</Typography>
										<Typography
											variant="body1"
											sx={{ fontWeight: 600 }}>
											{trip.pickup_location}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: "flex", alignItems: "center" }}>
									<LocationOn
										sx={{ fontSize: 20, color: "text.secondary", mr: 2 }}
									/>
									<Box>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", fontWeight: 500 }}>
											To
										</Typography>
										<Typography
											variant="body1"
											sx={{ fontWeight: 600 }}>
											{trip.dropoff_location}
										</Typography>
									</Box>
								</Box>
							</Box>
						</Grid>

						{/* Stats */}
						<Grid
							item
							xs={12}
							md={6}>
							<Grid
								container
								spacing={2}>
								<Grid
									item
									xs={6}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											variant="h4"
											sx={{ fontWeight: 700, color: "primary.main" }}>
											{trip.total_distance
												? Number(trip.total_distance).toFixed(0)
												: "Calculating..."}
										</Typography>
										<Typography
											variant="body2"
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
											variant="h4"
											sx={{ fontWeight: 700, color: "secondary.main" }}>
											{trip.estimated_duration
												? Number(trip.estimated_duration).toFixed(1)
												: "Calculating..."}
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", fontWeight: 500 }}>
											hours
										</Typography>
									</Box>
								</Grid>
								<Grid
									item
									xs={6}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											variant="h6"
											sx={{ fontWeight: 700, color: "warning.main" }}>
											{trip.routes?.length || 0}
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", fontWeight: 500 }}>
											waypoints
										</Typography>
									</Box>
								</Grid>
								<Grid
									item
									xs={6}>
									<Box sx={{ textAlign: "center" }}>
										<Typography
											variant="h6"
											sx={{ fontWeight: 700, color: "info.main" }}>
											{trip.log_sheets?.length || 0}
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", fontWeight: 500 }}>
											log sheets
										</Typography>
									</Box>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Main Content - Side by Side on Desktop */}
			<Grid
				container
				spacing={4}>
				{/* Route Details */}
				<Grid
					item
					xs={12}
					lg={6}>
					<Card sx={{ height: "fit-content" }}>
						<CardContent sx={{ p: 4 }}>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 600,
									mb: 3,
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}>
								<Route color="primary" />
								Route Details
							</Typography>

							{trip.routes && trip.routes.length > 0 ? (
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell sx={{ fontWeight: 600 }}>#</TableCell>
												<TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
												<TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
												<TableCell sx={{ fontWeight: 600 }}>Distance</TableCell>
												<TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{trip.routes.map((route) => (
												<TableRow key={route.id}>
													<TableCell>
														<Box
															sx={{
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
																width: 32,
																height: 32,
																borderRadius: "50%",
																backgroundColor: "primary.50",
																color: "primary.main",
																fontWeight: 600,
															}}>
															{route.sequence}
														</Box>
													</TableCell>
													<TableCell>
														<Typography
															variant="body1"
															sx={{ fontWeight: 500 }}>
															{route.location}
														</Typography>
													</TableCell>
													<TableCell>
														<Chip
															label={route.location_type}
															color={getLocationTypeColor(route.location_type)}
															size="small"
															sx={{ fontWeight: 600 }}
														/>
													</TableCell>
													<TableCell>
														{route.distance_from_previous ? (
															<Typography
																variant="body2"
																sx={{ fontWeight: 500 }}>
																{Number(route.distance_from_previous).toFixed(
																	1
																)}{" "}
																miles
															</Typography>
														) : (
															<Typography
																variant="body2"
																sx={{ color: "text.secondary" }}>
																-
															</Typography>
														)}
													</TableCell>
													<TableCell>
														<Typography
															variant="body2"
															sx={{ fontWeight: 500 }}>
															{route.duration_hours} hours
														</Typography>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							) : (
								<Box sx={{ textAlign: "center", py: 4 }}>
									<Typography
										variant="body1"
										sx={{ color: "text.secondary" }}>
										No route details available
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>

				{/* ELD Log Sheets */}
				<Grid
					item
					xs={12}
					lg={6}>
					<Card sx={{ height: "fit-content" }}>
						<CardContent sx={{ p: 4 }}>
							<Typography
								variant="h5"
								sx={{
									fontWeight: 600,
									mb: 3,
									display: "flex",
									alignItems: "center",
									gap: 1,
								}}>
								<Description color="primary" />
								ELD Log Sheets
							</Typography>

							{trip.log_sheets && trip.log_sheets.length > 0 ? (
								<Box>
									{trip.log_sheets.map((logSheet, index) => (
										<Accordion
											key={logSheet.id}
											sx={{ mb: 2 }}>
											<AccordionSummary expandIcon={<ExpandMore />}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														gap: 2,
														flex: 1,
													}}>
													<Avatar
														sx={{
															width: 40,
															height: 40,
															backgroundColor: "primary.50",
															color: "primary.main",
														}}>
														<Description />
													</Avatar>
													<Box sx={{ flex: 1 }}>
														<Typography
															variant="h6"
															sx={{ fontWeight: 600 }}>
															Log Sheet - {formatDate(logSheet.date)}
														</Typography>
														<Typography
															variant="body2"
															sx={{ color: "text.secondary" }}>
															{logSheet.driver_name} • {logSheet.vehicle_id}
														</Typography>
													</Box>
													<Chip
														label={`${Number(logSheet.total_distance).toFixed(
															0
														)} miles`}
														color="primary"
														size="small"
													/>
												</Box>
											</AccordionSummary>
											<AccordionDetails>
												<Grid
													container
													spacing={3}
													sx={{ mb: 3 }}>
													<Grid
														item
														xs={6}
														sm={3}>
														<Box sx={{ textAlign: "center" }}>
															<Typography
																variant="h6"
																sx={{ fontWeight: 700, color: "primary.main" }}>
																{logSheet.driving_hours}
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "text.secondary" }}>
																Driving Hours
															</Typography>
														</Box>
													</Grid>
													<Grid
														item
														xs={6}
														sm={3}>
														<Box sx={{ textAlign: "center" }}>
															<Typography
																variant="h6"
																sx={{ fontWeight: 700, color: "warning.main" }}>
																{logSheet.on_duty_hours}
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "text.secondary" }}>
																On Duty Hours
															</Typography>
														</Box>
													</Grid>
													<Grid
														item
														xs={6}
														sm={3}>
														<Box sx={{ textAlign: "center" }}>
															<Typography
																variant="h6"
																sx={{ fontWeight: 700, color: "success.main" }}>
																{logSheet.off_duty_hours}
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "text.secondary" }}>
																Off Duty Hours
															</Typography>
														</Box>
													</Grid>
													<Grid
														item
														xs={6}
														sm={3}>
														<Box sx={{ textAlign: "center" }}>
															<Typography
																variant="h6"
																sx={{ fontWeight: 700, color: "info.main" }}>
																{logSheet.sleeper_hours}
															</Typography>
															<Typography
																variant="body2"
																sx={{ color: "text.secondary" }}>
																Sleeper Hours
															</Typography>
														</Box>
													</Grid>
												</Grid>

												<Divider sx={{ my: 2 }} />

												<Typography
													variant="h6"
													sx={{ fontWeight: 600, mb: 2 }}>
													Daily Entries
												</Typography>

												{logSheet.entries && logSheet.entries.length > 0 ? (
													<TableContainer>
														<Table size="small">
															<TableHead>
																<TableRow>
																	<TableCell sx={{ fontWeight: 600 }}>
																		Time
																	</TableCell>
																	<TableCell sx={{ fontWeight: 600 }}>
																		Status
																	</TableCell>
																	<TableCell sx={{ fontWeight: 600 }}>
																		Location
																	</TableCell>
																	<TableCell sx={{ fontWeight: 600 }}>
																		Remarks
																	</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{logSheet.entries.map((entry) => (
																	<TableRow key={entry.id}>
																		<TableCell>
																			<Typography
																				variant="body2"
																				sx={{ fontWeight: 500 }}>
																				{formatTime(entry.time)}
																			</Typography>
																		</TableCell>
																		<TableCell>
																			<Chip
																				label={entry.status}
																				color={getStatusColor(entry.status)}
																				size="small"
																				sx={{ fontWeight: 600 }}
																			/>
																		</TableCell>
																		<TableCell>
																			<Typography variant="body2">
																				{entry.location}
																			</Typography>
																		</TableCell>
																		<TableCell>
																			<Typography
																				variant="body2"
																				sx={{ color: "text.secondary" }}>
																				{entry.remarks || "-"}
																			</Typography>
																		</TableCell>
																	</TableRow>
																))}
															</TableBody>
														</Table>
													</TableContainer>
												) : (
													<Typography
														variant="body2"
														sx={{
															color: "text.secondary",
															textAlign: "center",
														}}>
														No entries available
													</Typography>
												)}

												<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
													<Button
														variant="outlined"
														startIcon={<Download />}
														onClick={() =>
															handleDownloadPDF(logSheet.id, logSheet.date)
														}>
														Download PDF
													</Button>
												</Box>
											</AccordionDetails>
										</Accordion>
									))}
								</Box>
							) : (
								<Box sx={{ textAlign: "center", py: 4 }}>
									<Typography
										variant="body1"
										sx={{ color: "text.secondary" }}>
										No log sheets available
									</Typography>
								</Box>
							)}
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Box>
	);
}

export default TripDetail;
