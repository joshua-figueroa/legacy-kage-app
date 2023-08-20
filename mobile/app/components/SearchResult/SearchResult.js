import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useFonts } from "expo-font";
import moment from "moment";

import colors from "../../config/colors";

export default function SearchResult({ data, onPress }) {
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
        Montserrat: require("../../assets/fonts/Montserrat.ttf"),
    });

    if (!loaded) return null;

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.75} onPress={onPress}>
            <Image
                uri={data?.posterImage.large}
                preview={{ uri: data?.posterImage.tiny }}
                tint="light"
                style={styles.image}
            />
            <View style={styles.info}>
                <Text style={styles.title}>{data?.canonicalTitle || data?.titles.en}</Text>
                <Text style={styles.episodes}>Episodes: {data?.episodeCount}</Text>
                <Text style={styles.date}>Released: {moment(data?.startDate).format("MMMM YYYY")}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
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
        marginBottom: 15,
    },
    episodes: {
        color: colors.white,
        fontFamily: "ProximaNova",
        fontSize: 16,
        marginBottom: 2,
    },
    date: {
        color: colors.white,
        fontFamily: "ProximaNova",
        fontSize: 16,
    },
});
