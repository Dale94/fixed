import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	SafeAreaView,
	ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import { useRoute } from "@react-navigation/native";
import { API_URL } from "../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const VoucherTracker = ({ navigation }) => {
	const route = useRoute();
	const scannedVouchertId = route.params?.scannedVoucherId;
	const [voucher, Setvoucher] = useState("");

	useEffect(() => {
		// const fetchUserData = async () => {
		// 	try {
		// 		const userInfoUrl = `${API_URL}/auth/users/me/`;
		// 		const list_department = `${API_URL}/department/list_department/`;
		// 		const token = await AsyncStorage.getItem("accessToken");

		// 		if (token) {
		// 			const headers = { Authorization: `JWT ${token}` };
		// 			const userResponse = await axios.get(userInfoUrl, { headers });
		// 			const ListDepartmentResponse = await axios.get(list_department, {
		// 				headers,
		// 			});

		// 			if (userResponse.status === 200) {
		// 				setUserData(userResponse.data);
		// 				setListDepartment(ListDepartmentResponse.data);
		// 			} else {
		// 				console.error("Error fetching user data:", userResponse.statusText);
		// 			}
		// 		} else {
		// 			navigation.navigate("Login");
		// 		}
		// 	} catch (error) {
		// 		console.error("Error:", error);
		// 	}
		// };

		// fetchUserData();
		// const intervalId = setInterval(fetchUserVoucher, 1000); // Fetch every 5 seconds
		console.log(scannedVouchertId);
		console.log(voucher);

		// Clear interval when the component unmounts
		// return () => clearInterval(intervalId);
		setTimeout(fetchUserVoucher, 3000);
	}, []);

	const fetchUserVoucher = async () => {
		const Que_details_url = `${API_URL}/budget/${scannedVouchertId}/detail_voucher/`;
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

	return (
		<SafeAreaView style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("VoucherMain")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>

			{/* <Text style={styles.title}>Tracking</Text> */}
			<View style={styles.circleContainer}>
				<View style={styles.circleWrapper}>
					<View style={styles.circleView}>
						<View style={[styles.outerCircle, { backgroundColor: "#75fab1" }]}>
							<View style={styles.innerCircle}>
								<Ionicons name="checkmark-outline" size={20} color="#75fab1" />
							</View>
						</View>
					</View>
				</View>

				{voucher.accounting_approval ? (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#75fab1" }]}
							>
								<View style={styles.innerCircle}>
									<Ionicons
										name="checkmark-outline"
										size={20}
										color="#75fab1"
									/>
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				) : (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#f57f7f" }]}
							>
								<View style={styles.innerCircleNOT}>
									<Ionicons name="close-outline" size={20} color="#f57f7f" />
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				)}

				{voucher.mayor_approval ? (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#75fab1" }]}
							>
								<View style={styles.innerCircle}>
									<Ionicons
										name="checkmark-outline"
										size={20}
										color="#75fab1"
									/>
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				) : (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#f57f7f" }]}
							>
								<View style={styles.innerCircleNOT}>
									<Ionicons name="close-outline" size={20} color="#f57f7f" />
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				)}

				{voucher.treasury_approval ? (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#75fab1" }]}
							>
								<View style={styles.innerCircle}>
									<Ionicons
										name="checkmark-outline"
										size={20}
										color="#75fab1"
									/>
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				) : (
					<View style={styles.circleWrapper}>
						<View style={styles.circleView}>
							<View
								style={[styles.outerCircle, { backgroundColor: "#f57f7f" }]}
							>
								<View style={styles.innerCircleNOT}>
									<Ionicons name="close-outline" size={20} color="#f57f7f" />
								</View>
							</View>
						</View>
						<View style={styles.line} />
					</View>
				)}
			</View>

			{/* PagerView */}
			<PagerView style={styles.viewPager} initialPage={0}>
				<View style={styles.page} key="1">
					<View>
						<ImageBackground
							source={require("../../assets/images/budget.png")}
							style={styles.imageBackground}
						></ImageBackground>
					</View>
					<Text style={styles.Aprrovetext}>BUDGET: APRROVED</Text>
				</View>

				{voucher.accounting_approval ? (
					<View style={styles.page} key="2">
						<ImageBackground
							source={require("../../assets/images/accounting.png")}
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.Aprrovetext}>ACCOUNTING: APRROVED</Text>
					</View>
				) : (
					<View style={styles.page} key="2">
						<ImageBackground
							source={require("../../assets/images/accounting.png")}
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.NotAprrovetext}>
							ACCOUNTING: NOT YET APPROVE
						</Text>
					</View>
				)}

				{voucher.mayor_approval ? (
					<View style={styles.page} key="3">
						<ImageBackground
							source={require("../../assets/images/images.png")}
							style={[styles.imageBackground, { width: 300, height: 300 }]}
						></ImageBackground>
						<Text style={styles.Aprrovetext}>MAYOR: APPROVE</Text>
					</View>
				) : (
					<View style={styles.page} key="3">
						<ImageBackground
							source={require("../../assets/images/images.png")}
							style={[styles.imageBackground, { width: 300, height: 300 }]}
						></ImageBackground>
						<Text style={styles.NotAprrovetext}>MAYOR: NOT APPROVE YET </Text>
					</View>
				)}

				{voucher.treasury_approval ? (
					<View style={styles.page} key="4">
						<ImageBackground
							source={require("../../assets/images/treasury.png")}
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.Aprrovetext}>TREASURY: APPROVE</Text>
					</View>
				) : (
					<View style={styles.page} key="4">
						<ImageBackground
							source={require("../../assets/images/treasury.png")}
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.NotAprrovetext}>TREASURY: NOT YET APPROVE</Text>
					</View>
				)}
			</PagerView>
		</SafeAreaView>
	);
};

const { height, width } = Dimensions.get("window");

function roundOff(v) {
	return Math.round(v);
}

const dimensions = () => {
	var _borderRadius = roundOff((height + width) / 2);
	var _height = roundOff(height);
	var _width = roundOff(width);

	return { _borderRadius, _height, _width };
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#2b6fcf",
		flex: 1,
		padding: 20,
	},
	title: {
		color: "white",
		textShadowColor: "black",
		textShadowRadius: 5,
		fontSize: 80,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	backButton: {
		position: "absolute",
		top: 10,
		left: 10,
		padding: 10,
		zIndex: 1,
		backButtonShadowColor: "black",
		backButtonShadowRadius: 5,
		color: "white",
	},
	circleContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 20,
	},
	circleView: {
		alignItems: "center",
		justifyContent: "center",
		height: dimensions()._height * 0.1,
		width: dimensions()._height * 0.1,
		borderRadius: dimensions()._borderRadius,
		backgroundColor: "transparent",
	},
	outerCircle: {
		justifyContent: "center",
		alignItems: "center",
		width: 40,
		height: 40,
		borderRadius: 20,
	},
	innerCircle: {
		backgroundColor: "#3d8a60",
		width: 26,
		height: 26,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	innerCircleNOT: {
		backgroundColor: "#8a3d3d",
		width: 26,
		height: 26,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
	},
	number: {
		color: "black",
		fontSize: 16,
		fontWeight: "bold",
	},
	viewPager: {
		flex: 1,
	},
	page: {
		justifyContent: "center",
		alignItems: "center",
	},
	line: {
		width: 5,
		height: 38,
		backgroundColor: "white",
		position: "absolute",
		transform: [{ rotate: "90deg" }],
		top: "50%",
		marginTop: -19.1,
		marginLeft: -5.9,
	},
	Aprrovetext: {
		textAlign: "center",
		textShadowColor: "black",
		textShadowRadius: 30,
		lineHeight: 40,
		fontWeight: "bold",
		fontSize: 40,
		marginBottom: 20,
		color: "#75fab1",
		top: 11,
	},

	NotAprrovetext: {
		textAlign: "center",
		textShadowColor: "black",
		textShadowRadius: 30,
		lineHeight: 40,
		fontWeight: "bold",
		fontSize: 40,
		marginBottom: 20,
		color: "#f57f7f",
		top: 11,
	},

	imageBackground: {
		width: 300,
		height: 300,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		overflow: "hidden",
		elevation: 5,
	},
});

export default VoucherTracker;
