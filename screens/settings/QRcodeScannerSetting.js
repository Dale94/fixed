import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../config"; // Import API_URL

const SettingQRScanner = () => {
	const navigation = useNavigation();

	const [hasPermission, setHasPermission] = useState(null);
	const [scanned, setScanned] = useState(false);
	const [scannedData, setScannedData] = useState(null);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		(async () => {
			const { status } = await Camera.requestCameraPermissionsAsync();
			setHasPermission(status === "granted");
			setErrorMessage("");
		})();
	}, []);

	const handleBarCodeScanned = async ({ type, data }) => {
		setScanned(true);
		setScannedData(data);

		try {
			const response = await fetch(`${API_URL}/department/list_department/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch department list");
			}

			const departments = await response.json();
			const matchingDepartment = departments.find((dep) => dep.code === data);

			if (matchingDepartment) {
				navigation.navigate("Update_info", {
					scannedData: String(matchingDepartment.id),
					scannedDataName: matchingDepartment.name,
				});
			} else {
				setErrorMessage("Invalid department code");
			}
		} catch (error) {
			console.error("Error handling barcode:", error);
			setErrorMessage("Failed to handle barcode");
		}
	};

	return (
		<View style={styles.container}>
			{errorMessage ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				</View>
			) : null}
			<Camera
				style={styles.camera}
				type={Camera.Constants.Type.back}
				onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
			/>
			{scanned && (
				<TouchableOpacity
					style={styles.button}
					onPress={() => setScanned(false)}
				>
					<Text style={styles.buttonText}>Tap to Scan Again</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "column",
	},
	camera: {
		flex: 1,
	},
	button: {
		position: "absolute",
		bottom: 20,
		left: "30%",
		backgroundColor: "#4a90e2",
		paddingVertical: 15,
		paddingHorizontal: 30,
		borderRadius: 10,
	},
	buttonText: {
		color: "white",
		fontSize: 16,
	},
	errorContainer: {
		backgroundColor: "rgba(255, 0, 0, 0.5)", // Red color
		padding: 10,
		borderRadius: 10,
	},
	errorMessage: {
		color: "white",
		fontSize: 16,
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default SettingQRScanner;
