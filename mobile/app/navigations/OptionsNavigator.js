import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Favorites, Anime, Options, Downloads } from "../screens";
import colors from "../config/colors";

const Stack = createStackNavigator();

export default OptionsNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Options" mode="card">
            <Stack.Screen
                name="Options"
                component={Options}
                options={{
                    title: "More",
                    headerTitleAlign: "center",
                    headerTitleStyle: { color: colors.white },
                }}
            />
            <Stack.Screen
                name="Favorites"
                component={Favorites}
                options={{
                    title: "Favorites",
                    headerTitleAlign: "center",
                    headerTitleStyle: { color: colors.white },
                }}
            />
            <Stack.Screen
                name="Downloads"
                component={Downloads}
                options={{
                    title: "Downloads",
                    headerTitleAlign: "center",
                    headerTitleStyle: { color: colors.white },
                }}
            />
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
