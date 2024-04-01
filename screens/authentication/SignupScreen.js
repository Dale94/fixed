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
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
// import { department_name } from "./QRcodeScanner";
import { API_URL } from "../../config";

export default function SignupScreen() {
	const navigation = useNavigation();
	const route = useRoute();
	const scannedData = route.params?.scannedData;
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [rePassword, setRePassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showRePassword, setShowRePassword] = useState(false);
	const [errorFirstname, seterrorFirstname] = useState("");
	const [errorlastname, seterrorlastname] = useState("");
	const [errorEmail, seterrorEmail] = useState("");
	const [errorPassword, seterrorPassword] = useState("");
	const [errorRePassword, seterrorRePassword] = useState("");
	const [errorfield_error, seterrorfield_error] = useState("");
	const [errorDepartment, seterrorDepartment] = useState("");

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const toggleShowRePassword = () => {
		setShowRePassword(!showRePassword);
	};

	const handleSignup = async () => {
		const userData = {
			first_name: firstName,
			last_name: lastName,
			email: email,
			department: scannedData,
			password: password,
			re_password: rePassword,
		};

		const response = await fetch(`${API_URL}/auth/users/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(userData),
		});

		if (response.ok) {
			const responseData = await response.json();
			const token = responseData.access;
			// await AsyncStorage.setItem("accessToken", token);
			navigation.navigate("Login");
		} else {
			const errorData = await response.json();
			seterrorFirstname(errorData.first_name);
			seterrorlastname(errorData.last_name);
			seterrorEmail(errorData.email);
			seterrorPassword(errorData.password);
			seterrorRePassword(errorData.re_password);
			seterrorfield_error(errorData.non_field_errors);
			seterrorDepartment(errorData.department);
		}
	};

	return (
		<View style={styles.container}>
			<StatusBar style="light" />

			<Image
				style={styles.logo}
				source={require("../../assets/images/images.png")}
			/>
			<Text style={[styles.logoText, styles.headerText]}>
				Municipality of San Remigio
			</Text>
			<Text style={[styles.loginText, styles.headerText]}>Signup</Text>

			<ScrollView style={styles.errorScrollView}>
				{errorFirstname ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>
							First Name: {errorFirstname}
						</Text>
					</View>
				) : null}
				{errorlastname ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>Last Name: {errorlastname}</Text>
					</View>
				) : null}
				{errorEmail ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>Email: {errorEmail}</Text>
					</View>
				) : null}
				{errorDepartment ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>
							Department: {errorDepartment}
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
							Confirm Password: {errorRePassword}
						</Text>
					</View>
				) : null}
				{errorfield_error ? (
					<View style={styles.errorContainer}>
						<Text style={styles.errorMessage}>Fields: {errorfield_error}</Text>
					</View>
				) : null}
			</ScrollView>

			<View style={styles.formContainer}>
				<View style={styles.inputContainer}>
					<TextInput placeholder="First Name" onChangeText={setFirstName} />
				</View>

				<View style={styles.inputContainer}>
					<TextInput placeholder="Last Name" onChangeText={setLastName} />
				</View>

				<View style={styles.inputContainer}>
					<TextInput placeholder="Email" onChangeText={setEmail} />
				</View>

				<View style={styles.iconContainerRO}>
					<TextInput
						style={styles.input}
						placeholder="Department"
						value={scannedData}
						editable={false}
					/>
					<TouchableOpacity onPress={() => navigation.push("QRcode")}>
						<Ionicons name="qr-code" size={24} color="black" />
					</TouchableOpacity>
				</View>

				<View style={styles.iconContainer}>
					<TextInput
						style={styles.input}
						placeholder="Password"
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

				<TouchableOpacity style={styles.buttonContainer} onPress={handleSignup}>
					<Text style={styles.buttonText}>Signup</Text>
				</TouchableOpacity>

				<View style={styles.loginContainer}>
					<Text>Already have an account? </Text>
					<TouchableOpacity onPress={() => navigation.push("Login")}>
						<Text style={styles.loginText}>Login</Text>
					</TouchableOpacity>
				</View>
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
		paddingBottom: 25,
	},
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
	},
	pickerContainer: {
		backgroundColor: "rgba(255, 255, 255, 1)",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
		height: 43,
	},
	optionContainer: {
		top: "-65%",
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
	iconContainerRO: {
		backgroundColor: "rgba(184, 182, 182, 1)",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
		flexDirection: "row", // Add flexDirection: 'row'
		alignItems: "center", // Align items vertically in the center
		justifyContent: "space-between",
	},
	errorContainer: {
		backgroundColor: "rgba(255, 0, 0, 0.5)", // Red color with some transparency
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
		maxHeight: "50%", // Set maximum height for ScrollView
		marginBottom: 2, // Add some bottom margin
	},
});
