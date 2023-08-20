import React from "react";
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import HomeNavigator from "./HomeNavigator";
import SearchNavigator from "./SearchNavigator";
import OptionsNavigator from "./OptionsNavigator";

const Tab = createBottomTabNavigator();

export default AppNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Anime"
            tabBarOptions={{ keyboardHidesTabBar: Platform.OS === "android" ? true : false }}
        >
            <Tab.Screen
                name="Anime"
                component={HomeNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="library-video" type="material-community" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Search"
                component={SearchNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="ios-search" type="ionicon" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="More"
                component={OptionsNavigator}
                options={{
                    tabBarIcon: ({ color, size }) => <Icon name="bars" type="antdesign" size={size} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
};
