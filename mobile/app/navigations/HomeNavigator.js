import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Home, AnimeResult } from "../screens";
import colors from "../config/colors";

const Stack = createStackNavigator();

export default HomeNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home" mode="card">
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
            <Stack.Screen
                name="AnimeResult"
                component={AnimeResult}
                options={{
                    title: "Details",
                    headerTitleAlign: "center",
                    headerTitleStyle: { color: colors.white },
                }}
            />
        </Stack.Navigator>
    );
};
