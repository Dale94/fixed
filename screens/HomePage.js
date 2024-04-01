import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	ImageBackground,
	Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "../config";
import { Ionicons } from "@expo/vector-icons";
import SettingScreen from "./settings/SettingScreen";
import userDetails from "./extensions/user_details";

const HomeScreen = ({ navigation }) => {
	const handleListItemClick = () => {
		setShowListModal(true);
	};

	const SettingsScreen = () => {
		// Navigate to the Change Password screen
		navigation.push("setting");
	};

	const Que_page = () => {
		navigation.reset({
			index: 0,
			routes: [{ name: "Queuing_page" }],
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.ScreenText}>Home</Text>
			<View style={styles.userInfo}>{userDetails()}</View>
			<View style={styles.row}>
				<TouchableOpacity
					style={[styles.imagecontainer, { marginRight: 10 }]} // Added margin to create a gap
					onPress={Que_page}
				>
					<View>
						<ImageBackground
							source={require("../assets/images/4h.png")} // Replace with your image path
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.label}>Queuing</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.imagecontainer, { marginLeft: 10 }]} // Added margin to create a gap
					onPress={handleListItemClick}
				>
					<View>
						<ImageBackground
							source={require("../assets/images/Bud1.png")} // Replace with your image path
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.label}>Budget</Text>
					</View>
				</TouchableOpacity>
			</View>

			<View style={styles.row}>
				<TouchableOpacity
					style={[styles.imagecontainer, { marginRight: 10 }]} // Added margin to create a gap
					onPress={handleListItemClick}
				>
					<View>
						<ImageBackground
							source={require("../assets/images/vou.png")} // Replace with your image path
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.label}>Voucher</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={[styles.imagecontainer, { marginLeft: 10 }]} // Added margin to create a gap
					onPress={SettingsScreen}
				>
					<View>
						<ImageBackground
							source={require("../assets/images/settings.webp")} // Replace with your image path
							style={styles.imageBackground}
						></ImageBackground>
						<Text style={styles.label}>Settings</Text>
					</View>
				</TouchableOpacity>
			</View>

			{/* <Modal visible={showListModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ListScreen onClose={handleCloseListModal} />
        </View>
      </Modal> */}
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
	ScreenText: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
	},
	userInfo: {
		color: "white",
		fontSize: 18,
		fontWeight: "bold",
		position: "absolute",
		alignSelf: "flex-end",
		top: 20,
		zIndex: 1,
	},
	userDepartment: {
		color: "white",
		fontSize: 13,
		fontWeight: "bold",
		marginTop: 5, // Adjust the spacing as needed
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

export default HomeScreen;
