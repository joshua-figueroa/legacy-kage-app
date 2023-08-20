import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Text, RefreshControl } from "react-native";
import { useFonts } from "expo-font";

import { Screen, AnimeResult, ListSeparator, Loader } from "../../components";
import colors from "../../config/colors";
import useAnime from "../../hooks/useAnime";

export default function Home({ navigation }) {
    const [anime, setAnime] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const { fetchAnime } = useAnime();
    const [loaded] = useFonts({ ProximaNova: require("../../assets/fonts/ProximaNova.otf") });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const response = await fetchAnime();
            if (!cancelled) setAnime(response);
            setLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const refreshAnime = async () => {
        setRefreshing(true);
        const response = await fetchAnime();
        setAnime(response);
        setRefreshing(false);
    };

    if (!loaded) return null;
    return (
        <>
            <Loader visibility={loading} />
            <Screen style={styles.container}>
                <FlatList
                    data={anime}
                    extraData={anime}
                    keyExtractor={(data) => data.name}
                    renderItem={({ item }) => (
                        <AnimeResult
                            key={item.name}
                            poster={item.posterImage}
                            name={item.name}
                            episode={item.episode}
                            onPress={() => navigation.navigate("AnimeResult", item)}
                        />
                    )}
                    initialNumToRender={10}
                    ItemSeparatorComponent={() => <ListSeparator />}
                    ListHeaderComponent={!loading && <Text style={styles.text}>New Released Anime:</Text>}
                    showsVerticalScrollIndicator={false}
                    windowSize={16}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refreshAnime}
                            refreshing={refreshing}
                            colors={[colors.primary]}
                            progressBackgroundColor={colors.surface}
                            tintColor={colors.primary}
                            enabled
                        />
                    }
                    removeClippedSubviews
                />
            </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    text: {
        marginLeft: 12,
        marginTop: 0,
        marginBottom: 0,
        color: colors.white,
        fontSize: 22,
        fontFamily: "ProximaNova",
    },
});
