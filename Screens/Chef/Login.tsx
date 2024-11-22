import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, Dimensions } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/assets/components/Colors";
import { StatusBar } from "expo-status-bar";
import { Video } from 'expo-av';


const { width, height } = Dimensions.get('window');


const Login = () => {
  const [visibleVideo, setVisibleVideo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const saveCredentials = async (email: string, password: string) => {
    await SecureStore.setItemAsync("userEmail", email);
    await SecureStore.setItemAsync("userPassword", password);
  };

  const getCredentials = async () => {
    const storedEmail = await SecureStore.getItemAsync("userEmail");
    const storedPassword = await SecureStore.getItemAsync("userPassword");
    return { storedEmail, storedPassword };
  };

  const SignUp = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    const { storedEmail } = await getCredentials();
    if (storedEmail) {
      Alert.alert("Error", "An account already exists. Please log in.");
      return;
    }

    await saveCredentials(email, password);
    Alert.alert("Success", "User registered successfully!");
    navigation.navigate("Control");
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {visibleVideo === item.id && (
        <Video
          source={item.uri}
          style={styles.video}
          useNativeControls  // Adds default video controls
          resizeMode="contain"
          isLooping
          shouldPlay={true}  // Automatically plays the video when visible
        />
      )}
      <Text style={styles.videoTitle}>{item.title}</Text>
    </View>
  );

  const SignIn = async () => {
    const { storedEmail, storedPassword } = await getCredentials();
    if (!storedEmail || !storedPassword) {
      Alert.alert("Error", "No account found. Please sign up first.");
      return;
    }

    if (email === storedEmail && password === storedPassword) {
      Alert.alert("Success", "Login successful!");
      navigation.navigate("Control");
    } else {
      Alert.alert("Error", "Incorrect email or password.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar style="light" />
    
        <View style={styles.nav}>
          <TouchableOpacity
            style={styles.signout}
            onPress={() => navigation.navigate("Splash")}
          >
            <Image
              source={require("@/assets/Icons/back.png")}
              style={styles.signOutIcon}
            />
          </TouchableOpacity>
       
        </View>

        <View style={styles.SplashCard}>
          <View style={styles.overlay}>

          </View>
        {/* Background Video */}
        <Video
          source={require('@/assets/Videos/Video-4.mp4')}  // Your background video
          style={styles.videoBackground}
          resizeMode="cover"
          shouldPlay
          isLooping
        />
        </View>
    
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back Chef!</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          placeholderTextColor={"black"}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          placeholderTextColor={"black"}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={SignIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={SignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BunrtUmber,
  },
  nav: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 2,
  },
  signout: {
    padding: 20,
  },
  signOutIcon: {
    width: 54,
    height: 54,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for content visibility
    zIndex: 1,
    justifyContent: 'center', // Center content inside overlay
    paddingHorizontal: 20,
  },
  SplashCard: {
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Transparent overlay for text and buttons
    height: height * 0.3, // Adjust height as needed for your splash card
    width: width * 1, // Adjust width as needed for your splash card
    overflow: 'hidden', // Prevents anything from spilling out of the card
  },
  videoBackground: {
    position: "absolute",
    top: 0, // Adjust the positioning as needed
    left: 0,
    width: width, // Full width of the screen
    height: height * 0.3, // Adjust height proportionally
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 74,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Mollie",
    color: Colors.Powder,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    color: Colors.Powder,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly translucent background
  },
  button: {
    backgroundColor: Colors.Alien,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10, // Increased margin for better spacing
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Login;
