import { View, Text } from "react-native";
import React from "react";

const Label = ({ title, value, otherStyles }) => {
  return (
    <View className="w-full items-start  mb-4 gap-1">
      <Text className="text-lg font-pmedium">{title}: </Text>
      <Text
        className="text-base font-pregular bottom-0.5"
        style={{
          width: "auto",
          borderBottomColor: "rgba(30, 30, 30,0.4)",
          paddingBottom: 2,
          borderBottomWidth: 0.5,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

export default Label;
