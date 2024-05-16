import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewTrip = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${day}-${month}-${year}`;
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      try {
        const res = await axios.get(
          `https://polygon-project.onrender.com/driver/${phoneNumber}`
        );
        setUser(res.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  });

  const [loading, setLoading] = useState(false);
  if (user?.contractDetails.length === 0) setLoading(true);
  const currentContract =
    user?.contractDetails[user?.contractDetails.length - 1].contractId;
  const [trip, setTrip] = useState({
    tripId: "",
    tripDate: formattedDate,
    tripTime: formattedTime,
    contractId: currentContract,
    phoneNumber: user?.phoneNumber,
  });
  console.log(trip);

  const handlePress = async () => {
    try {
      const res = await axios.put(
        "https://polygon-project.onrender.com/driver/trip",
        trip
      );
      if (res.status === 200) {
        Alert.alert("Success", "Trip added successfully");
        setTrip({
          tripId: "",
          tripDate: formattedDate,
          tripTime: formattedTime,
          contractId: currentContract,
          phoneNumber: user.phoneNumber,
        });
        router.push("/trips");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          <Text className="text-3xl font-semibold">New Trip</Text>

          <FormField
            title={"Enter the Trip ID"}
            otherStyles={"mt-7"}
            value={trip.tripId}
            handleOnChangeText={(e) => setTrip({ ...trip, tripId: e })}
          />

          <CustomButton
            title={"Add Trip"}
            btnStyles={"mt-7"}
            handleOnPress={() => handlePress()}
            onLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewTrip;
