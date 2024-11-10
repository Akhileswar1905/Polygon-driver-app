import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
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
    if (
      user.username === "" ||
      user.phoneNumber === "" ||
      user.email === "" ||
      user.dob === ""
    ) {
      alert("Error", "Please fill all fields");
      return;
    }

    const res = await AsyncStorage.setItem("user", JSON.stringify(user));
    console.log(res);
    router.push("/signup2");
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full min-h-[85vh] justify-center my-6 px-4">
          <View>
            <Text className="text-2xl font-medium mt-5 text-center">
              Welcome to DriverSync
            </Text>
            <Text className="text-lg text-gray-500 mt-5 text-center">
              Let's start with you info
            </Text>
          </View>

          <View className="gap-4 mt-9 m-2">
            <FormField
              otherStyles={"mt-9"}
              title="User Name"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  username: text,
                });
              }}
              placeHolder={"Enter your full name"}
            />
            <FormField
              otherStyles={"mt-9"}
              title="Phone Number"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  phoneNumber: text,
                });
              }}
              placeHolder={"Enter your phone number"}
            />
            <FormField
              otherStyles={"mt-9"}
              title="Email Address"
              handleOnChangeText={(text) => {
                console.log(user);
                setUser({
                  ...user,
                  email: text,
                });
              }}
              placeHolder={"Enter your email address"}
            />
            <FormField
              otherStyles={"mt-9"}
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
          </View>

          <CustomButton
            title={"Next"}
            btnStyles={"w-[95%] self-center mt-9"}
            handleOnPress={() => handleNext()}
          />
          <View className="w-full items-center justify-center mt-3">
            <Text className="text-base">
              Already have an account?{" "}
              <Text
                className="text-[#3d6dfe]"
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
