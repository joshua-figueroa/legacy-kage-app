import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Dimensions, FlatList, ScrollView } from "react-native";
import { Image } from "react-native-expo-image-cache";
import { useFonts } from "expo-font";
import moment from "moment";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

import { Screen, Episode, Loader, FavoriteButton } from "../../components";
import colors from "../../config/colors";
import api from "../../api/client";
import useAnimeSearch from "../../hooks/useAnimeSearch";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

export default function AnimeResult({ route, navigation }) {
    const [genres, setGenres] = useState([]);
    const [anime, setAnime] = useState({});
    const [loading, setLoading] = useState(false);
    const [animeID, setAnimeID] = useState();

    const { search } = useAnimeSearch();
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
        Montserrat: require("../../assets/fonts/Montserrat.ttf"),
    });

    const stripLine = (text) => text.split("\n")[0].trim();
    const getEpisode = (text) => text.split("Episode")[1];

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const data = await search(route.params.name);
                if (!cancelled) {
                    setAnime(data[0].attributes);
                    setAnimeID(data[0].id);

                    try {
                        const genres = await api.get(`/anime/genre/${route.params.name}`);
                        if (!cancelled) setGenres(genres.data);
                    } catch (error) {
                        cancelled = true;
                        alert("Playback Error");
                        navigation.goBack();
                    }
                }
            } catch (error) {
                cancelled = true;
                alert("Playback Error");
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    if (!loaded) return null;
    return (
        <>
            <Loader visibility={loading} />
            <ScrollView showsVerticalScrollIndicator={false} removeClippedSubviews>
                <Screen style={styles.container} header>
                    {anime && genres.length > 0 && (
                        <>
                            <Image
                                uri={
                                    anime?.coverImage
                                        ? anime?.coverImage.original || anime?.coverImage.large
                                        : anime?.posterImage.original || anime?.posterImage.large
                                }
                                preview={{ uri: anime?.coverImage ? anime?.coverImage.tiny : anime?.posterImage.tiny }}
                                tint="light"
                                style={styles.cover}
                            />
                            <View style={styles.info}>
                                <Text style={styles.title}>{anime?.canonicalTitle || anime?.titles.en}</Text>
                                {anime?.titles.ja_jp && (
                                    <Text style={styles.subtitle}>
                                        <Text style={styles.textTitle}>Japanese name:</Text> {anime?.titles.ja_jp}
                                    </Text>
                                )}
                                <Text style={styles.infoText}>
                                    <Text style={styles.textTitle}>Synopsis:</Text>{" "}
                                    {stripLine(anime?.synopsis || anime?.descriptions)}
                                </Text>
                                <Text style={[styles.infoText, { marginBottom: 0 }]}>
                                    <Text style={styles.textTitle}>Released:</Text>{" "}
                                    {moment(anime?.startDate).format("MMMM YYYY")}
                                </Text>
                                <Text style={[styles.infoText, { marginTop: 10, marginBottom: 0 }]}>
                                    <Text style={styles.textTitle}>Genre:</Text> {genres.join(", ")}
                                </Text>
                                <FavoriteButton data={anime} id={animeID} />
                            </View>
                            <ActionSheetProvider>
                                <Episode
                                    episode={getEpisode(route.params.episode)}
                                    slug={anime?.slug}
                                    series={true}
                                    title={anime?.canonicalTitle || anime?.titles.en}
                                    posterImage={
                                        anime?.coverImage
                                            ? anime?.coverImage.original || anime?.coverImage.large
                                            : anime?.posterImage.original || anime?.posterImage.large
                                    }
                                />
                            </ActionSheetProvider>
                        </>
                    )}
                </Screen>
            </ScrollView>
        </>
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
