import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Text } from "react-native";
import { useFonts } from "expo-font";
import { useDispatch, useSelector } from "react-redux";

import { Screen, SearchResult, ListSeparator, Loader } from "../../components";
import colors from "../../config/colors";
import useLocalMongoDB from "../../hooks/useLocalMongoDB";
import { setFavorites } from "../../redux/actions";

export default function Favorites({ navigation }) {
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const dispatch = useDispatch();
    const animelist = useSelector((state) => state.favorites.animeList);
    const { find } = useLocalMongoDB("@animefavorites");
    const [loaded] = useFonts({ ProximaNova: require("../../assets/fonts/ProximaNova.otf") });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (animelist.length === 0) {
                setLoading(true);
                const data = await find();
                if (!cancelled) {
                    if (data.length === 0) setEmpty(true);
                    else dispatch(setFavorites(data));
                }

                setLoading(false);
            } else {
                cancelled = true;
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
            <Screen style={styles.container} header>
                {empty && <Text style={styles.empty}>No Favorites</Text>}
                <FlatList
                    data={animelist}
                    extraData={animelist}
                    keyExtractor={(data) => data.animeID}
                    renderItem={({ item }) => (
                        <SearchResult
                            key={item.animeID}
                            data={item.data}
                            onPress={() => navigation.navigate("Anime", { data: item.data, id: item.animeID })}
                        />
                    )}
                    ItemSeparatorComponent={() => <ListSeparator />}
                    showsVerticalScrollIndicator={false}
                    removeClippedSubviews
                />
            </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
    },
    text: {
        marginLeft: 12,
        marginTop: 0,
        marginBottom: 0,
        color: colors.white,
        fontSize: 22,
        fontFamily: "ProximaNova",
    },
    empty: {
        color: colors.grey,
        fontSize: 18,
        fontFamily: "ProximaNova",
        alignSelf: "center",
        marginTop: 15,
    },
});
