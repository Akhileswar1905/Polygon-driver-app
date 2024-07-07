import { View, Text, ScrollView, Alert, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewTrip = () => {
  const currentDate = new Date();
  const yesterday = new Date(currentDate);
  yesterday.setDate(currentDate.getDate() - 1);
  const dayBeforeYesterday = new Date(currentDate);
  dayBeforeYesterday.setDate(currentDate.getDate() - 2);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contractId, setContractId] = useState("");
  const [payPerRide, setPayPerRide] = useState("");
  const [tripDate, setTripDate] = useState(currentDate);
  const [tripTime, setTripTime] = useState(currentDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [trip, setTrip] = useState({
    tripId: "",
    tripDate: formatDate(currentDate),
    tripTime: formatTime(currentDate),
    contractId: "",
    phoneNumber: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const ph = await AsyncStorage.getItem("phoneNumber");
      if (!ph) {
        <Redirect href={"/"} />;
      }
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
        tripDate: formatDate(tripDate),
        tripTime: formatTime(tripTime),
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
          tripDate: formatDate(currentDate),
          tripTime: formatTime(currentDate),
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

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || tripDate;
    setShowDatePicker(Platform.OS === "ios");
    setTripDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || tripTime;
    setShowTimePicker(Platform.OS === "ios");
    setTripTime(currentTime);
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          <Text className="text-3xl font-semibold">New Trip</Text>

          <Text className="mt-7 text-black-100 font-pmedium text-base">
            Select Trip Date:
          </Text>
          <CustomButton
            title={formatDate(tripDate)}
            btnStyles={"mt-7 bg-transparent  border"}
            textStyles={"text-black"}
            handleOnPress={() => setShowDatePicker(true)}
          />
          {showDatePicker && (
            <DateTimePicker
              value={tripDate}
              mode="date"
              display="default"
              maximumDate={currentDate}
              minimumDate={dayBeforeYesterday}
              onChange={handleDateChange}
            />
          )}

          <Text className="mt-7 text-black-100 font-pmedium text-base">
            Select Trip Time:
          </Text>
          <CustomButton
            title={formatTime(tripTime)}
            btnStyles={"mt-7 bg-transparent  border"}
            textStyles={"text-black"}
            handleOnPress={() => setShowTimePicker(true)}
          />
          {showTimePicker && (
            <DateTimePicker
              value={tripTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

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
