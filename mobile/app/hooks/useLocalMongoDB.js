import Datastore from "react-native-local-mongodb";
import AsyncStorage from "@react-native-community/async-storage";

export default function useLocalMongoDB(dataKey) {
    const db = new Datastore({
        filename: dataKey,
        storage: AsyncStorage,
        autoload: true,
    });

    const insert = async (data) => {
        await db.insertAsync(data);
    };

    const find = async () => {
        return await db.findAsync({});
    };

    const findByID = async (id) => {
        return await db.findOneAsync({ animeID: id });
    };

    const remove = async (id) => {
        await db.removeAsync({ animeID: id });
    };

    const empty = async () => {
        await db.removeAsync({}, { multi: true });
    };

    const updateStatus = async (id, newState) => {
        await db.updateAsync({ animeID: id }, { $set: { status: newState } });
    };

    const update = async (id, uri) => {
        await db.updateAsync({ animeID: id }, { $set: { uri } });
    };

    return { insert, find, remove, findByID, update, updateStatus, empty };
}
