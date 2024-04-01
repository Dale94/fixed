import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { useNavigation } from "@react-navigation/native";

const UserDetails = () => {
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

	const renderUserInfo = () => {
		if (userData && listDepartment) {
			let departmentName = "";
			for (let i = 0; i < listDepartment.length; i++) {
				if (listDepartment[i].id === userData.department) {
					departmentName = listDepartment[i].name;
					break;
				}
			}

			const userInfo = `${userData.first_name} ${userData.last_name}`;

			return (
				<View style={styles.container}>
					<View style={styles.userdetails}>
						<Text style={styles.userInfo}>{userInfo}</Text>
						<Text style={styles.userDepartment}>{departmentName}</Text>
					</View>
					<Image
						source={require("../../assets/images/images.png")} // Replace with your image path
						style={styles.imageBackground}
					/>
				</View>
			);
		}
		return null;
	};

	return renderUserInfo();
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
	},
	userdetails: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginRight: 5,
		flexDirection: "column",
		alignItems: "flex-end",
	},
	userDepartment: {
		color: "white",
		fontSize: 13,
		fontWeight: "bold",
		marginTop: 5,
	},
	userInfo: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 5,
	},
	imageBackground: {
		marginTop: 3,
		width: 50,
		height: 50,
	},
});

export default UserDetails;
