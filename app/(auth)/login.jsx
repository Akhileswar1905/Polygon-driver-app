import {
  View,
  Text,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { images } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
const Login = () => {
  const [phonenumber, setPhonenumber] = useState({
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClick = async () => {
    console.log(phonenumber);
    if (!phonenumber.phoneNumber) {
      Alert.alert("Error", "Fill in all the required information");
    }
    await AsyncStorage.setItem("phoneNumber", `${phonenumber.phoneNumber}`);
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/auth",
        {
          phoneNumber: `${phonenumber.phoneNumber}`,
        }
      );
      console.log(res.data);
      if (res.status === 200) {
        router.push("/otp");
      }
    } catch (error) {
      console.log(error.message);
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          {/* Logo */}
          <Image
            source={images.logo}
            className="w-[150px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-3xl font-psemibold mt-5">Log in</Text>

          <FormField
            title="Phone Number"
            handleOnChangeText={(text) => {
              setPhonenumber({ ...phonenumber, phoneNumber: text });
              console.log(phonenumber);
            }}
            otherStyles={"mt-7"}
            value={phonenumber.phoneNumber}
            keyBoardType="numeric"
          />

          <CustomButton
            title={"Send OTP"}
            handleOnPress={() => handleClick()}
            btnStyles={"mt-7"}
            onLoading={isSubmitting}
          />
          <View className="w-full items-center justify-center mt-3">
            <Text className="text-base">
              Don't have an account?{" "}
              <Text
                className="text-blue-500"
                onPress={() => router.push("/signup")}
              >
                Click Here
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Login;
