import { View, Text, Image } from "react-native";
import React from "react";
import { icons } from "../constants";

const EarningCard = ({ earnings }) => {
  console.log(earnings);
  return (
    <View className="flex items-center justify-center mx-2">
      <View className="w-full p-4 bg-[#f3f3f3] shadow-md shadow-black-100 flex-row items-center space-x-4 m-2 rounded-lg">
        <Image source={icons.card} className="w-10 h-10"></Image>
        <Text>Payment of INR {earnings.amount} is done</Text>
      </View>
    </View>
  );
};

export default EarningCard;
