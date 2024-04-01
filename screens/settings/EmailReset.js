import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StatusBar,
	TextInput,
	TouchableOpacity,
	Image,
	StyleSheet,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";
import axios from "axios";

export default function EmailReset({ navigation }) {
	const [userInfo, setUserInfo] = useState(null);
	const [New_email, SetNew_email] = useState("");
	const [currentpassword, setCurrentPassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [errorCurrentPassword, seterrorCurrentPassword] = useState("");
	const [errorEmail, seterrorEmail] = useState("");

	const toggleShowCurrentPassword = () => {
		setShowCurrentPassword(!showCurrentPassword);
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userInfoUrl = `${API_URL}/auth/users/me/`;
				const token = await AsyncStorage.getItem("accessToken");

				if (token) {
					const headers = { Authorization: `JWT ${token}` };
					const userResponse = await axios.get(userInfoUrl, { headers });

					if (userResponse.status === 200) {
						setUserInfo(userResponse.data);
					} else {
						console.error("Error fetching user data:", userResponse.statusText);
					}
				} else {
					console.error("Access token not found in AsyncStorage");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchUserData();
	}, []);

	const handleResetPassword = async () => {
		const userData = {
			new_email: New_email,
			current_password: currentpassword,
		};

		const token = await AsyncStorage.getItem("accessToken");

		try {
			const response = await fetch(`${API_URL}/auth/users/set_email/`, {
				method: "POST",
				headers: {
					Authorization: `JWT ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				alert(`You have change your email`);
				navigation.navigate("setting");
			} else {
				const errorData = await response.json();

				seterrorEmail(errorData.new_email);
				seterrorCurrentPassword(errorData.current_password);
			}
		} catch (error) {
			console.error("Wrong password and email:", error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("setting")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>
			<StatusBar style="light" />

			<Image
				style={styles.logo}
				source={require("../../assets/images/images.png")}
			/>
			<Text style={[styles.logoText, styles.headerText]}>
				Municipality of San Remigio
			</Text>
			<Text style={[styles.loginText, styles.headerText]}>RESET EMAIL</Text>

			<View style={styles.errorScrollView}>
				{errorEmail ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>Email: {errorEmail}</Text>
					</View>
				) : null}

				{errorCurrentPassword ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>
							current Password: {errorCurrentPassword}
						</Text>
					</View>
				) : null}
			</View>

			<View style={styles.formContainer}>
				<View style={styles.iconContainer}>
					<TextInput
						style={styles.input}
						placeholder="New Email"
						onChangeText={SetNew_email}
					/>
				</View>

				<View style={styles.iconContainer}>
					<TextInput
						style={styles.input}
						placeholder="Current Password"
						secureTextEntry={!showCurrentPassword} // Toggle secureTextEntry based on showPassword state
						value={currentpassword}
						onChangeText={setCurrentPassword}
					/>
					<TouchableOpacity
						style={styles.toggleButton}
						onPress={toggleShowCurrentPassword}
					>
						<Ionicons
							name={showCurrentPassword ? "eye-off" : "eye"}
							size={24}
							color="black"
						/>
					</TouchableOpacity>
				</View>

				<TouchableOpacity
					onPress={handleResetPassword}
					style={styles.buttonContainer}
				>
					<Text style={styles.buttonText}>Reset Email</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
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
	backButton: {
		position: "absolute",
		top: 20,
		left: 20,
		zIndex: 1,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		borderRadius: 5,
		paddingHorizontal: 10,
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
		backgroundColor: "rgba(255, 0, 0, 0.5)",
		padding: 10,
		borderRadius: 10,
		marginBottom: 10,
	},
	errorMessage: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		textAlign: "center",
	},
	errorScrollView: {
		maxHeight: "50%",
		marginBottom: 2,
	},
});
