import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Modal,
	TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";

const List_employee = ({ navigation }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [modalType, setModalType] = useState(null);
	const route = useRoute();

	const [userData, setUserData] = useState(null);
	const [listDepartment, setListDepartment] = useState(null);
	const scannedDepartmentId = route.params?.scannedDepartmentId;
	const scannedUserfirstname = route.params?.scannedUserfirstname;
	const scannedUserlastname = route.params?.scannedUserlastname;
	// const scannedUserdepartment = route.params?.scannedUserdepartment;

	const [voucher_code, Setvoucher_code] = useState("");
	const [details, Setdetails] = useState("");
	const [amount, Setamount] = useState("");
	const [voucher, Setvoucher] = useState("");

	const userfullname = `${scannedUserfirstname} ${scannedUserlastname}`;

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

		console.log(scannedDepartmentId);

		fetchUserData();
		fetchUserVoucher();

		const intervalId = setInterval(fetchUserData, 3000); // Fetch every 5 seconds
		const intervalId2 = setInterval(fetchUserVoucher, 3000); // Fetch every 5 seconds

		// Clear interval when the component unmounts
		return () => {
			clearInterval(intervalId);
			clearInterval(intervalId2);
		};
	}, []);

	const fetchUserVoucher = async () => {
		const Que_details_url = `${API_URL}/budget/`;
		const token = await AsyncStorage.getItem("accessToken");

		try {
			const headers = { Authorization: `JWT ${token}` };
			const QueResponse = await axios.get(Que_details_url, { headers });

			if (QueResponse.status === 200) {
				Setvoucher(QueResponse.data);
			} else {
				console.error("Error fetching voucher:", userResponse.statusText);
			}
		} catch (error) {
			console.error("Error fetching voucher:", error);
		}
	};

	const handle_create = async () => {
		const userData = {
			user_name: scannedUserfirstname + " " + scannedUserlastname,
			voucher_code: voucher_code,
			details: details,
			amount: amount,
		};

		try {
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const response = await fetch(
					`${API_URL}/budget/${scannedDepartmentId}/create_voucher/`,
					{
						method: "POST",
						headers: {
							Authorization: `JWT ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(userData),
					}
				);

				if (response.ok) {
					// fetchData();
					setModalVisible(false);
				}
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	// const handle_Update = async () => {
	// 	try {
	// 		const token = await AsyncStorage.getItem("accessToken");
	// 		const headers = {
	// 			Authorization: `JWT ${token}`,
	// 			"Content-Type": "application/json",
	// 		};
	// 		if (token && userinfo) {
	// 			// Add a condition to check if userinfo is not null
	// 			const response = await axios.put(
	// 				`${API_URL}/que/${selectedItemId}/update_que/`,
	// 				{
	// 					user_name: `${userinfo.first_name} ${userinfo.last_name}`, // Now userinfo is guaranteed to be not null
	// 					office: office,
	// 					problems: problems,
	// 				},
	// 				{ headers }
	// 			);
	// 			console.log("Updated:", response.data);
	// 			console.log("Updated:", selectedItemId);
	// 			setSelectedItemId(null);
	// 			Setoffice("");
	// 			Setproblems("");
	// 			fetchData();
	// 			setModalVisible(false);
	// 		} else {
	// 			console.error("Access token not found or userinfo is null");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error updating data:", error);
	// 	}
	// };

	// // Inside handleDelete function
	// const handle_Delete = async () => {
	// 	try {
	// 		const token = await AsyncStorage.getItem("accessToken");
	// 		const headers = { Authorization: `JWT ${token}` };
	// 		if (token) {
	// 			await axios.delete(`${API_URL}/que/${selectedItemId}/delete_que/`, {
	// 				headers,
	// 			});
	// 			console.log("Deleted:", selectedItemId);
	// 			setModalVisible(false);
	// 			fetchData(); // Fetch updated data
	// 		} else {
	// 			console.error("Access token not found");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error deleting data:", error);
	// 	}
	// };

	// const handleEdit = (id, office, problems) => {
	// 	setSelectedItemId(id);
	// 	Setoffice(office);
	// 	Setproblems(problems);
	// 	setIsEditMode(true);
	// 	setModalType("edit");
	// 	setModalVisible(true);
	// };

	// const handleDelete = (id) => {
	// 	setSelectedItemId(id);
	// 	setModalType("delete");
	// 	setModalVisible(true);
	// };

	const handleCreateVoucher = () => {
		setIsEditMode(false);
		setModalType("add");
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => list_employee(scannedDepartmentId)}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>
			<Text style={[styles.ScreenText]}>List of vouchers</Text>

			<ScrollView>
				{voucher &&
					voucher.reverse().map((voucherItem, index) => {
						if (voucherItem.user_name === userfullname) {
							if (voucherItem.mayor_approval)
								return (
									<View style={styles.rectangleContainerAprrove}>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Voucher code: {voucherItem.voucher_code}
											</Text>
										</View>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Details: {voucherItem.details}
											</Text>
										</View>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Amount: {voucherItem.amount}
											</Text>
										</View>
									</View>
								);

							if (!voucherItem.mayor_approval)
								return (
									<View style={styles.rectangleContainer}>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Voucher code: {voucherItem.voucher_code}
											</Text>
										</View>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Details: {voucherItem.details}
											</Text>
										</View>
										<View style={styles.textContainer}>
											<Text style={styles.showConcern}>
												Amount: {voucherItem.amount}
											</Text>
										</View>
									</View>
								);
						}
					})}
			</ScrollView>

			{scannedDepartmentId === 1 && (
				<TouchableOpacity
					onPress={handleCreateVoucher}
					style={styles.history_voucher}
				>
					<Ionicons name="add" size={24} color="white" />
					<Text style={styles.approve_text}>
						Add voucher for {scannedUserfirstname} {scannedUserlastname}
					</Text>
				</TouchableOpacity>
			)}

			{scannedDepartmentId === 3 && (
				<TouchableOpacity
					onPress={handleCreateVoucher}
					style={styles.history_voucher}
				>
					<Ionicons name="add" size={24} color="white" />
					<Text style={styles.approve_text}>
						Add voucher for {scannedUserfirstname} {scannedUserlastname}
					</Text>
				</TouchableOpacity>
			)}

			{scannedDepartmentId === 5 && (
				<TouchableOpacity
					onPress={handleCreateVoucher}
					style={styles.history_voucher}
				>
					<Ionicons name="add" size={24} color="white" />
					<Text style={styles.approve_text}>
						Add voucher for {scannedUserfirstname} {scannedUserlastname}
					</Text>
				</TouchableOpacity>
			)}

			{scannedDepartmentId === 4 && (
				<TouchableOpacity
					onPress={handleCreateVoucher}
					style={styles.history_voucher}
				>
					<Ionicons name="add" size={24} color="white" />
					<Text style={styles.approve_text}>
						Add voucher for {scannedUserfirstname} {scannedUserlastname}
					</Text>
				</TouchableOpacity>
			)}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<TouchableOpacity
					style={styles.modalBackground}
					activeOpacity={1}
					onPressOut={() => setModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						{modalType === "add" && (
							<View>
								<TouchableOpacity
									onPress={() => setModalVisible(false)}
									style={styles.closeButton}
								>
									<Ionicons name="close" size={24} color="black" />
								</TouchableOpacity>
								<Text style={styles.label}>Input Concern:</Text>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										onChangeText={Setvoucher_code}
										placeholder="Voucher Code"
									/>
								</View>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										onChangeText={Setdetails}
										multiline={true}
										placeholder="Details"
									/>
								</View>
								<View style={styles.inputContainer}>
									<TextInput
										style={styles.input}
										onChangeText={Setamount}
										placeholder="Amount"
									/>
								</View>

								<TouchableOpacity
									style={styles.submitButton}
									onPress={handle_create}
								>
									<Text style={styles.buttonText}>Submit</Text>
								</TouchableOpacity>
							</View>
						)}
						{modalType === "edit" && (
							<View>
								<TouchableOpacity
									onPress={() => setModalVisible(false)}
									style={styles.closeButton}
								>
									<Ionicons name="close" size={24} color="black" />
								</TouchableOpacity>
								<Text style={styles.label}>Update Concern:</Text>
								<TextInput
									style={styles.input}
									onChangeText={Setoffice}
									value={office} // Display current value
									placeholder="Enter Office"
								/>
								<TextInput
									style={styles.input_concern}
									onChangeText={Setproblems}
									multiline={true}
									value={problems} // Display current value
									placeholder="Enter Problems"
								/>
								<TouchableOpacity
									style={styles.saveButton}
									onPress={handle_Update}
								>
									<Text style={styles.buttonText}>Save</Text>
								</TouchableOpacity>
							</View>
						)}
						{modalType === "delete" && (
							<View>
								<TouchableOpacity
									onPress={() => setModalVisible(false)}
									style={styles.closeButton}
								>
									<Ionicons name="close" size={24} color="black" />
								</TouchableOpacity>
								<Text style={styles.label_delete}>
									Are you sure you want to delete this concern?
								</Text>
								<TouchableOpacity
									style={styles.deleteSubmitButton}
									onPress={handle_Delete}
								>
									<Text style={styles.buttonText}>Delete</Text>
								</TouchableOpacity>
							</View>
						)}
					</View>
				</TouchableOpacity>
			</Modal>
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
		alignSelf: "center",
		marginTop: 20,
	},

	history_voucher: {
		width: "95%",
		padding: 20,
		backgroundColor: "#045894",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
		marginLeft: "auto", // Adjusted to position it at the right
		marginRight: "auto", // Adjusted to position it at the right
		borderRadius: 10,
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
		backgroundColor: "#FFFFFF",
		padding: 10,
		borderRadius: 10,
		justifyContent: "space-between",
		width: "95%",
		height: "auto",
		marginBottom: 20,
		marginLeft: 10,
	},

	rectangleContainerAprrove: {
		backgroundColor: "#75fab1",
		padding: 10,
		borderRadius: 10,
		justifyContent: "space-between",
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
	modalContainer: {
		backgroundColor: "white",
		padding: 10,
		borderRadius: 1,
		width: "90%",
		height: "auto",
		alignItems: "left",
		justifyContent: "left",
	},
	modalBackground: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		width: "100%",
		padding: 10,
		marginBottom: 20,
	},
	input_concern: {
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
		width: "100%",
		padding: 10,
		marginBottom: 20,
		height: 100,
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	submitButton: {
		backgroundColor: "green",
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		alignSelf: "center",
	},
	closeButton: {
		position: "absolute",
		alignSelf: "flex-end",
	},
});

export default List_employee;
