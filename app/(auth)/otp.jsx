import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalContext";

const otp = () => {
  const [token, setToken] = useState(null);
  const [id, setId] = useState(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [otp, setOtp] = useState({
    OTP: "",
  });

  const { setUser, setIsLoggedIn } = useGlobalContext();

  useEffect(() => {
    const getToken = async () => {
      const x = await AsyncStorage.getItem("phoneNumber");
      const y = await AsyncStorage.getItem("token");
      setToken(x);
      setId(y);
    };
    getToken();
  }, []);

  const handleResend = async () => {
    // await AsyncStorage.setItem("phoneNumber", `${phonenumber}`);
    await AsyncStorage.setItem("verified", "false");
    router.push("/otp");

    setisSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5050/driver/auth", {
        phoneNumber: `${token}`,
      });
      console.log(res.data);
      if (res.status === 200) {
        console.log("OTP is Resent Sent");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleVerification = async () => {
    if (!otp.OTP) {
      Alert.alert("Please enter the OTP");
      return;
    }

    if (otp.OTP.length < 4) {
      Alert.alert("Please enter a valid OTP");
      return;
    }
    setisSubmitting(true);
    try {
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/auth/verify",
        {
          OTP: otp.OTP,
          phoneNumber: token,
          id: id,
        }
      );

      console.log(res.data);
      if (res.status === 200) {
        setUser(res.data.driver);
        setIsLoggedIn(true);
        await AsyncStorage.setItem("verified", "true");
        router.push("/home");
      }
    } catch (error) {
      console.log(error.message);
      setisSubmitting(false);
    }
  };

  console.log("Token", id);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full m-h-[100vh] px-4 flex-1 items-center justify-center">
          <View className="flex w-full">
            <Text className="text-2xl font-psemibold mt-9 text-gray-800 capitalize mx-2 text-center">
              Please Enter the <Text className="uppercase">OTP</Text>
            </Text>
            <Text className="text-sm text-gray-500 m-2">
              We have sent you a one time password (OTP) to verify your phone
              number
            </Text>
            <Text className="text-sm text-gray-500 m-2">
              OTP Sent To +91 {token}
            </Text>
          </View>
          <KeyboardAvoidingView className={"w-full"}>
            <FormField
              placeholder="Enter the OTP"
              keyBoardType="number-pad"
              value={otp.OTP}
              handleOnChangeText={(text) => setOtp({ ...otp, OTP: text })}
            />

            <CustomButton
              title={"Verify"}
              btnStyles={"w-full mt-7"}
              handleOnPress={handleVerification}
              onLoading={isSubmitting}
            />
            <View className="mx-2 mt-5 flex-row">
              <Text>Didn't receive the OTP? </Text>
              <TouchableOpacity onPress={handleResend}>
                <Text className="text-blue-500">Resend</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default otp;
