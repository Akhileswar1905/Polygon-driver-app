import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";

const SignUp2 = () => {
  const [user, setUser] = useState({
    AccNumber: "",
    DrivingLicense: "",
    email: "",
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
    const res = await AsyncStorage.setItem("user", JSON.stringify(user));
    router.push("/signup3");
  };

  console.log(user);
  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          <Image
            source={images.logo}
            className="w-[150px] h-[35px]"
            resizeMode="contain"
          />
          <Text className="text-3xl font-psemibold mt-5">Sign Up</Text>
          <FormField
            otherStyles={"mt-7"}
            title="Email"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                email: text,
              });
            }}
          />
          <FormField
            otherStyles={"mt-7"}
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
            otherStyles={"mt-7"}
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
            otherStyles={"mt-7"}
            title="Driving License"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                DrivingLicense: text,
              });
            }}
          />

          <FormField
            otherStyles={"mt-7"}
            title="Vehicle Number"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                vehicleNumber: text,
              });
            }}
          />
          <CustomButton
            title={"Next"}
            btnStyles={"w-full mt-7"}
            handleOnPress={() => handleNext()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp2;
