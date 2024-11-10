import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";
import { icons } from "../../constants";
const TabLayout = () => {
  const TabIcon = ({ focused, color, icon, name }) => {
    return (
      <View className="items-center justify-center gap-1">
        <Image
          source={icon}
          resizeMode="contain"
          tintColor={color}
          className="w-5 h-5"
        />
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#cc7d53",
          tabBarInactiveTintColor: "#9e9ea3",
          tabBarStyle: {
            backgroundColor: "white",
            padding: "3rem",
            borderTopWidth: 0,
            elevation: 1,
            shadowOpacity: 0,
            shadowOffset: {
              height: 3,
            },
            shadowRadius: 0,
            shadowColor: "black",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Home"
                color={color}
                icon={icons.home}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="trips"
          options={{
            headerShown: false,
            title: "Trips",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Trips"
                color={color}
                icon={icons.car}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="newtrip"
          options={{
            headerShown: false,
            title: "New Trip",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="New Trip"
                color={color}
                icon={icons.plus}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="earnings"
          options={{
            headerShown: false,
            title: "Earnings",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Earnings"
                color={color}
                icon={icons.cash}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name="Profile"
                color={color}
                icon={icons.profile}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
