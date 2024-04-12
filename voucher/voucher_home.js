import React, { useState, useRef, useEffect } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	ImageBackground,
	ActivityIndicator, // Import ActivityIndicator
} from "react-native";
import PagerView from "react-native-pager-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../../config";
import { Ionicons } from "@expo/vector-icons";
import userDetails from "../extensions/user_details";

const VoucherMain = ({ navigation }) => {
	const [currentPage, setCurrentPage] = useState(0);
	const [userData, setUserData] = useState(null);
	const [listDepartment, setListDepartment] = useState(null);
	const [voucher, Setvoucher] = useState("");
	const [loading, setLoading] = useState(true); // Add loading state

	const voucher_array = [];

	let pagerRef = useRef(null);
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
		fetchUserVoucher();
		// const intervalId = setInterval(fetchUserData, 500); // Fetch every 5 seconds
		const intervalId2 = setInterval(fetchUserVoucher, 3000); // Fetch every 5 seconds

		// Clear interval when the component unmounts
		return () => {
			// clearInterval(intervalId);
			clearInterval(intervalId2);
		};
	}, []);

	const fetcharray = async () => {
		for (let i = 0; i < userData.length; i++) {
			voucher_array.push();
		}
	};

	let departmentName = "";
	let userInfo = "";

	if (userData && listDepartment) {
		for (let i = 0; i < listDepartment.length; i++) {
			if (listDepartment[i].id === userData.department) {
				departmentName = listDepartment[i].name;
				break;
			}
		}

		userInfo = `${userData.first_name} ${userData.last_name}`;
	}

	const fetchUserVoucher = async () => {
		const Que_details_url = `${API_URL}/budget/`;
		const token = await AsyncStorage.getItem("accessToken");

		try {
			const headers = { Authorization: `JWT ${token}` };
			const QueResponse = await axios.get(Que_details_url, { headers });

			if (QueResponse.status === 200) {
				const reversedData = QueResponse.data.reverse(); // Reverse the data
				Setvoucher(reversedData);
				setLoading(false); // Set loading to false when data is fetched
			} else {
				console.error("Error fetching voucher:", userResponse.statusText);
			}
		} catch (error) {
			console.error("Error fetching voucher:", error);
		}
	};

	const list_departmentpage = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: "List_department" }],
		});
	};

	const voucher_tracker = (id) => {
		navigation.navigate("Voucher_tracker", {
			scannedVoucherId: id,
		});
		console.log(id);
	};

	if (loading) {
		// Render loading screen if loading state is true
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#ffffff" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity
				onPress={() => navigation.navigate("Home")}
				style={styles.backButton}
			>
				<Ionicons name="arrow-back" size={24} color="white" />
			</TouchableOpacity>

			{userData && listDepartment && (
				<View style={styles.userInfoContainer}>
					<View style={styles.userDetails}>
						<Text style={styles.userInfo}>{userInfo}</Text>
						<Text style={styles.userDepartment}>{departmentName}</Text>
					</View>
					<ImageBackground
						source={require("../../assets/images/images.png")}
						style={styles.logo}
					/>
				</View>
			)}

			<TouchableOpacity
				onPress={list_departmentpage}
				style={styles.history_voucher}
			>
				<Ionicons name="library" size={24} color="white" />
				<Text style={styles.approve_text}>Aprrove and view voucher</Text>
			</TouchableOpacity>

			<PagerView
				style={styles.pagerview_container}
				initialPage={0}
				onPageSelected={(event) => setCurrentPage(event.nativeEvent.position)}
				ref={(ref) => (pagerRef = ref)}
			>
				<View style={styles.page} key="1">
					<Text style={[styles.ScreenText]}>Your approved Voucher </Text>
					<ScrollView>
						{voucher.map((voucherItem, index) => {
							if (voucherItem.user_name === userInfo) {
								if (voucherItem.treasury_approval) {
									return (
										<TouchableOpacity
											onPress={() => voucher_tracker(voucherItem.id)}
											key={voucherItem.id || index} // Use voucherItem.id if available, otherwise use index
										>
											<View
												key={voucherItem.id}
												style={styles.rectangleContainerApprove}
											>
												<View style={styles.group_text}>
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
												</View>

												<View style={styles.amountContainer}>
													<Text style={styles.showConcern}>
														Amount: {voucherItem.amount}
													</Text>
												</View>
											</View>
										</TouchableOpacity>
									);
								}

								if (!voucherItem.treasury_approval) {
									return (
										<TouchableOpacity
											onPress={() => voucher_tracker(voucherItem.id)}
											key={voucherItem.id || index} // Use voucherItem.id if available, otherwise use index
										>
											<View
												key={voucherItem.id}
												style={styles.rectangleContainer}
											>
												<View style={styles.group_text}>
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
												</View>

												<View style={styles.amountContainer}>
													<Text style={styles.showConcern}>
														Amount: {voucherItem.amount}
													</Text>
												</View>
											</View>
										</TouchableOpacity>
									);
								}
							}
						})}
					</ScrollView>
				</View>
				<View style={styles.page} key="2">
					<Text style={[styles.ScreenText]}>Department employee's voucher</Text>
					<ScrollView>
						{userData &&
							voucher.map((voucherItem, index) => {
								// Check if the voucher's department ID matches the user's department ID
								if (voucherItem.department === userData.department) {
									if (voucherItem.treasury_approval) {
										return (
											<View
												key={voucherItem.id}
												style={styles.rectangleContainerApprove}
											>
												<View style={styles.group_text}>
													<View style={styles.textContainer}>
														<Text style={styles.showConcern}>
															Name: {voucherItem.user_name}
														</Text>
													</View>
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
												</View>

												<View style={styles.amountContainer}>
													<Text style={styles.showConcern}>
														Amount: {voucherItem.amount}
													</Text>
												</View>
											</View>
										);
									}

									if (!voucherItem.treasury_approval) {
										return (
											<TouchableOpacity
												onPress={() => voucher_tracker(voucherItem.id)}
												key={voucherItem.id || index} // Use voucherItem.id if available, otherwise use index
											>
												<View
													key={voucherItem.id}
													style={styles.rectangleContainer}
												>
													<View style={styles.group_text}>
														<View style={styles.textContainer}>
															<Text style={styles.showConcern}>
																Name: {voucherItem.user_name}
															</Text>
														</View>
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
													</View>

													<View style={styles.amountContainer}>
														<Text style={styles.showConcern}>
															Amount: {voucherItem.amount}
														</Text>
													</View>
												</View>
											</TouchableOpacity>
										);
									}
								}
							})}
					</ScrollView>
				</View>
			</PagerView>
			<View style={styles.footer}>
				<TouchableOpacity
					style={styles.footerItem}
					// onPress={() => handlePageChange(0)}
				>
					<Text
						style={currentPage === 0 ? styles.activeText : styles.inactiveText}
					>
						{`\u25CF`}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.footerItem}
					// onPress={() => handlePageChange(1)}
				>
					<Text
						style={currentPage === 1 ? styles.activeText : styles.inactiveText}
					>
						{`\u25CF`}
					</Text>
				</TouchableOpacity>
			</View>
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
		height: "95%",
	},
	textContainer: {
		flex: 1,
		marginRight: 10,
		flexDirection: "row",
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
		flexDirection: "row",
	},
	rectangleContainerApprove: {
		backgroundColor: "#75fab1",
		padding: 10,
		borderRadius: 10,
		justifyContent: "space-between",
		width: "95%",
		height: "auto",
		marginBottom: 20,
		marginLeft: 10,
		flexDirection: "row",
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

	userInfoContainer: {
		position: "absolute",
		top: 20,
		right: 20,
		flexDirection: "row",
		alignItems: "center",
	},
	userDetails: {
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
	group_details: {
		position: "absolute",
		top: -180,
		zIndex: 1,
	},
	row: {
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	logo: {
		marginTop: 3,
		width: 50,
		height: 50,
	},
	userInfo: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		marginTop: 5,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#2b6fcf",
	},
});

export default VoucherMain;
