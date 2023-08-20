import React from "react";
import { StyleSheet } from "react-native";
import { ListItem, Icon } from "react-native-elements";

import { Screen } from "../../components";
import colors from "../../config/colors";

export default function Options({ navigation }) {
    return (
        <Screen style={styles.screen} header>
            <ListItem containerStyle={styles.container} onPress={() => navigation.navigate("Favorites")} bottomDivider>
                <Icon name="favorite" color={colors.lightgray} />
                <ListItem.Content>
                    <ListItem.Title style={styles.title}>Favorites</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color={colors.lightgray} />
            </ListItem>
            <ListItem containerStyle={styles.container} onPress={() => navigation.navigate("Downloads")}>
                <Icon name="download" type="feather" color={colors.lightgray} />
                <ListItem.Content>
                    <ListItem.Title style={styles.title}>Downloads</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color={colors.lightgray} />
            </ListItem>
        </Screen>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 0,
        paddingBottom: 0,
    },
    container: {
        backgroundColor: colors.surface,
    },
    title: {
        color: colors.white,
    },
});
