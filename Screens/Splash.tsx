import React, { useState } from 'react';
import { Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Platform, FlatList, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';  // Import Video from expo-av
import { Colors } from '@/assets/components/Colors';

const { width, height } = Dimensions.get('window');


const Splash = () => {
  const navigation = useNavigation();
  const [visibleVideo, setVisibleVideo] = useState(null);

  // Lazy loading handler for videos
  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisible = viewableItems[0];
      setVisibleVideo(firstVisible.item.id);  // Set the visible video ID
    }
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

  return (
      <View style={styles.container}>
        <SafeAreaView />
        <StatusBar style="Dark" />
        <View style={styles.WelcomeSection}>
          <Text style={styles.WelcomeText}>Heritage Grove.</Text>
        </View>

        <View style={styles.SplashCard}>
        {/* Background Video */}
        <Video
          source={require('@/assets/Videos/Video-1.mp4')}  // Your background video
          style={styles.videoBackground}
          resizeMode="cover"
          shouldPlay
          isLooping
        />

        <View style={styles.Idiom1}>

        </View>

        <View style={styles.Idiom2}>

        </View>

        

        
        
        
      </View>
<View style={styles.bottomtabcontainer}>
<View style={styles.bottomtab}>
<TouchableOpacity onPress={() => navigation.navigate('Menu')} style={styles.menuButton}>
          <Text style={styles.prompt}>Tap to View Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chefbutton} onPress={() => navigation.navigate('Login')}>
          <Image
            source={require("../assets/Icons/chefbutton.png")}
            style={{ width: 50, height: 50 }}
          />
        </TouchableOpacity>
</View>
</View>

        
      </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Powder,
    paddingTop: Platform.OS === 'android' ? 30 : 30,
  },
  WelcomeSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
  },
  WelcomeText: {
    fontSize: 30,
    color: Colors.Alien,
    fontFamily: 'Mollie',
  },
  chefbutton: {
  },
  SplashCard: {
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', 
    borderRadius: 50,
    height: height * 0.6, 
    width: width * 0.9, 
    overflow: 'hidden', 
  },
  Idiom1: {
    padding: 40,
    backgroundColor: Colors.Powder,
    position: 'absolute',
    top: '80%',
    width: '60%',
    right: '70%',
    height: '30%',
    borderRadius: 40,
  },
  Idiom2: {
    padding: 40,
    backgroundColor: Colors.Powder,
    position: 'absolute',
    bottom: '80%',
    width: '60%',
    left: '70%',
    height: '30%',
    borderRadius: 40,
  },


  videoBackground: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
 
  card: {
    backgroundColor: 'black',
    width: width * 0.7,
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    height: 300,  
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: Colors.ArgileDark,
    width: '60%',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    left: '20%'
    
  },
  prompt: {
    color: Colors.Powder,
    fontFamily: 'Helvetica',
    fontSize: 15,
  },



  bottomtab: {
    top: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 40,
    flexDirection: 'row',
    padding: 20,
    right: '5%'
    
  },
  
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  videoTitle: {
    color: 'white',
    textAlign: 'center',
    padding: 10,
    fontWeight: 'bold',
  },
});
