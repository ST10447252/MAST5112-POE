import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/assets/components/Colors';

const serviceId = 'service_k1rbt3m';
const templateId = 'template_nd82mlh';
const publicKey = 'vj3FL8g88qk3H2KpU';

const Cart = ({ route }) => {
  const navigation = useNavigation();
  const { customerDetails, peopleNumber, customerName, phoneNumber, emailAddress, totalReservationPrice, reservationDate } = route.params || {};
  const [modalVisible, setModalVisible] = useState(false);
  const [cardModalVisible, setCardModalVisible] = useState(false);
  const [isPaymentSubmitted, setIsPaymentSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    cardHolderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [cardType, setCardType] = useState('');
  const [message, setMessage] = useState('');
  const [isReservationAvailable, setIsReservationAvailable] = useState(false);


  const isCartEmpty = cartItems.length === 0;
  const isProceedToPaymentDisabled = isPaymentSubmitted || isCartEmpty;

  useEffect(() => {
    setIsReservationAvailable(customerDetails ? true : false);
    
    const loadCartItems = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to load cart items', error);
      }
    };

    loadCartItems();
  }, [customerDetails]);

  const removeFromCart = async (meal) => {
    try {
      const updatedCart = cartItems.filter((item) => item.id !== meal.id);
      setCartItems(updatedCart);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      Alert.alert('Item removed!', `${meal.mealName} has been removed from your cart.`);
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const detectCardType = (cardNumber) => {
    const visaRegex = /^4/;
    const masterCardRegex = /^5[1-5]/;
    const amexRegex = /^3[47]/;
    const discoverRegex = /^6(?:011|5)/;

    if (visaRegex.test(cardNumber)) setCardType('Visa');
    else if (masterCardRegex.test(cardNumber)) setCardType('MasterCard');
    else if (amexRegex.test(cardNumber)) setCardType('American Express');
    else if (discoverRegex.test(cardNumber)) setCardType('Discover');
    else setCardType('');
  };

  const handlePayment = () => {
    if (!isCartEmpty) {
      console.log('Processing payment...');
      toggleModal();
      toggleCardModal();
    } else {
      Alert.alert('Cart is empty', 'Please add items to the cart before proceeding to payment.');
    }
  };

  const handleCardSubmit = () => {
    if (!cardDetails.cardHolderName || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvv) {
      Alert.alert('Payment Error', 'Please fill in all the card details.');
      return;
    }
    if (cardDetails.cardNumber.length !== 16) {
      Alert.alert('Payment Error', 'Card number must be exactly 16 digits.');
      return;
    }

    const expiryParts = cardDetails.expiryDate.split('/');
    if (expiryParts.length !== 2 || isNaN(expiryParts[0]) || isNaN(expiryParts[1]) || expiryParts[0] < 1 || expiryParts[0] > 12 || expiryParts[1].length !== 2) {
      Alert.alert('Payment Error', 'Please enter a valid expiry date (MM/YY).');
      return;
    }

    const month = parseInt(expiryParts[0], 10);
    const year = parseInt(`20${expiryParts[1]}`, 10);
    const today = new Date();
    const expiryDate = new Date(year, month - 1);

    if (expiryDate < today) {
      Alert.alert('Payment Error', 'Your card has expired.');
      return;
    }
  
    // If all checks pass:
    Alert.alert('Payment Successful', 'Your payment has been processed!', [
      {
        text: 'OK',
        onPress: () => {
          resetCardDetails();
          setIsPaymentSubmitted(true);
          navigation.navigate('Home');
        },
      },
    ]);
  
    toggleCardModal();


    const templateParams = {
      from_name: customerName,
      emailAddress: emailAddress,
      to_name: 'Chef',
      message: message,
      number_people: peopleNumber,
      reservation_price: totalReservationPrice,
      phone_number: phoneNumber,
      reservationDate: reservationDate,

    };

    fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost', // Update with your production URL
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          Alert.alert('Success', 'Email sent successfully!');
          setMessage('');
        } else {
          Alert.alert('Error', 'Failed to send email.');
        }
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        Alert.alert('Error', 'An error occurred while sending email.');
      });
  };
  const resetCardDetails = () => {
    setCardDetails({
      cardHolderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    });
    setCardType('');
    setCartItems([]);
  };

  const toggleModal = () => setModalVisible(!modalVisible);
  const toggleCardModal = () => setCardModalVisible(!cardModalVisible);
  



  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView/>
      <ScrollView style={styles.scrollview}>
        <Text style={styles.title}>Your Cart</Text>
        {isCartEmpty ? (
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        ) : (
          cartItems.map((meal, index) => (
            <View key={index} style={styles.cartItem}>
              <ImageBackground
          key={meal.id}
          source={{ uri: meal.image }}
          style={styles.card}
          imageStyle={styles.cardImageBackground}
        >
              <View style={styles.mealDetails}>
                <Text style={styles.mealName}>{meal.mealName}</Text>
                <Text>style={styles.description}{meal.description}</Text>
                <Text style={styles.mealPrice}>R{meal.price}.00</Text>
                <Button title="Remove" onPress={() => removeFromCart(meal)} />
              </View>
              </ImageBackground>
            </View>
          ))
        )}
        </ScrollView>
        

        <Text style={styles.title}>Reservation Summary</Text>
        {isReservationAvailable ? (
          <>
            <Text style={styles.detailText}>Reserved by: {customerDetails.customerName}</Text>
            <Text style={styles.detailText}>Phone Number: {customerDetails.phoneNumber}</Text>
            <Text style={styles.detailText}>Email: {customerDetails.emailAddress}</Text>
            <Text style={styles.detailText}>Number of People: {peopleNumber}</Text>
            <Text style={styles.detailText}>Total Reservation Price: R{totalReservationPrice}</Text>
            {reservationDate && (
               <Text style={styles.text}>Reservation Date: {new Date(reservationDate).toLocaleDateString()}</Text>
            )}
          </>
        ) : (
          <Text style={styles.detailText}>No reservation details available.</Text>
        )}
        <TextInput
          style={styles.textArea}
          placeholderTextColor={Colors.Powder}
          placeholder="Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Reservation')}>
          <Text style={styles.buttonText}>Reservation</Text>
        </TouchableOpacity>



        <TouchableOpacity
          style={[
            styles.button,
            !isReservationAvailable || isCartEmpty ? styles.disabledButton : {},
          ]}
          disabled={!isReservationAvailable || isCartEmpty}
          onPress={() => {
            if (!isReservationAvailable || isCartEmpty) {
              return;
            }
            toggleModal();
          }}
        >
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>



      {/* Payment Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={toggleModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Reservation Summary</Text>
            <Text style={styles.modalText}>Total Price: R{totalReservationPrice}</Text>
            <TouchableOpacity style={styles.button} onPress={toggleCardModal}>
              <Text style={styles.buttonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

            {/* Payment Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={toggleModal} // Close modal on back button press (Android)
      >
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={toggleModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Payment</Text>
            <Text style={styles.modalText}>Total Amount: R{totalReservationPrice}</Text>

            <Text style={styles.modalText}>Choose Payment Method:</Text>
            <TouchableOpacity style={styles.button} onPress={handlePayment}>
              <Text style={styles.buttonText}>Credit/Debit Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} disabled>
              <Text style={styles.buttonText}>PayPal (Coming Soon)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal 
        visible={cardModalVisible} 
        transparent={true}
        onRequestClose={toggleCardModal}
        animationType="slide"
      >
        <TouchableOpacity
          style={styles.modalBackground} 
          activeOpacity={1} 
          onPressOut={toggleCardModal}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Card Details</Text>
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              value={cardDetails.cardHolderName}
              onChangeText={(text) => setCardDetails({ ...cardDetails, cardHolderName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              value={cardDetails.cardNumber}
              onChangeText={(text) => {
                setCardDetails({ ...cardDetails, cardNumber: text });
                detectCardType(text); // Detect card type when card number changes
              }}
              keyboardType="numeric"
              maxLength={16}
            />

            {cardType ? (
              <View style={styles.cardTypeContainer}>
                <Text style={styles.cardTypeText}>Detected Card Type: {cardType}</Text>
                {cardType === 'Visa' }
                {cardType === 'MasterCard' }
                {cardType === 'American Express' }
                {cardType === 'Discover' }
              </View>
            ) : null}

            <TextInput
              style={styles.input}
              placeholder="Expiry Date (MM/YY)"
              value={cardDetails.expiryDate}
              onChangeText={(text) => setCardDetails({ ...cardDetails, expiryDate: text })}
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="CVV"
              value={cardDetails.cvv}
              onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={handleCardSubmit}>
              <Text style={styles.buttonText}>Submit Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleCardModal}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
          </TouchableOpacity>
        </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.CharlestoneGreen,
  },
  title: {
    color: Colors.Powder,
    fontFamily: 'Cowra',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'gray',
    marginVertical: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  mealDetails: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  mealName: {
    color: Colors.Powder,
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealPrice: {
    color: Colors.Powder,
    fontSize: 16,
  },
  detailText: {
    color: Colors.Powder,
    fontSize: 16,
    marginBottom: 8,
  },

  scrollview: {
    top: 10,
  },
  
  input: {
    height: 40,
    length: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: Colors.Fog,
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontFamily: 'Poppins',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  textArea: { 
    marginVertical: 10, 
    padding: 10, 
    borderColor: 'gray', 
    borderWidth: 1, 
    borderRadius: 8, 
    minHeight: 60 
  },
  
});

export default Cart;
