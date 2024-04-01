import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native"; // Added TouchableOpacity
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const UserInfo = () => {
	const [userData, setUserData] = useState(null);
	const [listDepartment, setListDepartment] = useState(null);
	const navigation = useNavigation();

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userInfoUrl = `${API_URL}/auth/users/me/`;
				const list_department = `${API_URL}/department/list_department/`;
				const token = await AsyncStorage.getItem("accessToken");

				if (token) {
					const headers = { Authorization: `JWT ${token}` };
					const userResponse = await axios.get(userInfoUrl, { headers });
					const ListDepartmentResponse = await axios.get(list_department, {
						headers,
					});

					if (userResponse.status === 200) {
						setUserData(userResponse.data);
						setListDepartment(ListDepartmentResponse.data);
					} else {
						console.error("Error fetching user data:", userResponse.statusText);
					}
				} else {
					navigation.navigate("Login");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchUserData();
	}, []); // Empty dependency array ensures useEffect runs only once when component mounts

	if (userData && listDepartment) {
		const department = listDepartment.find(
			(dept) => dept.id === userData.department
		);
		const departmentName = department ? department.name : "Unknown Department";
		const { email, first_name, last_name } = userData;

		return (
			<View style={styles.container}>
				<TouchableOpacity
					onPress={() => navigation.navigate("setting")}
					style={styles.backButton}
				>
					<Ionicons name="arrow-back" size={24} color="white" />
				</TouchableOpacity>
				<Image
					style={styles.logo}
					source={require("../../assets/images/images.png")}
				/>
				<Text style={[styles.logoText, styles.headerText]}>
					Municipality of San Remigio
				</Text>
				<View style={styles.userInfoContainer}>
					<Text style={styles.userInfo}>Email: {email}</Text>
					<Text style={styles.userInfo}>
						Name: {first_name} {last_name}
					</Text>
					<Text style={styles.userInfo}>Department: {departmentName}</Text>
				</View>
			</View>
		);
	}
	return null;
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2b6fcf",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	logo: {
		width: 200,
		height: 100,
		resizeMode: "contain",
		marginBottom: 20,
	},
	userInfoContainer: {
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		marginTop: 20,
	},
	userInfo: {
		fontSize: 16,
		marginBottom: 10,
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
});

export default UserInfo;
