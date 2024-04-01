import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ImageBackground,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import userDetails from "../extensions/user_details";

const SettingScreen = ({ navigation }) => {
	const handleSignOut = async () => {
		try {
			// Get the access token from AsyncStorage
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const logoutUrl = `${API_URL}/auth/token/logout/`;
				const headers = { Authorization: `JWT ${token}` };

				// Make a POST request to log the user out
				await axios.post(logoutUrl, null, { headers });

				// Remove access token from AsyncStorage
				await AsyncStorage.removeItem("accessToken");

				// Navigate to the Login screen
				navigation.navigate("Login");
			} else {
				console.error("Access token not found in AsyncStorage");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleEmailReset = () => {
		// Navigate to the Change Password screen
		navigation.push("Email_reset");
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("Home")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>

			<Text style={[styles.ScreenText]}>Settings</Text>
			<View style={styles.userInfo}>{userDetails()}</View>
			<ScrollView>
				<View style={styles.row}>
					<TouchableOpacity
						style={[styles.imagecontainer, { marginRight: 10 }]}
						onPress={() => navigation.push("Password_reset")}
					>
						<View>
							<ImageBackground
								source={require("../../assets/images/password_reset.png")}
								style={styles.imageBackground}
							></ImageBackground>
							<Text style={styles.label}>Change Password</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.imagecontainer, { marginLeft: 10 }]}
						onPress={() => navigation.push("Update_info")}
					>
						<View>
							<ImageBackground
								source={require("../../assets/images/change_userInfo.png")}
								style={styles.imageBackground}
							></ImageBackground>
							<Text style={styles.label}>Change your info</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<TouchableOpacity
						style={[styles.imagecontainer, { marginRight: 10 }]}
						onPress={handleEmailReset}
					>
						<View>
							<ImageBackground
								source={require("../../assets/images/reset_email.png")}
								style={styles.imageBackground}
							></ImageBackground>
							<Text style={styles.label}>Change Email</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={[styles.imagecontainer, { marginLeft: 10 }]}
						onPress={() => navigation.push("User_info")}
					>
						<View>
							<ImageBackground
								source={require("../../assets/images/user_info.png")}
								style={styles.imageBackground}
							></ImageBackground>
							<Text style={styles.label}>Your info</Text>
						</View>
					</TouchableOpacity>
				</View>

				<View style={styles.row}>
					<TouchableOpacity
						style={[styles.imagecontainer, { marginLeft: 10 }]}
						onPress={handleSignOut}
					>
						<View>
							<ImageBackground
								source={require("../../assets/images/sign_out.png")}
								style={styles.imageBackground}
							></ImageBackground>
							<Text style={styles.label}>Sign out</Text>
						</View>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#2b6fcf",
	},
	backButton: {
		position: "absolute",
		top: 20,
		left: 20,
		zIndex: 1,
	},
	ScreenText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
		marginTop: 100,
	},
	userInfo: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		position: "absolute",
		alignSelf: "flex-end",
		top: 20,
		// right: 20,
		zIndex: 1,
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	imageBackground: {
		width: 150,
		height: 150,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		overflow: "hidden",
		elevation: 5,
	},
	label: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginTop: 10,
	},
	imagecontainer: {
		backgroundColor: "#2b6fcf",
		justifyContent: "center",
		alignItems: "center",
		margin: 10,
		borderRadius: 10,
		overflow: "hidden",
		elevation: 5,
	},
});

export default SettingScreen;
