import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const List_employee = ({ navigation }) => {
	const route = useRoute();

	const [userData, setUserData] = useState(null);
	const [listDepartment, setListDepartment] = useState(null);
	const scannedDepartmentId = route.params?.scannedDepartmentId;

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const userInfoUrl = `${API_URL}/auth/users/`;
				const list_department = `${API_URL}/department/list_department/`;
				const token = await AsyncStorage.getItem("accessToken");

				if (token) {
					const headers = { Authorization: `JWT ${token}` };
					const [userResponse, ListDepartmentResponse] = await Promise.all([
						axios.get(userInfoUrl, { headers }),
						axios.get(list_department, { headers }),
					]);

					if (
						userResponse.status === 200 &&
						ListDepartmentResponse.status === 200
					) {
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

		const intervalId = setInterval(fetchUserData, 3000); // Fetch every 5 seconds

		// Clear interval when the component unmounts
		return () => clearInterval(intervalId);
	}, []);

	const list_voucher = (Department_id, first_name, last_name) => {
		navigation.navigate("List_voucher", {
			scannedDepartmentId: Department_id,
			scannedUserfirstname: first_name,
			scannedUserlastname: last_name,
		});
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("List_department")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>
			<Text style={[styles.ScreenText]}>Employee</Text>
			<ScrollView>
				{userData &&
					userData.map((user, index) => {
						if (user.department === scannedDepartmentId) {
							return (
								<TouchableOpacity
									onPress={() =>
										list_voucher(
											user.department,
											user.first_name,
											user.last_name
										)
									}
									key={index}
								>
									<View style={styles.rectangleContainer}>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												{user.first_name + " " + user.last_name}
											</Text>
										</View>
									</View>
								</TouchableOpacity>
							);
						} else {
							// Render null if the department doesn't match
							return null;
						}
					})}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#2b6fcf",
	},
	pagerview_container: { flex: 1, marginTop: 60 },
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
		marginTop: 20,
		alignSelf: "center",
	},
	userInfo: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		position: "absolute",
		alignSelf: "flex-end",
		top: 20,
		right: 20,
		zIndex: 1,
	},
	page: {
		flex: 1,
	},
	textContainer: {
		flex: 1,
		marginRight: 10,
	},
	showConcern: {
		color: "black",
		fontWeight: "bold",
	},
	rectangleContainer: {
		flexDirection: "row",
		backgroundColor: "#FFFFFF",
		padding: 10,
		borderRadius: 10,
		justifyContent: "space-between",
		alignItems: "center",
		width: "95%",
		height: "auto",
		marginBottom: 20,
		marginLeft: 10,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		position: "absolute",
		bottom: 1,
		left: 0,
		right: 0,
		backgroundColor: "#2b6fcf",
		padding: 10,
	},
	footerItem: {
		paddingHorizontal: 10,
	},
	activeText: {
		color: "#ffffff",
		fontWeight: "bold",
		fontSize: 20,
	},
	inactiveText: {
		color: "#000000",
		fontSize: 20,
	},
	approve_voucher: {
		width: "46%",
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		marginLeft: 10,
		borderRadius: 10,
		top: 90,
	},
	history_voucher: {
		width: "95%",
		padding: 20,
		backgroundColor: "#045894",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		marginLeft: 10,
		borderRadius: 10,
		top: 90,
	},
	approve_text: {
		color: "#ffffff",
	},
	button_row: {
		flexDirection: "row",
	},
	list_color: {
		backgroundColor: "#3e6a8a",
	},
	aprrove_color: {
		backgroundColor: "#60abe0",
	},
});

export default List_employee;
