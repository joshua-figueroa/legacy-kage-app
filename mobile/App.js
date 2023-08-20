import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppearanceProvider } from "react-native-appearance";
import { Provider } from "react-redux";

import AppNavigator from "./app/navigations/AppNavigator";
import theme from "./app/navigations/navigationTheme";
import store from "./app/redux/store";
import useNotifications from "./app/hooks/useNotifications";

export default function App() {
    useNotifications();

    return (
        <Provider store={store}>
            <AppearanceProvider>
                <NavigationContainer theme={theme}>
                    <AppNavigator />
                </NavigationContainer>
            </AppearanceProvider>
        </Provider>
    );
}
