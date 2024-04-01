import * as React from "react";
import { View, Text, BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import LoginScreen from "./screens/authentication/LoginScreen";
import SignupScreen from "./screens/authentication/SignupScreen";
import HomeScreen from "./screens/HomePage";
import QRScanner from "./screens/authentication/QRcodeScanner";
import Forgotpassword from "./screens/authentication/Fotgotpassword";
import SettingScreen from "./screens/settings/SettingScreen";
import DeleteAccountScreen from "./screens/settings/DeleteAccount";
import PasswordReset from "./screens/settings/PasswordReset";
import UpdateInfo from "./screens/settings/UpdateInfo";
import SettingQRScanner from "./screens/settings/QRcodeScannerSetting";
import EmailReset from "./screens/settings/EmailReset";
import UserInfo from "./screens/settings/user_info";
import Queuing from "./screens/queing/Queuing";
import ChatUI from "./screens/queing/Message";

const Stack = createNativeStackNavigator();

function App() {
	const [accessToken, setAccessToken] = React.useState(null);
	const navigationRef = React.useRef();

	React.useEffect(() => {
		// Check if access token exists in AsyncStorage
		const checkAccessToken = async () => {
			try {
				const token = await AsyncStorage.getItem("accessToken");
				if (token) {
					setAccessToken(token);
					// navigationRef.current?.navigate("Home");
				}
			} catch (error) {
				console.error("Error retrieving access token:", error);
				// navigationRef.current?.navigate("Login");
			}
		};

		const handleBackButton = () => {
			// If the user is on the Home screen and presses the back button, prevent navigating back to the login screen
			if (navigationRef.current?.getCurrentRoute()?.name === "Home") {
				return true; // Return true to prevent default back button behavior
			}
		};

		const backHandler = BackHandler.addEventListener(
			"hardwareBackPress",
			handleBackButton
		);

		checkAccessToken();

		// checkLoginStatus();

		return () => backHandler.remove(); // Remove the event listener when the component unmounts
	}, []);

	// const checkLoginStatus = async () => {
	// 	try {
	// 		const token = await AsyncStorage.getItem("accessToken");
	// 		if (token) {
	// 			// User is logged in, navigate to the home screen
	// 			reset({
	// 				index: 0,
	// 				routes: [{ name: "Home" }],
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.error("Error checking login status:", error);
	// 	}
	// };

	// Conditional rendering based on access token
	return (
		<NavigationContainer ref={navigationRef}>
			<Stack.Navigator
				initialRouteName={accessToken ? "Home" : "Login"}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name="Login" component={LoginScreen} />
				<Stack.Screen name="Signup" component={SignupScreen} />
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="QRcode" component={QRScanner} />
				<Stack.Screen name="QRcodeSetting" component={SettingQRScanner} />
				<Stack.Screen name="Forgot_password" component={Forgotpassword} />
				<Stack.Screen name="setting" component={SettingScreen} />
				<Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
				<Stack.Screen name="Password_reset" component={PasswordReset} />
				<Stack.Screen name="Update_info" component={UpdateInfo} />
				<Stack.Screen name="Email_reset" component={EmailReset} />
				<Stack.Screen name="User_info" component={UserInfo} />
				<Stack.Screen name="Queuing_page" component={Queuing} />
				<Stack.Screen name="Message" component={ChatUI} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
