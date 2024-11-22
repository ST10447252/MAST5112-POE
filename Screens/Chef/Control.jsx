import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { Colors } from "@/assets/components/Colors";

const Control = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mealName, setMealName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [courseType, setCourseType] = useState('');
  const [image, setImage] = useState(null);
  const [meals, setMeals] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error('Failed to load meals:', error);
      }
    };
    loadMeals();
  }, []);

  const handleAddMeal = async () => {
    if (mealName && description && price && image && courseType) {
      const newMeal = {
        id: Date.now().toString(),
        mealName,
        description,
        price,
        courseType,
        image,
      };

      try {
        const existingMeals = await AsyncStorage.getItem('meals');
        const mealsArray = existingMeals ? JSON.parse(existingMeals) : [];
        mealsArray.push(newMeal);
        await AsyncStorage.setItem('meals', JSON.stringify(mealsArray));
      } catch (error) {
        console.error('Failed to save meal:', error);
      }

      setMeals([...meals, newMeal]);
      setModalVisible(false);
      clearForm();
    } else {
      alert('Please fill all fields and select an image.');
    }
  };

  const clearForm = () => {
    setMealName('');
    setDescription('');
    setPrice('');
    setCourseType('');
    setImage(null);
  };

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDeleteMeal = async (id) => {
    const updatedMeals = meals.filter(meal => meal.id !== id);
    setMeals(updatedMeals);

    try {
      await AsyncStorage.setItem('meals', JSON.stringify(updatedMeals));
    } catch (error) {
      console.error('Failed to remove meal:', error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <TouchableOpacity
        style={styles.signout}
        onPress={() => navigation.navigate("Splash")}
      >
        <Image
          source={require("@/assets/Icons/SignOutIcon.png")}
          style={styles.signOutIcon}
        />
      </TouchableOpacity>
      

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {meals.map((meal) => (
          <ImageBackground
            key={meal.id}
            source={{ uri: meal.image }}
            style={styles.card}
            imageStyle={styles.cardImageBackground}
          >
            <View style={styles.cardContent}>
              <Text style={styles.mealName}>{meal.mealName}</Text>
              <Text style={styles.courseType}>{meal.courseType}</Text>
              <Text style={styles.description}>{meal.description}</Text>
              <Text style={styles.price}>R {meal.price}</Text>
              <TouchableOpacity
                onPress={() => handleDeleteMeal(meal.id)}
                style={styles.deleteButton}
              >
                <Image
                  source={require("@/assets/Icons/trash.png")}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.addButton}
      >
        <Image
          source={require("@/assets/Icons/AddIcon.png")}
          style={{ width: 44, height: 44 }}
        />
      </TouchableOpacity>

      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={handleImagePicker}
              style={styles.imagePicker}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <Image
                  source={require("@/assets/Icons/ImagePickerIcon.png")}
                />
              )}
            </TouchableOpacity>
            <TextInput
              placeholder="Enter Meal"
              style={styles.input}
              value={mealName}
              onChangeText={setMealName}
              placeholderTextColor={"black"}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={"black"}
            />
            <TextInput
              placeholder="Enter Price"
              keyboardType="number-pad"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholderTextColor={"black"}
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={courseType}
                onValueChange={(itemValue) => {
                  setCourseType(itemValue);
                }}
                style={styles.picker}
              >
                <Picker.Item label="Starter" value="starter" color="black" />
                <Picker.Item label="Main" value="main" color="black" />
                <Picker.Item label="Dessert" value="dessert" color="black" />
              </Picker>
            </View>

            <TouchableOpacity onPress={handleAddMeal} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Control;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30: 30, 
    backgroundColor: Colors.Gray,
  },

  signout: {
    padding: 20
  },
  signOutIcon: {
    width: 34,
    height: 34,
  },
  scrollView: {
    marginVertical: 10,
    maxHeight: 600, // Set a fixed height for the ScrollView
  },
  scrollViewContent: {
    paddingHorizontal: 15,
    gap: 15, // Adds spacing between cards
  },
  card: {
    height: 300, // Fixed height for each card
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardContent: {
    flex: 1,
    padding: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
  },
  mealName: {
    fontFamily: 'Cowra',
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  courseType: {
    fontFamily: 'Mollie',
    color: 'white',
    fontSize: 24,
    marginTop: 5,
  },
  description: {
    fontFamily: 'Inter',
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  price: {
    fontFamily: 'Inter',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 5,
    borderRadius: 50,
  },
  addButton: {
    padding: 15,
    position: 'absolute',
    top: Platform.OS === "android" ? 30: 50,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
  },
  imagePicker: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    paddingBottom: 30,  // To allow space for the iOS bottom bar
  },
  picker: {
    height: 200,
  },
  submitButton: {
    backgroundColor: '#B1B482',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
