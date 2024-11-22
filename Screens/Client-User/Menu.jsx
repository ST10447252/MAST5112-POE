import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Image, Alert, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/assets/components/Colors';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');


const Menu = ({ navigation }) => {
  const [meals, setMeals] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [averages, setAverages] = useState({
    starter: 0,
    main: 0,
    dessert: 0,
  });

  useEffect(() => {
    const calculateAverages = () => {
      const starterMeals = meals.filter((meal) => meal.courseType === 'starter');
      const mainMeals = meals.filter((meal) => meal.courseType === 'main');
      const dessertMeals = meals.filter((meal) => meal.courseType === 'dessert');
  
      setAverages({
        starter: starterMeals.length ? (starterMeals.reduce((sum, meal) => sum + meal.price, 0) / starterMeals.length).toFixed(2) : 0,
        main: mainMeals.length ? (mainMeals.reduce((sum, meal) => sum + meal.price, 0) / mainMeals.length).toFixed(2) : 0,
        dessert: dessertMeals.length ? (dessertMeals.reduce((sum, meal) => sum + meal.price, 0) / dessertMeals.length).toFixed(2) : 0,
      });
    };
  
    calculateAverages();
  }, [meals]); // Recalculate averages whenever meals are updated
  
  const filteredAverages = (courseType) => {
    if (filter === 'all') {
      return averages;
    }
    return {
      [filter]: averages[filter],
    };
  };

  useEffect(() => {
    const loadMeals = async () => {
      try {
        const storedMeals = await AsyncStorage.getItem('meals');
        if (storedMeals) {
          setMeals(JSON.parse(storedMeals));
        }
      } catch (error) {
        console.error('Failed to load meals from AsyncStorage:', error);
      }
    };
    const renderItem = ({ item }) => (
      <View style={styles.card}>
        {visibleVideo === item.id && (
          <Video
            source={item.uri}
            style={styles.video}
            useNativeControls  
            resizeMode="contain"
            isLooping
            shouldPlay={true} 
          />
        )}
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
    );

    const loadCartCount = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        const cartItems = storedCart ? JSON.parse(storedCart) : [];
        setCartCount(cartItems.length);
      } catch (error) {
        console.error('Failed to load cart count from AsyncStorage:', error);
      }
    };

    loadMeals();
    loadCartCount();
  }, []);

  const clearCart = async () => {
    try {
      await AsyncStorage.removeItem('cart'); 
      setCartCount(0); 
      Alert.alert('Cart Cleared', 'Your cart has been successfully cleared.');
    } catch (error) {
      console.error('Failed to clear cart:', error);
      Alert.alert('Error', 'Failed to clear the cart. Please try again.');
    }
  };

  const handleAddToCart = async (meal) => {
    setCartCount(prevCount => prevCount + 1);
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const cartItems = storedCart ? JSON.parse(storedCart) : [];
      cartItems.push(meal);
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      Alert.alert('Item added!', `${meal.mealName} has been added to your cart.`);
    } catch (error) {
      console.error('Failed to add item to cart', error);
    }
  };

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.mealName && meal.mealName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || meal.courseType === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView/>
      <StatusBar style='light'/>
      <View style={styles.SplashCard}>
          
          {/* Background Video */}
          <Video
                   source={require('@/assets/Videos/Video-2.mp4')} 
                   style={styles.videoBackground}
                   resizeMode="cover"
                   shouldPlay
                   isLooping
                 />
                 </View>
      <View style={styles.overlay}>
    
        <View style={styles.headerContianer}>
        <View style={styles.header}>
      <TouchableOpacity onPress={()=> navigation.navigate('Splash')}>
        <Image source={require('@/assets/Icons/back.png')} style={{width: 34, height: 34}}/>
      </TouchableOpacity>
        <Text style={styles.headerText}>Available Meals</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={styles.receiptButton}>
          <Image source={require('@/assets/Icons/wallet.png')} style={{width: 34, height: 34}}/>
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>{cartCount}</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TextInput
        placeholder="Search Meals"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}>
          <Text style={filter === 'all' ? styles.filterTextActive : styles.filterText}>ALL</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('starter')} style={[styles.filterButton, filter === 'starter' && styles.filterButtonActive]}>
          <Text style={filter === 'starter' ? styles.filterTextActive : styles.filterText}>Starter</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('main')} style={[styles.filterButton, filter === 'main' && styles.filterButtonActive]}>
          <Text style={filter === 'main' ? styles.filterTextActive : styles.filterText}>Main</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilter('dessert')} style={[styles.filterButton, filter === 'dessert' && styles.filterButtonActive]}>
          <Text style={filter === 'dessert' ? styles.filterTextActive : styles.filterText}>Dessert</Text>
        </TouchableOpacity>
      </View>
        </View>
          </View>
          <View style={styles.averageView}>
  {filter === 'all' || filter === 'starter' ? (
    <Text style={styles.averageText}>Starter Average: R{averages.starter}</Text>
  ) : null}
  {filter === 'all' || filter === 'main' ? (
    <Text style={styles.averageText}>Main Meal Average: R{averages.main}</Text>
  ) : null}
  {filter === 'all' || filter === 'dessert' ? (
    <Text style={styles.averageText}>Dessert Average: R{averages.dessert}</Text>
  ) : null}
</View>
      
      <ScrollView HOR style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        {filteredMeals.map(meal => (
          <ImageBackground
          key={meal.id}
          source={{ uri: meal.image }}
          style={styles.card}
          imageStyle={styles.cardImageBackground}
        >
          <View style={styles.cardContent}>
            <Image source={{ uri: meal.image }} style={styles.image} />
            <Text style={styles.mealName}>{meal.mealName}</Text>
            <Text style={styles.courseType}>{meal.courseType}</Text>
            <Text style={styles.description}>{meal.description}</Text>
            <Text style={styles.price}>R{meal.price}</Text>
            <TouchableOpacity onPress={() => handleAddToCart(meal)} style={styles.addButton}>
              <Ionicons name="add-circle-outline" size={24} color="#A7AA6D" />
            </TouchableOpacity>
            </View>
            </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.CharlestoneGreen,
    top: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 26,
    marginTop: 20
  },
  headerText: {
    fontFamily: 'Cowra',
    fontSize: 24,
    color: Colors.Powder,
    
  },
  receiptButton: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    top: 1,
  },
  averageView: {
    bottom: '40%',
    backgroundColor: Colors.ArgileDarks, // Light background color for visibility
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  averageText: {
    fontFamily: 'Mollie',
    fontSize: 18, // Slightly larger font for visibility
    color: Colors.Powder, // Matches app theme
    fontWeight: 'bold',
    marginVertical: 5,
  },
  SplashCard: {
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    height: height * 0.3, 
    width: width * 1,
    overflow: 'hidden', 
    bottom: 50,
  },
  videoBackground: {
    position: "absolute",
    top: 0, 
    left: 0,
    width: width, 
    height: height * 0.3, 
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

  overlay: {
    padding: 20,
    position: 'relative',
    bottom: '36%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    height: '30.1%',
    width: '100%'
  },

  counterContainer: {
    backgroundColor: Colors.BunrtUmber,
    borderRadius: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  searchInput: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#333',
  },
  filterText: {
    color: '#666',
    fontSize: 14,
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  mealsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  scrollView: {
    bottom: '40%',
    paddingTop: 20,
    paddingBottom: 500,
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    gap: 30, 
  },
  card: {
    height: height * 0.45, 
    width: width * 0.9,   
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 6, 
    shadowColor: '#000', 
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20, 
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end', 
    padding: 20, // More padding for a spacious look
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly darker overlay
    borderRadius: 20, // Match the border of the card
  },
  mealName: {
    color: 'white',
    fontSize: 28, // Larger text for meal name
    fontWeight: 'bold',
  },
  courseType: {
    color: '#ccc',
    fontSize: 22, // Slightly larger font
    marginTop: 8,
  },
  description: {
    color: '#eee',
    fontSize: 16,
    marginTop: 8,
  },
  price: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  addButton: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  
});