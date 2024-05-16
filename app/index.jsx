import { Link, Redirect, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { images } from "../constants";
import { useGlobalContext } from "../context/GlobalContext";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  console.log(isLoading, isLoggedIn);

  if (!isLoading && isLoggedIn) {
    console.log("User Logged In");
    return <Redirect href={"/home"} />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (!isLoading && isLoggedIn) {
                console.log("User Logged In");
                return <Redirect href={"/home"} />;
              }
            }}
          />
        }
      >
        <View className="w-full m-h-[85vh] px-4 flex-1 items-center justify-center">
          {/* Logo */}
          {/* <Text className="text-3xl font-psemibold">
            Ahoy! <Text className="font-pregular">Driver</Text>
          </Text> */}

          <Image
            source={images.logo}
            className="w-[140px] h-[84px]"
            resizeMode="contain"
          />

          <Image
            source={images.cards2}
            className="w-[100%]"
            resizeMode="contain"
          ></Image>
          <CustomButton
            title={"Click to Continue"}
            btnStyles={"w-full "}
            handleOnPress={() => router.push("/login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
