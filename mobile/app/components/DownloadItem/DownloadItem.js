import React, { useState } from "react";
import {
    StyleSheet,
    View,
    TouchableHighlight,
    Text,
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert,
} from "react-native";
import { Overlay, Icon } from "react-native-elements";
import * as ScreenOrientation from "expo-screen-orientation";
import { useFonts } from "expo-font";
import { Video } from "expo-av";
import { useActionSheet, connectActionSheet } from "@expo/react-native-action-sheet";
import * as FileSystem from "expo-file-system";

import colors from "../../config/colors";
import useLocalMongoDB from "../../hooks/useLocalMongoDB";
import { useDispatch } from "react-redux";
import { removeDownload } from "../../redux/actions";

function DownloadItem({ id, title, episode, videoURI, status }) {
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const { remove } = useLocalMongoDB("@videodownloads");
    const { showActionSheetWithOptions } = useActionSheet();
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
    });

    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

    const deleteDownload = () => {
        Alert.alert("Delete Confirmation", `Are you sure you want to delete ${title} Episode ${episode}?`, [
            {
                text: "No",
                style: "cancel",
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: async () => {
                    await FileSystem.deleteAsync(videoURI, { idempotent: true });
                    await deleteData();
                },
            },
        ]);
    };

    const deleteData = async () => {
        dispatch(removeDownload({ animeID: id }));
        await remove(id);
    };

    const openActionSheet = () => {
        const isFinished = status === "finished";
        const isError = status === "error";

        showActionSheetWithOptions(
            {
                options: isFinished ? ["Play", "Delete", "Cancel"] : isError ? ["Delete", "Cancel"] : ["Cancel"],
                cancelButtonIndex: isFinished ? 2 : isError ? 1 : 0,
                destructiveButtonIndex: isFinished ? 1 : isError ? 0 : null,
                destructiveColor: colors.error,
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
                    <Icon name="delete-circle" type="material-community" size={26} color={colors.error} />,
                    <Icon name="cancel" type="material" size={26} color={colors.error} />,
                ],
            },
            (index) => {
                switch (status) {
                    case "finished":
                        if (index === 0) setVisible(true);
                        else if (index === 1) deleteDownload();
                        break;

                    case "error":
                        if (index === 0) deleteData();
                        break;
                }
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
                    rate={1.0}
                    volume={1.0}
                    useNativeControls
                    shouldPlay
                    removeClippedSubviews
                />
            </Overlay>
            <TouchableHighlight onPress={openActionSheet} activeOpacity={0.8} underlayColor={colors.surface}>
                <View style={styles.container}>
                    <View style={styles.info}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.text}>Episode {episode}</Text>
                    </View>
                    {status === "downloading" && <ActivityIndicator color={colors.primary} />}
                    {status === "finished" && (
                        <Icon name="ios-checkmark-circle" type="ionicon" size={24} color={colors.green} />
                    )}
                    {status === "error" && <Icon name="error" type="material" size={24} color={colors.error} />}
                </View>
            </TouchableHighlight>
        </>
    );
}

const ConnectedApp = connectActionSheet(DownloadItem);
export default ConnectedApp;

const styles = StyleSheet.create({
    container: {
        padding: 15,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    info: {
        flex: 1,
    },
    title: {
        color: colors.white,
        fontSize: 19,
        fontFamily: "ProximaNova",
        marginBottom: 5,
    },
    text: {
        color: colors.white,
        fontSize: 17,
        fontFamily: "ProximaNova",
    },
});
