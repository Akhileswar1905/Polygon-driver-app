import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignUp = () => {
  const [user, setUser] = useState({
    username: "",
    phoneNumber: "",
    email: "",
    dob: "",
  });

  const handleNext = async () => {
    const res = await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log(res);
    router.push("/signup2");
  };

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
            title="User Name"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                username: text,
              });
            }}
          />
          <FormField
            otherStyles={"mt-7"}
            title="Phone Number"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                phoneNumber: text,
              });
            }}
          />
          <FormField
            otherStyles={"mt-7"}
            title="Date of Birth"
            placeHolder={"dd/mm/yyyy"}
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                dob: text,
              });
            }}
          />
          <FormField
            otherStyles={"mt-7"}
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
            otherStyles={"mt-7"}
            title="PAN"
            handleOnChangeText={(text) => {
              console.log(user);
              setUser({
                ...user,
                PAN: text,
              });
            }}
          />
          <CustomButton
            title={"Next"}
            btnStyles={"w-full mt-7"}
            handleOnPress={() => handleNext()}
          />
          <View className="w-full items-center justify-center mt-3">
            <Text className="text-base">
              Already have an account?{" "}
              <Text
                className="text-blue-500"
                onPress={() => router.push("/login")}
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

export default SignUp;
