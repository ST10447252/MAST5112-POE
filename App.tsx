import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Splash from "./Screens/Splash";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Menu from "./Screens/Client-User/Menu";
import Login from './Screens/Chef/Login';
import Control from "./Screens/Chef/Control";
import Reservation from "./Screens/Client-User/Reservation";
import Cart from "./Screens/Cart";

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Mollie: require("./assets/Fonts/Mollie Glaston.ttf"),
    Cowra: require("./assets/Fonts/CowraFreeRegular-1joRB.otf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Menu"
          component={Menu}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
      <Stack.Screen
          name="Control"
          component={Control}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="Reservation"
          component={Reservation}
          options={{ headerShown: false }}
        />

<Stack.Screen
          name="Cart"
          component={Cart}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
