import { View, Text, ScrollView, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { images } from "../../constants";
import axios from "axios";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalContext";

const otp = () => {
  const [token, setToken] = useState(null);
  const [isSubmitting, setisSubmitting] = useState(false);
  const [otp, setOtp] = useState({
    OTP: "",
  });

  const { setUser, setIsLoggedIn } = useGlobalContext();

  useEffect(() => {
    const getToken = async () => {
      const x = await AsyncStorage.getItem("phoneNumber");
      setToken(x);
    };
    getToken();
  }, []);

  const handleVerification = async () => {
    if (!otp.OTP) {
      Alert.alert("Please enter the OTP");
    }
    setisSubmitting(true);
    try {
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/auth/verify",
        {
          OTP: otp.OTP,
          phoneNumber: token,
        }
      );

      console.log(res.data);
      if (res.status === 200) {
        setUser(res.data.driver);
        setIsLoggedIn(true);
        router.push("/home");
      }
    } catch (error) {
      console.log(error.message);
      setisSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full min-h-[80vh] justify-center my-6 px-4">
          <Image
            source={images.logo}
            className="w-[150px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="w-full text-2xl mt-5 font-psemibold">
            Phone Number Verification
          </Text>

          <FormField
            title={"OTP"}
            keyBoardType={"numeric"}
            handleOnChangeText={(e) => {
              setOtp({ ...otp, OTP: e });
            }}
            value={otp.OTP}
            otherStyles={"mt-7"}
          />

          <CustomButton
            title={"Submit"}
            btnStyles={"mt-7"}
            handleOnPress={() => handleVerification()}
            onLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default otp;
