import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	Stepper,
	Step,
	StepLabel,
	StepContent,
	Divider,
	useMediaQuery,
	useTheme,
	Fade,
	Zoom,
	CircularProgress,
	Alert,
	Grid,
} from "@mui/material";
import {
	LocalShipping,
	Route,
	LocationOn,
	AccessTime,
	CheckCircle,
	ArrowForward,
	PlayArrow,
} from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../config";

function TripForm() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [activeStep, setActiveStep] = useState(0);
	const [formData, setFormData] = useState({
		current_location: "",
		pickup_location: "",
		dropoff_location: "",
		current_cycle_hours: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [routePreview, setRoutePreview] = useState(null);

	const steps = [
		{
			label: "Current Location",
			description: "Where are you starting from?",
			icon: <LocationOn />,
			field: "current_location",
			placeholder: "e.g., Los Angeles, CA",
		},
		{
			label: "Pickup Location",
			description: "Where will you pick up the load?",
			icon: <LocalShipping />,
			field: "pickup_location",
			placeholder: "e.g., San Francisco, CA",
			required: true,
		},
		{
			label: "Dropoff Location",
			description: "Where will you deliver the load?",
			icon: <Route />,
			field: "dropoff_location",
			placeholder: "e.g., Seattle, WA",
			required: true,
		},
		{
			label: "Hours of Service",
			description: "Current cycle hours used",
			icon: <AccessTime />,
			field: "current_cycle_hours",
			placeholder: "0",
			type: "number",
		},
	];

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError("");
	};

	const handleNext = () => {
		if (activeStep === steps.length - 1) {
			handleCreateTrip();
		} else {
			setActiveStep((prevActiveStep) => prevActiveStep + 1);
		}
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleCalculateRoute = async () => {
		if (!formData.pickup_location || !formData.dropoff_location) {
			setError("Please fill in pickup and dropoff locations");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const response = await axios.get(`${API_BASE_URL}/api/calculate-route/`, {
				params: formData,
			});
			// The API returns route data directly
			setRoutePreview(response.data);
		} catch (err) {
			if (err.response?.data) {
				// Handle validation errors from Django
				const errors = err.response.data;
				if (typeof errors === "object") {
					const errorMessages = Object.entries(errors)
						.map(
							([field, messages]) =>
								`${field}: ${
									Array.isArray(messages) ? messages.join(", ") : messages
								}`
						)
						.join("; ");
					setError(errorMessages);
				} else {
					setError(errors);
				}
			} else {
				setError("Failed to calculate route. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleCreateTrip = async () => {
		if (!formData.pickup_location || !formData.dropoff_location) {
			setError("Please fill in pickup and dropoff locations");
			return;
		}

		setLoading(true);
		setError("");

		try {
			// Prepare data with proper types
			const requestData = {
				...formData,
				current_cycle_hours: formData.current_cycle_hours
					? parseFloat(formData.current_cycle_hours)
					: 0.0,
			};

			console.log("Sending data:", requestData); // Debug log
			console.log("API URL:", `${API_BASE_URL}/api/trips/create/`); // Debug log

			const response = await axios.post(
				`${API_BASE_URL}/api/trips/create/`,
				requestData,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			// The API returns a nested structure with trip data
			const tripId = response.data.trip?.id || response.data.id;
			if (tripId) {
				navigate(`/trips/${tripId}`);
			} else {
				setError("Failed to get trip ID from response");
			}
		} catch (err) {
			if (err.response?.data) {
				// Handle validation errors from Django
				const errors = err.response.data;
				if (typeof errors === "object") {
					const errorMessages = Object.entries(errors)
						.map(
							([field, messages]) =>
								`${field}: ${
									Array.isArray(messages) ? messages.join(", ") : messages
								}`
						)
						.join("; ");
					setError(errorMessages);
				} else {
					setError(errors);
				}
			} else {
				setError("Failed to create trip. Please try again.");
			}
		} finally {
			setLoading(false);
		}
	};

	const getStepContent = (step) => {
		const stepData = steps[step];
		return (
			<TextField
				fullWidth
				name={stepData.field}
				label={stepData.label}
				value={formData[stepData.field]}
				onChange={handleInputChange}
				placeholder={stepData.placeholder}
				variant="outlined"
				size="large"
				type={stepData.type || "text"}
				required={stepData.required}
				inputProps={
					stepData.type === "number" ? { min: 0, max: 70, step: 0.5 } : {}
				}
				helperText={
					stepData.type === "number"
						? "Enter hours used in your current 70-hour cycle (0-70)"
						: ""
				}
				sx={{ mb: 2 }}
			/>
		);
	};

	const isFormValid = () => {
		return (
			formData.pickup_location &&
			formData.pickup_location.trim() !== "" &&
			formData.dropoff_location &&
			formData.dropoff_location.trim() !== ""
		);
	};

	const isStepValid = (stepIndex) => {
		const stepData = steps[stepIndex];
		if (stepData.required) {
			const value = formData[stepData.field];
			if (stepData.type === "number") {
				return value !== "" && !isNaN(Number(value)) && Number(value) >= 0;
			}
			return value && value.trim() !== "";
		}
		return true; // Optional fields are always valid
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto" }}>
			{/* Header */}
			<Box sx={{ mb: 4, textAlign: "center" }}>
				<Typography
					variant="h1"
					sx={{
						fontWeight: 700,
						color: "text.primary",
						mb: 2,
						fontSize: { xs: "2rem", md: "2.5rem" },
					}}>
					Plan Your Journey
				</Typography>
				<Typography
					variant="body1"
					sx={{
						color: "text.secondary",
						fontSize: "1.125rem",
						maxWidth: 600,
						mx: "auto",
					}}>
					Create efficient routes with automatic ELD compliance, rest stop
					planning, and detailed log generation
				</Typography>
			</Box>

			<Grid
				container
				spacing={4}>
				{/* Step-by-Step Form */}
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
								<PlayArrow color="primary" />
								Trip Details
							</Typography>

							{isMobile ? (
								// Mobile: Simple form
								<Box>
									{steps.map((step, index) => (
										<Box
											key={index}
											sx={{ mb: 3 }}>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 600,
													mb: 1,
													color:
														index === activeStep
															? "primary.main"
															: "text.secondary",
												}}>
												{step.label}
											</Typography>
											<Typography
												variant="body2"
												sx={{ mb: 2, color: "text.secondary" }}>
												{step.description}
											</Typography>
											{getStepContent(index)}
										</Box>
									))}
								</Box>
							) : (
								// Desktop: Stepper
								<Stepper
									activeStep={activeStep}
									orientation="vertical">
									{steps.map((step, index) => (
										<Step key={step.label}>
											<StepLabel
												StepIconComponent={() => (
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															width: 32,
															height: 32,
															borderRadius: "50%",
															backgroundColor:
																index <= activeStep
																	? "primary.main"
																	: "grey.200",
															color:
																index <= activeStep
																	? "white"
																	: "text.secondary",
														}}>
														{index < activeStep ? (
															<CheckCircle sx={{ fontSize: 20 }} />
														) : index === activeStep && isStepValid(index) ? (
															<CheckCircle
																sx={{ fontSize: 20, color: "success.main" }}
															/>
														) : (
															step.icon
														)}
													</Box>
												)}>
												<Typography
													variant="h6"
													sx={{ fontWeight: 600 }}>
													{step.label}
												</Typography>
											</StepLabel>
											<StepContent>
												<Typography sx={{ mb: 2, color: "text.secondary" }}>
													{step.description}
												</Typography>
												{getStepContent(index)}
												<Box sx={{ mb: 2, mt: 2 }}>
													<Button
														variant="contained"
														onClick={handleNext}
														sx={{ mr: 1 }}
														disabled={
															index === steps.length - 1
																? !isFormValid()
																: !isStepValid(index)
														}>
														{index === steps.length - 1 ? "Finish" : "Continue"}
													</Button>
													<Button
														disabled={index === 0}
														onClick={handleBack}>
														Back
													</Button>
												</Box>
											</StepContent>
										</Step>
									))}
								</Stepper>
							)}

							{/* Error Display */}
							{error && (
								<Fade in={!!error}>
									<Alert
										severity="error"
										sx={{ mt: 3 }}>
										{error}
									</Alert>
								</Fade>
							)}

							{/* Action Buttons */}
							<Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
								<Button
									variant="outlined"
									onClick={handleCalculateRoute}
									disabled={loading || !isFormValid()}
									startIcon={<Route />}
									sx={{ flex: { xs: "1 1 100%", sm: "1 1 auto" } }}>
									{loading ? <CircularProgress size={20} /> : "Preview Route"}
								</Button>
								<Button
									variant="contained"
									onClick={handleCreateTrip}
									disabled={loading || !isFormValid()}
									startIcon={<ArrowForward />}
									sx={{ flex: { xs: "1 1 100%", sm: "1 1 auto" } }}>
									{loading ? (
										<CircularProgress size={20} />
									) : (
										"Create Trip & Generate Logs"
									)}
								</Button>
							</Box>
						</CardContent>
					</Card>
				</Grid>

				{/* Route Preview */}
				<Grid
					item
					xs={12}
					lg={6}>
					{routePreview ? (
						<Zoom in={!!routePreview}>
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
										Route Preview
									</Typography>

									<Grid
										container
										spacing={3}>
										<Grid
											item
											xs={6}>
											<Box
												sx={{
													p: 3,
													borderRadius: 2,
													backgroundColor: "primary.50",
													textAlign: "center",
												}}>
												<Typography
													variant="h4"
													sx={{ fontWeight: 700, color: "primary.main" }}>
													{Number(routePreview.total_distance).toFixed(0)}
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
											<Box
												sx={{
													p: 3,
													borderRadius: 2,
													backgroundColor: "secondary.50",
													textAlign: "center",
												}}>
												<Typography
													variant="h4"
													sx={{ fontWeight: 700, color: "secondary.main" }}>
													{Number(routePreview.estimated_driving_hours).toFixed(
														1
													)}
												</Typography>
												<Typography
													variant="body2"
													sx={{ color: "text.secondary", fontWeight: 500 }}>
													hours
												</Typography>
											</Box>
										</Grid>
									</Grid>

									<Divider sx={{ my: 3 }} />

									<Typography
										variant="h6"
										sx={{ fontWeight: 600, mb: 2 }}>
										Route Summary
									</Typography>

									<Box
										sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}>
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}>
												Total Distance
											</Typography>
											<Typography
												variant="body1"
												sx={{ fontWeight: 600 }}>
												{Number(routePreview.total_distance).toFixed(1)} miles
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}>
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}>
												Estimated Driving Time
											</Typography>
											<Typography
												variant="body1"
												sx={{ fontWeight: 600 }}>
												{Number(routePreview.estimated_driving_hours).toFixed(
													1
												)}{" "}
												hours
											</Typography>
										</Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
											}}>
											<Typography
												variant="body2"
												sx={{ color: "text.secondary" }}>
												Rest Stops Required
											</Typography>
											<Typography
												variant="body1"
												sx={{ fontWeight: 600 }}>
												{routePreview.rest_stops || 0} stops
											</Typography>
										</Box>
									</Box>

									<Box sx={{ mt: 3 }}>
										<Typography
											variant="body2"
											sx={{ color: "success.main", fontWeight: 500 }}>
											✓ Route calculated successfully
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: "text.secondary", mt: 1 }}>
											Ready to create trip and generate ELD logs
										</Typography>
									</Box>
								</CardContent>
							</Card>
						</Zoom>
					) : (
						<Card sx={{ height: "fit-content" }}>
							<CardContent
								sx={{
									p: 4,
									textAlign: "center",
									minHeight: 300,
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								}}>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: 80,
										height: 80,
										borderRadius: "50%",
										backgroundColor: "grey.100",
										color: "text.secondary",
										mb: 3,
									}}>
									<Route sx={{ fontSize: 40 }} />
								</Box>
								<Typography
									variant="h6"
									sx={{ fontWeight: 600, mb: 2 }}>
									Route Preview
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "text.secondary", maxWidth: 300 }}>
									Fill in your trip details and click "Preview Route" to see
									your optimized journey with rest stops and ELD compliance
								</Typography>
							</CardContent>
						</Card>
					)}
				</Grid>
			</Grid>
		</Box>
	);
}

export default TripForm;
