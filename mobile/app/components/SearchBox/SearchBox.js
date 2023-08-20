import React, { useState } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

import colors from "../../config/colors";

export default function SearchBox({ onChangeText, value, ref, onSubmitEditing }) {
    const [focus, handleFocus] = useState(false);
    const [loaded] = useFonts({ ProximaNova: require("../../assets/fonts/ProximaNova.otf") });

    if (!loaded) return null;

    return (
        <View style={styles.container}>
            <MaterialIcons name="search" size={28} color={focus ? colors.primary : colors.grey} />
            <TextInput
                onChangeText={onChangeText}
                value={value}
                ref={ref}
                style={styles.input}
                placeholder="Search an Anime"
                placeholderTextColor={colors.grey}
                keyboardAppearance="dark"
                returnKeyType="search"
                onFocus={() => handleFocus(true)}
                onBlur={() => handleFocus(false)}
                onSubmitEditing={onSubmitEditing}
                enablesReturnKeyAutomatically
                allowFontScaling
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        paddingHorizontal: 18,
        marginHorizontal: 10,
        marginBottom: 5,
        backgroundColor: colors.surface,
        height: 50,
        borderRadius: 25,
    },
    input: {
        flex: 1,
        color: colors.white,
        marginLeft: 10,
        paddingVertical: 5,
        fontSize: 19,
        fontFamily: "ProximaNova",
    },
});
