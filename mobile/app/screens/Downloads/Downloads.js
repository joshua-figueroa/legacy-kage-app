import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { Divider } from "react-native-elements";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";

import { DownloadItem, Screen, Loader } from "../../components";
import useLocalMongoDB from "../../hooks/useLocalMongoDB";
import colors from "../../config/colors";
import { setDownloads } from "../../redux/actions";

export default function Downloads({}) {
    const [loading, setLoading] = useState(false);
    const [empty, setEmpty] = useState(false);

    const { find } = useLocalMongoDB("@videodownloads");
    const dispatch = useDispatch();
    const downloads = useSelector((state) => state.downloads.downloadList.reverse());
    const [loaded] = useFonts({ ProximaNova: require("../../assets/fonts/ProximaNova.otf") });

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (downloads.length === 0) {
                setLoading(true);
                const data = await find();
                if (!cancelled) {
                    if (data.length === 0) setEmpty(true);
                    else dispatch(setDownloads(data));
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
                {empty && <Text style={styles.text}>No Downloads</Text>}
                <FlatList
                    data={downloads}
                    extraData={downloads}
                    keyExtractor={(item) => item.animeID}
                    renderItem={({ item }) => (
                        <ActionSheetProvider key={item.animeID}>
                            <DownloadItem
                                id={item.animeID}
                                title={item.title}
                                episode={item.episode}
                                videoURI={item.uri}
                                status={item.status}
                            />
                        </ActionSheetProvider>
                    )}
                    ItemSeparatorComponent={() => <Divider style={{ backgroundColor: colors.separator }} />}
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
        color: colors.grey,
        fontSize: 18,
        fontFamily: "ProximaNova",
        alignSelf: "center",
        marginTop: 15,
    },
});
