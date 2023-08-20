import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Search, Anime } from "../screens";
import colors from "../config/colors";

const Stack = createStackNavigator();

export default SearchNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Search" mode="card">
            <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
            <Stack.Screen
                name="Anime"
                component={Anime}
                options={{
                    title: "Details",
                    headerTitleAlign: "center",
                    headerTitleStyle: { color: colors.white },
                }}
            />
        </Stack.Navigator>
    );
};
