import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
const Login = () => {
  const [phonenumber, setPhonenumber] = useState({
    phoneNumber: "",
  });

  const [status, setStatus] = useState("");
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    console.log(phonenumber);
    if (!phonenumber.phoneNumber) {
      Alert.alert("Error", "Fill in all the required information");
      return;
    }

    if (phonenumber.phoneNumber.length < 10) {
      Alert.alert("Error", "Enter a valid phone number");
      return;
    }

    await AsyncStorage.setItem("phoneNumber", `${phonenumber.phoneNumber}`);
    await AsyncStorage.setItem("verified", "false");
    // router.push("/otp");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/auth",
        {
          phoneNumber: `${phonenumber.phoneNumber}`,
        }
      );
      console.log("Res", res.data);
      if (
        res.data.message === "Request Pending" ||
        res.data.message === "Request Rejected"
      ) {
        setShow(true);
        setStatus(res.data.message);

        console.log(res.data);
        setIsSubmitting(false);
      } else if (res.status === 200) {
        await AsyncStorage.setItem("token", `${res.data.id}`);
        router.push("/otp");

        setPhonenumber({
          phoneNumber: "",
        });
      }
    } catch (error) {
      console.log("Error:", error.message);

      setShow(true);
      setStatus(error.message);
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="h-full">
      <StatusBar />
      <ScrollView>
        <View className="w-full m-h-[100vh] px-4 flex-1 items-center justify-center">
          <View className="flex w-full">
            <Text className="text-2xl font-psemibold mt-9 text-gray-800 capitalize mx-2">
              Enter phone number for verification
            </Text>
            <Text className="text-sm text-gray-500 m-2">
              We will send you a one time password (OTP) to verify your phone
              number
            </Text>
          </View>
          <KeyboardAvoidingView className={"w-full"}>
            <FormField
              label="Phone Number"
              placeholder="Enter your phone number"
              keyBoardType="number-pad"
              value={phonenumber.phoneNumber}
              handleOnChangeText={(text) =>
                setPhonenumber({ ...phonenumber, phoneNumber: text })
              }
            />

            {show && (
              <Text className="text-base text-red-600 text-center mt-7">
                {status}
              </Text>
            )}

            <CustomButton
              title={"Continue"}
              btnStyles={"w-full mt-7"}
              handleOnPress={handleClick}
              onLoading={isSubmitting}
            />
            <View>
              <Text className="text-center mt-4 text-gray-800 text-base">
                Don't have an account?{" "}
                <Text
                  className="text-blue-500"
                  onPress={() => router.push("/signup")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
