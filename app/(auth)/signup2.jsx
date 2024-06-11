import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

// /Function to validate Aadhar Number
function validateAadharNumber(aadharNumber) {
  if (!/^\d{12}$/.test(aadharNumber)) {
    return false;
  }

  const zeroCount = (aadharNumber.match(/0/g) || []).length;
  if (zeroCount > 4) {
    return false;
  }

  return true;
}

// Function to validate PAN Number
function validatePAN(panNumber) {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  if (!panRegex.test(panNumber)) {
    return false;
  }

  const allowedFourthChars = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  if (!allowedFourthChars.includes(panNumber[3])) {
    return false;
  }

  return true;
}

// Function to validate IFSC Code
function validateIFSC(ifscCode) {
  // Regular expression for IFSC code format
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifscCode);
}

// Function to validate Bank Account Number
function validateBankAccountNumber(accountNumber) {
  // Check if the account number is between 9 and 18 digits long
  const accountNumberRegex = /^\d{9,18}$/;
  return accountNumberRegex.test(accountNumber);
}

const SignUp2 = () => {
  const [user, setUser] = useState({
    Aadhar: "",
    PAN: "",
    AccNumber: "",
    IFSC: "",
    vehicleNumber: "",
  });
  useEffect(() => {
    const getUser = async () => {
      const res = await AsyncStorage.getItem("user");
      setUser({
        ...user,
        ...JSON.parse(res),
      });
    };
    getUser();
  }, []);

  const handleNext = async () => {
    if (
      user.Aadhar === "" ||
      user.PAN === "" ||
      user.AccNumber === "" ||
      user.IFSC === "" ||
      user.vehicleNumber === ""
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (!validateAadharNumber(user.Aadhar)) {
      Alert.alert("Error", "Please enter a valid Aadhar Number");
      return;
    }

    if (!validatePAN(user.PAN)) {
      Alert.alert("Error", "Please enter a valid PAN Number");
      return;
    }

    if (!validateBankAccountNumber(user.AccNumber)) {
      Alert.alert("Error", "Please enter a valid Bank Account Number");
      return;
    }

    if (!validateIFSC(user.IFSC)) {
      Alert.alert("Error", "Please enter a valid IFSC Code");
      return;
    }

    const res = await AsyncStorage.setItem("user", JSON.stringify(user));
    router.push("/signup3");
  };

  console.log(user);
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          <View>
            <Text className="text-2xl font-medium mt-5 text-center">
              Welcome to DriverSync
            </Text>
            <Text className="text-lg text-gray-500 mt-5 text-center">
              Okay! Let's get to know you better.
            </Text>
          </View>
          <View>
            <FormField
              otherStyles={"mt-9"}
              title="Aadhar Card Number"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  Aadhar: text,
                });
              }}
            />
            <FormField
              otherStyles={"mt-9"}
              title="PAN"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  PAN: text,
                });
              }}
            />
            <FormField
              otherStyles={"mt-9"}
              title="Bank Account Number"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  AccNumber: text,
                });
              }}
            />
            <FormField
              otherStyles={"mt-9"}
              title="IFSC"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  IFSC: text,
                });
              }}
            />
            <FormField
              otherStyles={"mt-9"}
              title="Vehicle Number"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  vehicleNumber: text,
                });
              }}
            />
          </View>
          <CustomButton
            title={"Next"}
            btnStyles={"w-full mt-9"}
            handleOnPress={() => handleNext()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp2;
