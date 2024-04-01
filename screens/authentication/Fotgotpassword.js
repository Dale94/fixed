// LoginScreen.js
import React, {useState} from 'react';
import { View, Text, StatusBar, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import {API_URL} from '../../config';

export default function Forgotpassword({ navigation }) {

  const [email, setEmail] = useState('');
  
  const handle_reset_password = async () => {
    const userData = {
      email: email,
    };
  
    try {
      const response = await fetch(`${API_URL}/auth/users/reset_password/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        alert(`Your varification link has been sent.`);
        navigation.navigate('Login');
      } else {
        console.error('Wrong password and email:', response.statusText);
      }
    } catch (error) {
      console.error('Wrong password and email:', error);
    }
  };
  

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Image style={styles.logo} source={require('../../assets/images/images.png')} />
      <Text style={[styles.logoText, styles.headerText]}>Municipality of San Remigio</Text>
      <Text style={[styles.loginText, styles.headerText]}>LOGIN</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput placeholder='Email' onChangeText={setEmail} />
        </View>

        
        <TouchableOpacity onPress={handle_reset_password} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Send email verification</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text>remembered your password? </Text>
          <TouchableOpacity onPress={() => navigation.push('Login')}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2b6fcf',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200, // Adjust as needed
    height: 100, // Adjust as needed
    resizeMode: 'contain', // Maintain the image's original aspect ratio
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, .3)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    marginTop: 10,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#ffff',
  },
  logoText: {
    color: 'yellow',
    paddingBottom: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  forgotView: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  forgotText: {
    color: '#ffff',
    padding: "3%",
    paddingBottom: "5%"
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row', // Add flexDirection: 'row'
    alignItems: 'center', // Align items vertically in the center
    justifyContent: 'space-between', // Distribute items evenly along the row
  },
  input: {
    flex: 1, // Take up remaining space
    marginRight: 10, // Add some space between TextInput and TouchableOpacity
  },
});
