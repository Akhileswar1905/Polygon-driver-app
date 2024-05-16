import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";

const FormField = ({
  title,
  value,
  handleOnChangeText,
  otherStyles,
  placeHolder,
  keyBoardType,
  ...props
}) => {
  const [showPassword, setshowPassword] = useState(false);

  return (
    <View className={`h-[62px] space-y-2 ${otherStyles}`}>
      <Text className="text-black-100 font-pmedium text-base">{title}</Text>
      <KeyboardAvoidingView className="flex-row w-full h-12 border-2 border-black-100 rounded-xl items-center">
        <TextInput
          className=" flex-1 text-base p-2"
          onChangeText={handleOnChangeText}
          keyboardType={keyBoardType}
          placeholder={placeHolder}
          value={value}
          secureTextEntry={
            (title === "OTP" || title === "Password") && !showPassword
          }
        ></TextInput>
        {(title === "OTP" || title === "Password") && (
          <TouchableOpacity onPress={() => setshowPassword(!showPassword)}>
            <Image
              source={showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 m-2"
            ></Image>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default FormField;
