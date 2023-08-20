import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";

import colors from "../../config/colors";

export default function Loader({ visibility = false, small = false }) {
    if (!visibility) return null;

    return (
        <View style={styles.view}>
            <ActivityIndicator size={small ? "small" : "large"} color={colors.primary} />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
});
