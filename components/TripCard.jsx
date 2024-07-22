import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { icons, images } from "../constants";
import axios from "axios";

const TripCard = ({ trip, otherStyles }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { tripID, tripTime, phoneNumber, tripDate, status } = trip.item;
  const [updatedTrip, setUpdatedTrip] = useState({
    tripId: tripID,
    tripID: tripID,
    tripTime: tripTime,
    tripDate: tripDate,
    phoneNumber: phoneNumber,
  });

  const handleEdit = async () => {
    try {
      console.log("Handle Edit");

      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/update-trip",
        updatedTrip
      );
      console.log(res);
      setModalVisible(false);
    } catch (error) {
      console.log("Error occurred:", error);
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };
  console.log(trip.item);
  const openModal = async () => {
    if (status === "allowed") {
      setModalVisible(true);
    } else {
      const data = {
        trip: trip.item,
        cpId: trip.user,
        phoneNumber: phoneNumber,
      };

      console.log("Sending data:", data);

      const res = await axios.post(
        "https://polygon-project.onrender.com/cp/update-request",
        data
      );

      console.log("Response:", res);

      if (res.status === 200) {
        Alert.alert("Message", "Edit request for trip sent to Control Panel");
      } else {
        Alert.alert("Error", `Unexpected response status: ${res.status}`);
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={[styles.tripCard, otherStyles]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={icons.Taxi} style={styles.taxiIcon} />
          <Text>{updatedTrip.tripId}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={openModal}>
            <Image source={icons.edit} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.tripTime}>{updatedTrip.tripTime}</Text>
          <Text style={styles.tripDate}>{updatedTrip.tripDate}</Text>
          {trip.item.status === "allowed" && (
            <Text className="text-green-600">Edit Access is allowed</Text>
          )}
        </View>
      </View>
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Trip</Text>
            <TextInput
              style={styles.input}
              placeholder={tripID}
              onChangeText={(text) =>
                setUpdatedTrip({
                  ...updatedTrip,
                  tripId: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder={tripTime}
              onChangeText={(text) =>
                setUpdatedTrip({
                  ...updatedTrip,
                  tripTime: text,
                })
              }
            />
            <TextInput
              style={styles.input}
              placeholder={tripDate}
              onChangeText={(text) => {
                setUpdatedTrip({
                  ...updatedTrip,
                  tripDate: text,
                });
                console.log(updatedTrip);
              }}
            />
            <TouchableOpacity style={styles.button} onPress={handleEdit}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  tripCard: {
    margin: 12,
    borderRadius: 10,
    backgroundColor: "#eee0e0",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  taxiIcon: {
    width: 33,
    height: 33,
    marginRight: 8,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  body: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tripTime: {
    fontSize: 18,
    fontWeight: "600",
  },
  tripDate: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  button: {
    width: "100%",
    height: 40,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TripCard;
