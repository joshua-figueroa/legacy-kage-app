import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Icon } from "react-native-elements";
import { useFonts } from "expo-font";
import { useDispatch } from "react-redux";

import useLocalMongoDB from "../../hooks/useLocalMongoDB";
import { addAnimeFav, removeAnimeFav } from "../../redux/actions";
import colors from "../../config/colors";

export default function FavoriteButton({ data, id }) {
    const [read, setRead] = useState(false);
    const [stored, setStored] = useState(false);

    const dispatch = useDispatch();
    const { insert, findByID, remove } = useLocalMongoDB("@animefavorites");
    const [loaded] = useFonts({
        ProximaNova: require("../../assets/fonts/ProximaNova.otf"),
        Montserrat: require("../../assets/fonts/Montserrat.ttf"),
    });

    useEffect(() => {
        (async () => {
            const data = await findByID(id);
            setStored(data ? true : false);
            setRead(true);
        })();
    }, []);

    const handleAdd = async () => {
        if (!stored) {
            await insert({ animeID: id, data });
            dispatch(addAnimeFav({ animeID: id, data }));
            setStored(true);
        } else {
            await remove(id);
            dispatch(removeAnimeFav({ animeID: id }));
            setStored(false);
        }
    };

    if (!loaded || !read) return null;
    return (
        <Button
            title={stored ? "Added to Favorites" : "Add to Favorites"}
            icon={
                <Icon name={stored ? "playlist-add-check" : "playlist-add"} type="material" size={24} color="black" />
            }
            containerStyle={styles.container}
            buttonStyle={styles.button}
            titleStyle={styles.title}
            onPress={handleAdd}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
        width: 190,
    },
    button: {
        padding: 5,
        backgroundColor: colors.primary,
    },
    title: {
        fontSize: 16,
        fontFamily: "ProximaNova",
        marginLeft: 8,
        color: "black",
    },
});
