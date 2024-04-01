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

export default function PasswordReset({ navigation }) {
	const [userInfo, setUserInfo] = useState(null);
	const [currentpassword, setCurrentPassword] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [showCurrentPassword, setShowCurrentPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showRePassword, setShowRePassword] = useState(false);
	const [errorCurrentPassword, seterrorCurrentPassword] = useState("");
	const [errorPassword, seterrorPassword] = useState("");
	const [errorRePassword, seterrorRePassword] = useState("");
	const [errorfield_error, seterrorfield_error] = useState("");

	const toggleShowCurrentPassword = () => {
		setShowCurrentPassword(!showCurrentPassword);
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowRePassword = () => {
		setShowRePassword(!showRePassword);
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
			current_password: currentpassword,
			new_password: password,
			re_new_password: rePassword,
		};

		const token = await AsyncStorage.getItem("accessToken");

		try {
			const response = await fetch(`${API_URL}/auth/users/set_password/`, {
				method: "POST",
				headers: {
					Authorization: `JWT ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(userData),
			});

			if (response.ok) {
				alert(`Your pass password has been change..`);
				navigation.navigate("setting");
			} else {
				const errorData = await response.json();

				seterrorCurrentPassword(errorData.current_password);
				seterrorPassword(errorData.new_password);
				seterrorRePassword(errorData.re_new_password);
				seterrorfield_error(errorData.non_field_errors);
			}
		} catch (error) {
			console.error("Wrong password:", error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<View style={styles.container}>
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
				<Text style={[styles.loginText, styles.headerText]}>
					RESET PASSWORD
				</Text>

				<View style={styles.errorScrollView}>
					{errorCurrentPassword ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorMessage}>
								current Password: {errorCurrentPassword}
							</Text>
						</View>
					) : null}

					{errorPassword ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorMessage}>Password: {errorPassword}</Text>
						</View>
					) : null}

					{errorRePassword ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorMessage}>
								New Password: {errorRePassword}
							</Text>
						</View>
					) : null}

					{errorfield_error ? (
						<View style={styles.errorContainer}>
							<Text style={styles.errorMessage}>
								Confirm Password: {errorfield_error}
							</Text>
						</View>
					) : null}
				</View>

				<View style={styles.formContainer}>
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

					<View style={styles.iconContainer}>
						<TextInput
							style={styles.input}
							placeholder="New Password"
							secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
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

					<View style={styles.iconContainer}>
						<TextInput
							style={styles.input}
							placeholder="Confirm Password"
							secureTextEntry={!showRePassword} // Toggle secureTextEntry based on showPassword state
							value={rePassword}
							onChangeText={setRePassword}
						/>
						<TouchableOpacity
							style={styles.toggleButton}
							onPress={toggleShowRePassword}
						>
							<Ionicons
								name={showRePassword ? "eye-off" : "eye"}
								size={24}
								color="black"
							/>
						</TouchableOpacity>
					</View>

					<TouchableOpacity
						onPress={handleResetPassword}
						style={styles.buttonContainer}
					>
						<Text style={styles.buttonText}>Reset</Text>
					</TouchableOpacity>
				</View>
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
		flexGrow: 1,
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
		flex: 1, // Take up remaining space
		marginRight: 10, // Add some space between TextInput and TouchableOpacity
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
