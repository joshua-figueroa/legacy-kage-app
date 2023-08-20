import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export default function useNotifications() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    useEffect(() => {
        (async () => {
            try {
                const { granted } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
                if (!granted) Permissions.askAsync(Permissions.NOTIFICATIONS);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    const downloadSuccess = (title, episode) => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Download Finished",
                body: `${title} Episode ${episode} has finished downloading`,
                sound: "default",
                badge: 1,
                launchImageName: "Kage Anime App",
                autoDismiss: true,
            },
            trigger: null,
        });
    };

    return { downloadSuccess };
}
