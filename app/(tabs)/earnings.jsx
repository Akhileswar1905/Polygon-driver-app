import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";

const Earnings = () => {
  return (
    <SafeAreaView className=" h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className=" items-center justify-center">
          <Image
            source={images.empty}
            className="w-[75%]"
            resizeMode="contain"
          />
          <Text className="text-2xl font-psemibold">No Earnings Found</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Earnings;
