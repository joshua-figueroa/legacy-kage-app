import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, FlatList } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useFonts } from "expo-font";
import moment from "moment";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { Screen, Episode, ListSeparator, FavoriteButton } from "../../components";
import colors from "../../config/colors";
import api from "../../api/client";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

export default function Anime({ route }) {
    const [genres, setGenres] = useState([]);
    const [count, setCount] = useState([]);

    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
        Montserrat: require("../../assets/fonts/Montserrat.ttf"),
    });

    const ANIME_ID = route.params.id;
    const data = route.params.data;
    const isSeries = data?.showType === "TV";
    const stripLine = (text) => text.split("\n")[0].trim();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (isSeries) {
                const response = await api.get(`/anime/genre/${data.canonicalTitle}`);
                if (!response.data || response.status === 400) return;

                if (!cancelled) setGenres(response.data);
            } else {
                cancelled = true;
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        for (let i = 1; i <= data?.episodeCount; i++) setCount((c) => [...c, i]);
        return () => {
            setCount([]);
        };
    }, []);

    if (!loaded) return null;
    return (
        <Screen style={styles.container} header>
            <FlatList
                data={count}
                keyExtractor={(item) => item.toString()}
                renderItem={({ item }) => (
                    <ActionSheetProvider>
                        <Episode
                            episode={item}
                            slug={data?.slug}
                            series={isSeries}
                            title={data?.canonicalTitle || data?.titles.en}
                            posterImage={
                                data?.coverImage
                                    ? data?.coverImage.original || data?.coverImage.large
                                    : data?.posterImage.original || data?.posterImage.large
                            }
                        />
                    </ActionSheetProvider>
                )}
                initialNumToRender={15}
                ItemSeparatorComponent={() => <ListSeparator />}
                ListHeaderComponent={
                    <>
                        <Image
                            uri={
                                data?.coverImage
                                    ? data?.coverImage.original || data?.coverImage.large
                                    : data?.posterImage.original || data?.posterImage.large
                            }
                            preview={{ uri: data?.coverImage ? data?.coverImage.tiny : data?.posterImage.tiny }}
                            tint="light"
                            style={styles.cover}
                        />
                        <View style={styles.info}>
                            <Text style={styles.title}>{data?.canonicalTitle || data?.titles.en}</Text>
                            {data?.titles.ja_jp && (
                                <Text style={styles.subtitle}>
                                    <Text style={styles.textTitle}>Japanese name:</Text> {data?.titles.ja_jp}
                                </Text>
                            )}
                            <Text style={styles.infoText}>
                                <Text style={styles.textTitle}>Synopsis:</Text>{" "}
                                {stripLine(data?.synopsis || data?.descriptions)}
                            </Text>
                            <Text style={[styles.infoText, { marginBottom: 0 }]}>
                                <Text style={styles.textTitle}>Released:</Text>{" "}
                                {moment(data?.startDate).format("MMMM YYYY")}
                            </Text>
                            {isSeries && (
                                <Text style={[styles.infoText, { marginTop: 10, marginBottom: 0 }]}>
                                    <Text style={styles.textTitle}>Genre:</Text> {genres.join(", ")}
                                </Text>
                            )}
                            <FavoriteButton id={ANIME_ID} data={data} />
                        </View>
                    </>
                }
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
            />
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        padding: 0,
    },
    cover: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT * 0.28,
        resizeMode: "cover",
        borderRadius: 8,
    },
    info: {
        display: "flex",
        padding: 15,
    },
    title: {
        color: colors.primary,
        fontSize: 22,
        fontFamily: "Montserrat",
        marginBottom: 5,
    },
    subtitle: {
        color: colors.secondary,
        fontSize: 15,
        fontFamily: "ProximaNova",
        marginBottom: 5,
    },
    textTitle: {
        color: colors.white,
        fontSize: 15,
        fontFamily: "ProximaNova",
    },
    infoText: {
        textAlign: "justify",
        color: colors.lightgray,
        fontSize: 15,
        fontFamily: "ProximaNova",
        marginBottom: 10,
    },
});
