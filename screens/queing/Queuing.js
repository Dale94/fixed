import React, { useState, useEffect } from "react";
import {
	View,
	Button,
	StyleSheet,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	ScrollView, // Import ScrollView
	ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const Queuing = ({ navigation }) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [modalType, setModalType] = useState(null);
	// const [data, setData] = useState([]);

	const [userinfo, setUserinfo] = useState(null);
	const [que_detail, setQue_detail] = useState(null);

	const [office, Setoffice] = useState("");
	const [problems, Setproblems] = useState("");

	const [selectedItemId, setSelectedItemId] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const userInfoUrl = `${API_URL}/auth/users/me/`;
				const Que_details_url = `${API_URL}/que/`;
				const token = await AsyncStorage.getItem("accessToken");

				if (token) {
					const headers = { Authorization: `JWT ${token}` };
					const [userInfoResponse, QueResponse] = await Promise.all([
						axios.get(userInfoUrl, { headers }),
						axios.get(Que_details_url, { headers }),
					]);

					if (userInfoResponse.status === 200 && QueResponse.status === 200) {
						setUserinfo(userInfoResponse.data);
						// setQue_detail(QueResponse.data);
						setLoading(false); // Set loading to false once data is fetched
					} else {
						console.error("Error fetching data");
					}
				} else {
					console.error("Access token not found");
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchUserInfo();
		fetchData();
	}, []);

	const fetchData = async () => {
		const Que_details_url = `${API_URL}/que/`;
		const token = await AsyncStorage.getItem("accessToken");

		try {
			const headers = { Authorization: `JWT ${token}` };
			const QueResponse = await axios.get(Que_details_url, { headers });

			if (QueResponse.status === 200) {
				setQue_detail(QueResponse.data);
			} else {
				console.error("Error fetching user data:", userResponse.statusText);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handle_create = async () => {
		const userData = {
			user_name: `${userinfo.first_name} ${userinfo.last_name}`,
			office: office,
			problems: problems,
		};

		try {
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const response = await fetch(`${API_URL}/que/create_que/`, {
					method: "POST",
					headers: {
						Authorization: `JWT ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				});

				if (response.ok) {
					fetchData();
					setModalVisible(false);
				}
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handle_Update = async () => {
		try {
			const token = await AsyncStorage.getItem("accessToken");
			const headers = {
				Authorization: `JWT ${token}`,
				"Content-Type": "application/json",
			};
			if (token && userinfo) {
				// Add a condition to check if userinfo is not null
				const response = await axios.put(
					`${API_URL}/que/${selectedItemId}/update_que/`,
					{
						user_name: `${userinfo.first_name} ${userinfo.last_name}`, // Now userinfo is guaranteed to be not null
						office: office,
						problems: problems,
					},
					{ headers }
				);
				console.log("Updated:", response.data);
				console.log("Updated:", selectedItemId);
				setSelectedItemId(null);
				Setoffice("");
				Setproblems("");
				fetchData();
				setModalVisible(false);
			} else {
				console.error("Access token not found or userinfo is null");
			}
		} catch (error) {
			console.error("Error updating data:", error);
		}
	};

	// Inside handleDelete function
	const handle_Delete = async () => {
		try {
			const token = await AsyncStorage.getItem("accessToken");
			const headers = { Authorization: `JWT ${token}` };
			if (token) {
				await axios.delete(`${API_URL}/que/${selectedItemId}/delete_que/`, {
					headers,
				});
				console.log("Deleted:", selectedItemId);
				setModalVisible(false);
				fetchData(); // Fetch updated data
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error deleting data:", error);
		}
	};

	const handle_message = (id, userName) => {
		navigation.navigate("Message", {
			scannedQueId: String(id),
			scannedQueUser: userName,
		});
	};

	const handleEdit = (id, office, problems) => {
		setSelectedItemId(id);
		Setoffice(office);
		Setproblems(problems);
		setIsEditMode(true);
		setModalType("edit");
		setModalVisible(true);
	};

	const handleDelete = (id) => {
		setSelectedItemId(id);
		setModalType("delete");
		setModalVisible(true);
	};

	const handleInputConcern = () => {
		setIsEditMode(false);
		setModalType("add");
		setModalVisible(true);
	};

	return (
		<View style={styles.container}>
			{loading ? (
				<ActivityIndicator size="large" color="#0000ff" />
			) : (
				<View style={styles.container}>
					<TouchableOpacity
						onPress={() => navigation.navigate("Home")}
						style={styles.backButton}
					>
						<Ionicons name="arrow-back" size={24} color="white" />
					</TouchableOpacity>
					<Text style={[styles.ScreenText]}>LIST OF QUE</Text>

					<ScrollView style={styles.scrollView}>
						{que_detail &&
							que_detail.map((item, index) => (
								<View style={styles.rectangleContainer} key={index}>
									<View style={styles.textContainer}>
										<Text style={styles.showConcern}>
											Name: {item.user_name}
										</Text>
										<Text style={styles.showConcern}>
											Office: {item.office}
										</Text>
										<Text style={styles.showConcern}>
											Concerns: {item.problems}
										</Text>
									</View>
									{item.user_name ===
										`${userinfo.first_name} ${userinfo.last_name}` && (
										<View style={styles.buttonContainer}>
											<TouchableOpacity
												style={[styles.button, styles.editButton]}
												onPress={() =>
													handleEdit(item.id, item.office, item.problems)
												} // Pass the item ID to handleEdit
											>
												<Ionicons
													name="create-outline"
													size={24}
													color="white"
												/>
											</TouchableOpacity>
											<TouchableOpacity
												style={[styles.button, styles.deleteButton]}
												onPress={() => handleDelete(item.id)} // Pass the item ID to handleDelete
											>
												<Ionicons name="trash" size={24} color="white" />
											</TouchableOpacity>
											<TouchableOpacity
												style={[styles.button, styles.messageButton]}
												onPress={() => handle_message(item.id, item.user_name)} // Pass the item ID to handleDelete
											>
												<Ionicons name="mail-outline" size={24} color="white" />
											</TouchableOpacity>
										</View>
									)}
								</View>
							))}
					</ScrollView>

					<TouchableOpacity
						style={styles.plusButton}
						onPress={handleInputConcern}
					>
						<Ionicons name="add" size={24} color="white" />
					</TouchableOpacity>

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
												multiline
												onChangeText={Setoffice}
												placeholder="Office"
											/>
										</View>
										<View style={styles.inputContainer}>
											<TextInput
												style={styles.input_concern}
												multiline
												onChangeText={Setproblems}
												placeholder="Concerns"
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
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2b6fcf",
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
	},
	showConcern: {
		color: "black",
		fontWeight: "bold",
	},
	label: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	label_delete: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
		marginTop: 40,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	formContainer: {
		backgroundColor: "rgba(255, 255, 255, 1",
		padding: 20,
		borderRadius: 10,
		width: "80%",
		marginTop: 10,
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
	textContainer: {
		flex: 1,
		marginRight: 10,
	},
	text: {
		fontSize: 16,
		marginBottom: 5,
	},
	buttonContainer: {
		alignItems: "center",
	},
	button: {
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		marginBottom: 5,
	},
	editButton: {
		backgroundColor: "blue",
	},
	deleteButton: {
		backgroundColor: "red",
	},
	messageButton: {
		backgroundColor: "green",
	},
	plusButton: {
		position: "absolute",
		top: 10,
		right: 20,
		backgroundColor: "green",
		padding: 10,
		borderRadius: 20,
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
	submitButton: {
		backgroundColor: "green",
		padding: 10,
		borderRadius: 5,
	},
	deleteSubmitButton: {
		backgroundColor: "darkred",
		padding: 10,
		borderRadius: 5,
	},
	saveButton: {
		backgroundColor: "teal",
		padding: 10,
		borderRadius: 5,
	},
	backButton: {
		position: "absolute",
		top: 10,
		left: 10,
		padding: 10,
	},
	closeButton: {
		position: "absolute",
		alignSelf: "flex-end",
	},
	scrollView: {
		flex: 1,
	},
	ScreenText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		// marginBottom: 20,
		marginTop: 70,
		alignSelf: "center",
		marginBottom: 20,
	},
});

export default Queuing;
