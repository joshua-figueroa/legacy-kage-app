import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useFonts } from "expo-font";

import colors from "../../config/colors";

export default function AnimeResult({ poster, name, episode, onPress }) {
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
        Montserrat: require("../../assets/fonts/Montserrat.ttf"),
    });

    if (!loaded) return null;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.75} onPress={onPress}>
            <Image uri={poster} preview={{ uri: poster }} tint="light" style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.episodes}>{episode}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 17,
        paddingVertical: 15,
    },
    image: {
        height: 163.8,
        width: 115.5,
        resizeMode: "contain",
        borderRadius: 3,
    },
    info: {
        flex: 1,
        display: "flex",
        justifyContent: "flex-start",
        marginLeft: 18,
    },
    title: {
        color: colors.primary,
        fontSize: 21,
        fontFamily: "Montserrat",
        marginBottom: 10,
    },
    episodes: {
        color: colors.white,
        fontFamily: "ProximaNova",
        fontSize: 17,
    },
});
