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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import axios from "axios";

export default function UpdateInfo() {
	const navigation = useNavigation();
	const route = useRoute();
	const scannedData = route.params?.scannedData;
	const scannedDataName = route.params?.scannedDataName;
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [Department, setDepartment] = useState("");
	const [Department_name, setDepartment_name] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [errorFirstname, seterrorFirstname] = useState("");
	const [errorlastname, seterrorlastname] = useState("");
	const [errorPassword, seterrorPassword] = useState("");
	const [errorfield_error, seterrorfield_error] = useState("");
	const [errorDepartment, seterrorDepartment] = useState("");
	const [id, setId] = useState("");

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userInfoUrl = `${API_URL}/auth/users/me/`;
				const token = await AsyncStorage.getItem("accessToken");

				if (token) {
					const headers = { Authorization: `JWT ${token}` };
					const response = await axios.get(userInfoUrl, { headers });

					if (response.status === 200) {
						const userinfo = response.data;
						setFirstName(userinfo.first_name);
						setLastName(userinfo.last_name);
						setDepartment(userinfo.department);
						setId(userinfo.id);

						if (userinfo.department) {
							const departmentUrl = `${API_URL}/department/list_department/`;
							const departmentResponse = await axios.get(departmentUrl, {
								headers,
							});
							if (departmentResponse.status === 200) {
								const departmentData = departmentResponse.data;

								const userDepartment = departmentData.find(
									(department) => department.id === userinfo.department
								);
								if (userDepartment) {
									setDepartment_name(userDepartment.name);
								}
							} else {
								console.error(
									"Failed to fetch department:",
									departmentResponse.statusText
								);
							}
						}
					} else {
						console.error("Failed to fetch user data:", response.statusText);
					}
				} else {
					console.error("Access token not found in AsyncStorage");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		};

		fetchUserData();
	}, []);

	const handleUpdate = async () => {
		const userData = {
			first_name: firstName,
			last_name: lastName,
			department: scannedData ? scannedData : Department,
			password: password,
		};

		try {
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const response = await fetch(`${API_URL}/update_profile/${id}/`, {
					method: "PUT",
					headers: {
						Authorization: `JWT ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				});

				if (response.ok) {
					navigation.reset({
						index: 0,
						routes: [{ name: "setting" }],
					});
				} else {
					const errorData = await response.json();
					seterrorFirstname(errorData.first_name);
					seterrorlastname(errorData.last_name);
					seterrorPassword(errorData.password);
					seterrorfield_error(errorData.non_field_errors);
					seterrorDepartment(errorData.department);
				}
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<StatusBar style="light" />

			<Image
				style={styles.logo}
				source={require("../../assets/images/images.png")}
			/>
			<Text style={[styles.logoText, styles.headerText]}>
				Municipality of San Remigio
			</Text>
			<Text style={[styles.loginText, styles.headerText]}>UPDATE</Text>

			<View style={styles.errorScrollView}>
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
			</View>

			<View style={styles.formContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder="First Name"
						value={firstName}
						onChangeText={setFirstName}
					/>
				</View>

				<View style={styles.inputContainer}>
					<TextInput
						placeholder="Last Name"
						value={lastName}
						onChangeText={setLastName}
					/>
				</View>

				<View style={styles.iconContainerRO}>
					<TextInput
						style={styles.input}
						placeholder="Department"
						value={scannedDataName ? scannedDataName : Department_name}
						editable={false}
					/>
					<TouchableOpacity onPress={() => navigation.push("QRcodeSetting")}>
						<Ionicons name="qr-code" size={24} color="black" />
					</TouchableOpacity>
				</View>

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

				<TouchableOpacity style={styles.buttonContainer} onPress={handleUpdate}>
					<Text style={styles.buttonText}>Update</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#2b6fcf",
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
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	input: {
		flex: 1,
		marginRight: 10,
	},
	iconContainerRO: {
		backgroundColor: "rgba(184, 182, 182, 1)",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		marginBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
