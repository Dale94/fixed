import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ScrollView,
	TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import axios from "axios";

const ChatUI = ({ navigation }) => {
	const route = useRoute();

	const [message, setMessage] = useState("");
	const [Que_reply, setQue_reply] = useState([]);
	const [Que_message, setQue_message] = useState([]);
	const [userinfo, setUserinfo] = useState(null);
	const [loading, setLoading] = useState(true);

	const scannedQueId = route.params?.scannedQueId;
	const scannedUser = route.params?.scannedQueUser;

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

		fetchreply();
		fetchmessage();
	}, []);

	const fetchreply = async () => {
		const Que_details_url = `${API_URL}/que/${scannedQueId}/reply/`;
		const token = await AsyncStorage.getItem("accessToken");

		try {
			const headers = { Authorization: `JWT ${token}` };
			const QueResponse = await axios.get(Que_details_url, { headers });

			if (QueResponse.status === 200) {
				setQue_reply(QueResponse.data);
			} else {
				console.error("Error fetching reply:", userResponse.statusText);
			}
		} catch (error) {
			console.error("Error fetching reply:", error);
		}
	};

	const fetchmessage = async () => {
		const Que_details_url = `${API_URL}/que/${scannedQueId}/message/`;
		const token = await AsyncStorage.getItem("accessToken");

		try {
			const headers = { Authorization: `JWT ${token}` };
			const QueResponse = await axios.get(Que_details_url, { headers });

			if (QueResponse.status === 200) {
				setQue_message(QueResponse.data);
			} else {
				console.error("Error fetching message:", userResponse.statusText);
			}
		} catch (error) {
			console.error("Error fetching message:", error);
		}
	};

	const handleSendMessage = async () => {
		const userData = {
			Que_num: scannedQueId,
			Itmessage: message,
		};

		try {
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const response = await fetch(
					`${API_URL}/que/${scannedQueId}/create_message/`,
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
					fetchmessage();
					fetchreply();
				}
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleSendReply = async () => {
		const userData = {
			user_reply: message,
		};

		try {
			const token = await AsyncStorage.getItem("accessToken");

			if (token) {
				const response = await fetch(
					`${API_URL}/que/${scannedQueId}/create_reply/`,
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
					fetchmessage();
					fetchreply();
				}
			} else {
				console.error("Access token not found");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	// Merge messages and replies into a single array and sort by timestamp
	const mergedArray = [
		...Que_message.map((msg) => ({ ...msg, isReply: false })),
		...Que_reply.map((reply) => ({ ...reply, isReply: true })),
	].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

	console.log("Merged Array sadfasdf:", mergedArray);

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("Queuing_page")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>
			<Text style={[styles.ScreenText]}>Chat with {scannedUser}</Text>

			<ScrollView>
				{mergedArray.map((item, index) => (
					<View
						key={index}
						style={item.isReply ? styles.tealBubble : styles.greenBubble}
					>
						<Text style={styles.text}>
							{item.isReply ? item.user_reply : item.Itmessage}
						</Text>
					</View>
				))}

				{/* Display "No chats yet" message if both message and reply are empty */}
				{!mergedArray.length ? (
					<View style={styles.noChatsContainer}>
						<Text style={styles.noChatsText}>No chats yet</Text>
					</View>
				) : null}
			</ScrollView>

			<View style={styles.inputContainer}>
				<TextInput
					style={styles.textInput}
					placeholder="Type a message..."
					placeholderTextColor="white"
					multiline={true}
					onChangeText={setMessage}
				/>
				<TouchableOpacity onPress={handleSendReply}>
					<Ionicons name="send" size={24} color="white" />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#2b6fcf",
		padding: 16,
	},
	bubble: {
		maxWidth: "70%",
		padding: 12,
		borderRadius: 16,
		marginBottom: 8,
	},
	text: {
		color: "white",
	},
	tealBubble: {
		marginTop: 10,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "teal",
		alignSelf: "flex-start",
	},
	greenBubble: {
		marginTop: 10,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "green",
		alignSelf: "flex-end",
	},
	backButton: {
		position: "absolute",
		top: 10,
		left: 10,
		padding: 10,
	},
	ScreenText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 70,
		alignSelf: "center",
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "transparent",
		borderTopWidth: 1,
		borderTopColor: "white",
		paddingVertical: 10,
		paddingHorizontal: 16,
	},
	textInput: {
		flex: 1,
		height: 70,
		color: "white",
	},
	noChatsContainer: {
		alignItems: "center",
		marginTop: 20,
	},
	noChatsText: {
		color: "white",
		fontSize: 16,
	},
});

export default ChatUI;
