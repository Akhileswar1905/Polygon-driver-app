import { View, Text } from "react-native";
import React from "react";

const Label = ({ title, value, otherStyles }) => {
  return (
    <View className="w-full items-start  mb-4 gap-1">
      <Text className="text-sm font-pmedium">{title}: </Text>
      <Text
        className="text-lg font-pregular bottom-0.5"
        style={{
          width: "auto",
          paddingBottom: 2,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default Label;
