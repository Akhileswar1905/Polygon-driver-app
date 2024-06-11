import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contractId, setContractId] = useState("");
  const [payPerRide, setPayPerRide] = useState("");

  const [trip, setTrip] = useState({
    tripId: "",
    tripDate: formattedDate,
    tripTime: formattedTime,
    contractId: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const ph = await AsyncStorage.getItem("phoneNumber");
      setPhoneNumber(ph);
      try {
        const res = await axios.get(
          `https://polygon-project.onrender.com/driver/${ph}`
        );
        setUser(res.data);
        if (res.data.contractDetails.length === 0) {
          setLoading(true);
        } else {
          const latestContractId =
            res.data.contractDetails[res.data.contractDetails.length - 1]
              .companyId;
          const pay =
            res.data.contractDetails[res.data.contractDetails.length - 1]
              .payPerRide;
          setContractId(latestContractId);
          setPayPerRide(pay);
          setTrip((prevTrip) => ({
            ...prevTrip,
            contractId: latestContractId,
            phoneNumber: ph,
            payPerRide: pay,
          }));
          console.log(trip);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, []);

  const handlePress = async () => {
    try {
      if (trip.tripId === "") {
        Alert.alert("Error", "Please fill all the fields");
        return;
      }

      const updatedTrip = {
        ...trip,
        tripDate: formattedDate,
        tripTime: formattedTime,
        contractId: contractId,
        phoneNumber: phoneNumber,
        payPerRide: payPerRide,
      };

      setLoading(true);
      console.log("trip:", updatedTrip);

      const res = await axios.put(
        "https://polygon-project.onrender.com/driver/trip",
        updatedTrip
      );
      if (res.status === 200) {
        Alert.alert("Success", "Trip added successfully");
        setTrip({
          tripId: "",
          tripDate: formattedDate,
          tripTime: formattedTime,
          contractId: contractId,
          phoneNumber: phoneNumber,
          payPerRide: payPerRide,
        });
        router.push("/trips");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
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
            handleOnPress={handlePress}
            onLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewTrip;
