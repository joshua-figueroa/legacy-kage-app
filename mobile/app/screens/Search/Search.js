import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, Text } from "react-native";
import { useFonts } from "expo-font";

import { Screen, SearchBox, SearchResult, ListSeparator, Loader } from "../../components";
import colors from "../../config/colors";
import useAnimeSearch from "../../hooks/useAnimeSearch";

export default function Search({ navigation }) {
    const [loaded] = useFonts({ ProximaNova: require("../../assets/fonts/ProximaNova.otf") });
    const { search } = useAnimeSearch();
    const [data, setData] = useState([]);
    const [text, setText] = useState("");
    const [finalText, setFinalText] = useState("");
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        setSearched(false);
    }, []);

    const handleSubmit = async () => {
        setLoading(true);
        const response = await search(text);
        setData(response);
        setLoading(false);
        setSearched(true);
        setFinalText(text);
    };

    if (!loaded) return null;

    return (
        <>
            <Loader visibility={loading} />
            <Screen style={styles.container}>
                <SearchBox onChangeText={(text) => setText(text)} value={text} onSubmitEditing={handleSubmit} />
                {searched && data.length === 0 && <Text style={styles.error}>Your search returned no result</Text>}
                {searched && data.length > 0 && (
                    <FlatList
                        data={data}
                        keyExtractor={(data) => data.id}
                        renderItem={({ item }) => (
                            <SearchResult
                                data={item.attributes}
                                key={item.id}
                                onPress={() => navigation.navigate("Anime", { data: item.attributes, id: item.id })}
                            />
                        )}
                        initialNumToRender={10}
                        ItemSeparatorComponent={() => <ListSeparator />}
                        ListHeaderComponent={<Text style={styles.results}>Search Results for: {finalText}</Text>}
                        showsVerticalScrollIndicator={false}
                        windowSize={16}
                        removeClippedSubviews
                    />
                )}
            </Screen>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    error: {
        color: colors.error,
        fontSize: 18,
        fontFamily: "ProximaNova",
        alignSelf: "center",
        marginTop: 15,
    },
    results: {
        marginLeft: 12,
        marginTop: 10,
        color: colors.white,
        fontSize: 20,
        fontFamily: "ProximaNova",
    },
});
