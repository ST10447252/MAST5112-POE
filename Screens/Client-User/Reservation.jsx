import { Colors } from '@/assets/components/Colors';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const Reservation = () => {
  const navigation = useNavigation(); // Initialize navigation
  const [openReservationModal, setOpenReservationModal] = useState(false);
  const [seatPrice, setSeatPrice] = useState(20);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    phoneNumber: '',
    emailAddress: '',
    peopleNumber: '',
  });

  const toggleReservationModal = () => setOpenReservationModal(!openReservationModal);

  const handleInputChange = (name, value) => {
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const validateInputs = () => {
    const { customerName, phoneNumber, emailAddress, peopleNumber } = customerDetails;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (Object.values(customerDetails).some((field) => typeof field === 'string' && field.trim() === '')) {
      Alert.alert('Error', 'Please fill in all fields.');
      return false;
    }

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits.');
      return false;
    }

    if (!emailRegex.test(emailAddress)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return false;
    }

    return true;
  };

  const handleContinueToPayment = () => {
    if (validateInputs()) {
      const totalReservationPrice = seatPrice * Number(customerDetails.peopleNumber);
      navigation.navigate('Cart', {
        customerDetails,
        peopleNumber: customerDetails.peopleNumber,
        customerName: customerDetails.customerName,
        phoneNumber: customerDetails.phoneNumber,
        emailAddress: customerDetails.emailAddress,
        totalReservationPrice,
        reservationDate: selectedDate,
      });
      toggleReservationModal();
    }
  };

  const onDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <StatusBar style="dark" />
      <Text style={styles.title}>Make a Reservation</Text>

      <TouchableOpacity style={styles.button} onPress={toggleReservationModal}>
        <Text style={styles.buttonText}>Make Reservation</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={openReservationModal}
        onRequestClose={toggleReservationModal}
      >
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={toggleReservationModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Table Reservation</Text>

            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.Pewter}
              placeholder="Customer Name"
              value={customerDetails.customerName}
              onChangeText={(text) => handleInputChange('customerName', text)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.Pewter}
              placeholder="Phone Number"
              keyboardType="numeric"
              maxLength={10}
              value={customerDetails.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.Pewter}
              placeholder="Email Address"
              value={customerDetails.emailAddress}
              onChangeText={(text) => handleInputChange('emailAddress', text)}
            />
            <TextInput
              style={styles.input}
              placeholderTextColor={Colors.Pewter}
              placeholder="Number of People"
              keyboardType="numeric"
              value={customerDetails.peopleNumber}
              onChangeText={(text) => handleInputChange('peopleNumber', text)}
            />

            <Calendar
              current={new Date().toISOString().split('T')[0]}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#FF6347' },
              }}
              onDayPress={onDateSelect}
              monthFormat={'yyyy MM'}
              hideArrows={false}
            />

            {selectedDate && <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleContinueToPayment}>
              <Text style={styles.buttonText}>Continue to Payment</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.Powder,
  },
  title: {
    fontFamily: 'Mollie',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  reservationInfo: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 20,
  },
  reservationInfoText: {
    fontFamily: 'Mollie',
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: Colors.Arsenic,
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontFamily: 'Mollie',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  selectedDateText: {
    fontSize: 16,
    marginVertical: 15,
    color: Colors.CharlestoneGreen,
    textAlign: 'center',
  },
});

export default Reservation;
