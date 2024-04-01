import React, { useState } from "react";
import {
	View,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";

export default function DeleteAccountScreen({ navigation }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleDeleteAccount = async () => {
		const userData = {
			email: email,
			password: password,
		};

		try {
			const response = await fetch(`${API_URL}/auth/jwt/create/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				const responseData = await response.json();
				const token = responseData.access;
				await AsyncStorage.setItem("accessToken", token);
				navigation.navigate("Home");
			} else {
				const errorData = await response.json();
				setErrorMessage(errorData.detail);
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("setting")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>
			{/* <StatusBar style="light" /> */}
			<Image
				style={styles.logo}
				source={require("../../assets/images/images.png")}
			/>
			<Text style={[styles.logoText, styles.headerText]}>
				Municipality of San Remigio
			</Text>
			<Text style={[styles.loginText, styles.headerText]}>Delete Account</Text>

			{/* Display error message */}
			{errorMessage ? (
				<View style={styles.errorContainer}>
					<Text style={styles.errorMessage}>{errorMessage}</Text>
				</View>
			) : null}

			<View style={styles.formContainer}>
				<View style={styles.iconContainer}>
					<TextInput
						style={styles.input}
						placeholder="Password"
						secureTextEntry={!showPassword}
						value={password}
						onChangeText={setPassword}
					/>
					<TouchableOpacity
						style={styles.toggleButton}
						onPress={toggleShowPassword}
					>
						<Ionicons
							name={showPassword ? "eye-off" : "eye"}
							size={24}
							color="black"
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={handleDeleteAccount}
					style={styles.buttonContainer}
				>
					<Text style={styles.buttonText}>Delete</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2b6fcf",
		height: "100%",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},
	logo: {
		width: 200,
		height: 100,
		resizeMode: "contain",
		marginBottom: 20,
	},
	formContainer: {
		backgroundColor: "rgba(255, 255, 255, .3)",
		padding: 20,
		borderRadius: 10,
		width: "80%",
		marginTop: 10,
	},
	inputContainer: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
	},
	buttonContainer: {
		backgroundColor: "#00BFFF",
		padding: 15,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
	},
	buttonText: {
		fontSize: 18,
		color: "white",
		textAlign: "center",
	},
	loginContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	loginText: {
		color: "#ffff",
	},
	logoText: {
		color: "yellow",
		paddingBottom: 50,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
	},
	forgotView: {
		flexDirection: "row",
		justifyContent: "center",
	},

	forgotText: {
		color: "#ffff",
		padding: "3%",
		paddingBottom: "5%",
	},
	iconContainer: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
		flexDirection: "row", // Add flexDirection: 'row'
		alignItems: "center", // Align items vertically in the center
		justifyContent: "space-between", // Distribute items evenly along the row
	},
	input: {
		flex: 1, // Take up remaining space
		marginRight: 10, // Add some space between TextInput and TouchableOpacity
	},
	errorContainer: {
		backgroundColor: "#FF6347", // Red color
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
		width: "100%",
	},
	errorMessage: {
		color: "white",
		fontSize: 16,
		textAlign: "center",
	},
	backButton: {
		position: "absolute",
		top: 20,
		left: 20,
		zIndex: 1,
	},
});
