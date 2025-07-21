import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function MapView({ routeData, tripData }) {
	const defaultCenter = [39.8283, -98.5795]; // Center of USA
	const defaultZoom = 4;

	if (!routeData && !tripData) {
		return (
			<Paper
				elevation={3}
				sx={{ p: 3, height: 400 }}>
				<Typography
					variant="h6"
					gutterBottom>
					Route Map
				</Typography>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						height: 300,
						color: "text.secondary",
					}}>
					<Typography>
						No route data available. Create a trip to see the map.
					</Typography>
				</Box>
			</Paper>
		);
	}

	// This is a placeholder for future map integration
	// In a real implementation, you would:
	// 1. Use a mapping service API (Google Maps, Mapbox, etc.)
	// 2. Geocode the locations to get coordinates
	// 3. Draw the route with waypoints
	// 4. Show rest stops and fuel stops

	return (
		<Paper
			elevation={3}
			sx={{ p: 3, height: 400 }}>
			<Typography
				variant="h6"
				gutterBottom>
				Route Map
			</Typography>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: 300,
					color: "text.secondary",
					border: "2px dashed #ccc",
					borderRadius: 1,
				}}>
				<Typography align="center">
					Map integration ready for implementation
					<br />
					<small>
						Would show route from {tripData?.pickup_location} to{" "}
						{tripData?.dropoff_location}
					</small>
				</Typography>
			</Box>
		</Paper>
	);
}

export default MapView;
