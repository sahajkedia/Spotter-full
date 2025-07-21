import { createTheme } from "@mui/material/styles";

const theme = createTheme({
	palette: {
		primary: {
			main: "#2563eb",
			light: "#3b82f6",
			dark: "#1d4ed8",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#059669",
			light: "#10b981",
			dark: "#047857",
			contrastText: "#ffffff",
		},
		warning: {
			main: "#f59e0b",
			light: "#fbbf24",
			dark: "#d97706",
		},
		error: {
			main: "#dc2626",
			light: "#ef4444",
			dark: "#b91c1c",
		},
		success: {
			main: "#16a34a",
			light: "#22c55e",
			dark: "#15803d",
		},
		grey: {
			50: "#f8fafc",
			100: "#f1f5f9",
			200: "#e2e8f0",
			300: "#cbd5e1",
			400: "#94a3b8",
			500: "#64748b",
			600: "#475569",
			700: "#334155",
			800: "#1e293b",
			900: "#0f172a",
		},
		background: {
			default: "#f8fafc",
			paper: "#ffffff",
		},
		text: {
			primary: "#1e293b",
			secondary: "#64748b",
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontSize: "2.5rem",
			lineHeight: 1.2,
			fontWeight: 700,
			letterSpacing: "-0.025em",
			"@media (max-width:600px)": {
				fontSize: "2rem",
			},
		},
		h2: {
			fontSize: "2rem",
			lineHeight: 1.25,
			fontWeight: 700,
			letterSpacing: "-0.025em",
			"@media (max-width:600px)": {
				fontSize: "1.75rem",
			},
		},
		h3: {
			fontSize: "1.5rem",
			lineHeight: 1.33,
			fontWeight: 600,
			letterSpacing: "-0.025em",
		},
		h4: {
			fontSize: "1.25rem",
			lineHeight: 1.4,
			fontWeight: 600,
			letterSpacing: "-0.025em",
		},
		h5: {
			fontSize: "1.125rem",
			lineHeight: 1.44,
			fontWeight: 600,
			letterSpacing: "-0.025em",
		},
		h6: {
			fontSize: "1rem",
			lineHeight: 1.5,
			fontWeight: 600,
			letterSpacing: "-0.025em",
		},
		body1: {
			fontSize: "1rem",
			lineHeight: 1.5,
			fontWeight: 400,
		},
		body2: {
			fontSize: "0.875rem",
			lineHeight: 1.43,
			fontWeight: 400,
		},
		button: {
			fontSize: "0.875rem",
			lineHeight: 1.75,
			fontWeight: 600,
			textTransform: "none",
			letterSpacing: "0.025em",
		},
	},
	shape: {
		borderRadius: 12,
	},
	spacing: 8,
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					padding: "12px 24px",
					fontSize: "0.875rem",
					fontWeight: 600,
					textTransform: "none",
					boxShadow: "none",
					"&:hover": {
						boxShadow: "0 4px 12px rgba(37, 99, 235, 0.15)",
					},
				},
				contained: {
					"&:hover": {
						boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
					},
				},
				outlined: {
					borderWidth: "2px",
					"&:hover": {
						borderWidth: "2px",
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow:
						"0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
					border: "1px solid #e2e8f0",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderRadius: 16,
					boxShadow:
						"0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						borderRadius: 8,
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "#3b82f6",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "#2563eb",
							borderWidth: "2px",
						},
					},
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					borderRadius: 6,
					fontWeight: 600,
					fontSize: "0.75rem",
				},
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: "#ffffff",
					color: "#1e293b",
					boxShadow:
						"0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
					borderBottom: "1px solid #e2e8f0",
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				root: {
					"& .MuiTab-root": {
						textTransform: "none",
						fontWeight: 600,
						fontSize: "0.875rem",
						minHeight: 48,
					},
				},
			},
		},
		MuiStepper: {
			styleOverrides: {
				root: {
					"& .MuiStepLabel-root .MuiStepLabel-label": {
						fontWeight: 600,
					},
				},
			},
		},
	},
});

export default theme;
