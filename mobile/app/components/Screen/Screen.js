import React from "react";
import { StyleSheet, SafeAreaView, View, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";

import colors from "../../config/colors";

export default function Screen({ children, style, safeAreaStyle, header = false }) {
    return (
        <SafeAreaView
            style={[
                { flex: 1, backgroundColor: colors.background, paddingTop: !header ? Constants.statusBarHeight : 0 },
                safeAreaStyle,
            ]}
        >
            <StatusBar style="light" />
            <View style={[styles.view, style]}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    view: {
        padding: 15,
        flex: 1,
    },
});
