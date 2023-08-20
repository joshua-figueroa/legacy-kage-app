import React, { useState } from "react";
import { StyleSheet, View, TouchableHighlight, Text, Dimensions, Alert, Platform } from "react-native";
import { Overlay, Icon } from "react-native-elements";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFonts } from "expo-font";
import { Video } from "expo-av";
import { useActionSheet, connectActionSheet } from "@expo/react-native-action-sheet";
import * as FileSystem from "expo-file-system";
import { useDispatch } from "react-redux";

import colors from "../../config/colors";
import api from "../../api/client";
import Loader from "../Loader/Loader";
import useLocalMongoDB from "../../hooks/useLocalMongoDB";
import { addDownload, updateDownload } from "../../redux/actions";
import useNotifications from "../../hooks/useNotifications";

function Episode({ episode, series, title }) {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [videoURI, setVideoURI] = useState();

    const dispatch = useDispatch();
    const { downloadSuccess } = useNotifications();
    const { insert, findByID } = useLocalMongoDB("@videodownloads");
    const { showActionSheetWithOptions } = useActionSheet();
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
    });

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");
    const displayAlert = () =>
        Alert.alert("Playback Failure", "Selected video is currently not available. File is in an invalid format.");

    const openOverlay = async () => {
        setLoading(true);
        try {
            const response = series
                ? await api.get(`/anime/${title}/episode/${episode}`)
                : await api.get(`/movie/${title}`);
            setVideoURI(response.data.videoLink);
            setVisible(true);
        } catch (error) {
            return displayAlert();
        } finally {
            setLoading(false);
        }
    };

    const initDownload = async () => {
        Alert.alert(
            "Download Confirmation",
            `Are you sure you want to download ${title} Episode ${episode}?`,
            [
                {
                    text: "No",
                    style: "cancel",
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        setLoading(true);
                        var animeURI,
                            animeID,
                            isError = false;

                        try {
                            const response = series
                                ? await api.get(`/anime/${title}/episode/${episode}`)
                                : await api.get(`/movie/${title}`);
                            animeURI = response.data.videoLink;
                            animeID = response.data.url.split("/")[3];
                        } catch (error) {
                            isError = true;
                            setLoading(false);
                            displayAlert();
                        }

                        setLoading(false);

                        const downloaded = await findByID(animeID);

                        if (downloaded) {
                            Alert.alert(
                                "Download Failed",
                                "This episode is already downloaded. Go to Downloads tab to watch it."
                            );
                        } else if (!isError) {
                            try {
                                dispatch(addDownload({ animeID, title, episode, status: "downloading" }));
                                const { uri } = await FileSystem.downloadAsync(
                                    animeURI,
                                    `${FileSystem.documentDirectory}${animeID}.mp4`
                                );
                                dispatch(updateDownload({ animeID, title, episode, uri, status: "finished" }));
                                await insert({ animeID, title, episode, uri, status: "finished" });
                                downloadSuccess(title, episode);
                            } catch (error) {
                                dispatch(updateDownload({ animeID, title, episode, status: "error" }));
                                Alert.alert("Download Failed", `${title} Episode ${episode} has failed to downloaded`, [
                                    { text: "Okay" },
                                ]);
                            }
                        }
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const openActionSheet = () => {
        showActionSheetWithOptions(
            {
                options: ["Play", "Download", "Cancel"],
                cancelButtonIndex: 2,
                title,
                message: "Episode " + episode,
                autoFocus: true,
                useModal: true,
                showSeparators: true,
                titleTextStyle: { color: colors.lightgray },
                messageTextStyle: { color: colors.lightgray },
                containerStyle: { backgroundColor: colors.surface, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
                separatorStyle: { backgroundColor: colors.separator },
                textStyle: { color: colors.white },
                icons: [
                    <Icon name="play-circle-filled" type="material" size={26} color={colors.primary} />,
                    <Icon name="download" type="antdesign" size={26} color={colors.primary} />,
                    <Icon name="cancel" type="material" size={26} color={colors.error} />,
                ],
            },
            (index) => {
                if (index === 0) openOverlay();
                else if (index === 1) initDownload();
            }
        );
    };

    const onFullScreen = async ({ fullscreenUpdate }) => {
        switch (fullscreenUpdate) {
            case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                if (Platform.OS === "android") await ScreenOrientation.unlockAsync();
                else if (Platform.OS === "ios")
                    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT);
                break;
            case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
                break;
        }
    };

    if (!loaded) return null;

    return (
        <>
            <Loader visibility={loading} small />
            <Overlay
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                backdropStyle={{ backgroundColor: colors.surface, opacity: 0.7 }}
                overlayStyle={{
                    backgroundColor: colors.surface,
                    paddingHorizontal: 10,
                    paddingVertical: 0,
                    borderRadius: 10,
                }}
                animationType="fade"
                removeClippedSubviews
            >
                <Video
                    source={{ uri: videoURI }}
                    resizeMode={Video.RESIZE_MODE_CONTAIN}
                    style={{
                        width: SCREEN_WIDTH * 0.9,
                        height: SCREEN_HEIGHT * 0.298,
                        backgroundColor: colors.surface,
                    }}
                    onFullscreenUpdate={onFullScreen}
                    onError={displayAlert}
                    rate={1.0}
                    volume={1.0}
                    useNativeControls
                    shouldPlay
                    removeClippedSubviews
                />
            </Overlay>
            <TouchableHighlight onPress={openActionSheet} activeOpacity={0.8} underlayColor={colors.surface}>
                <View style={styles.container}>
                    <Text style={styles.text}>Episode {episode}</Text>
                </View>
            </TouchableHighlight>
        </>
    );
}

const ConnectedApp = connectActionSheet(Episode);
export default ConnectedApp;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontFamily: "ProximaNova",
    },
});
