import {
    ADD_FAVORITE,
    REMOVE_FAVORITE,
    SET_FAVORITES,
    ADD_DOWNLOAD,
    REMOVE_DOWNLOAD,
    UPDATE_DOWNLOAD,
    SET_DOWNLOADS,
} from "./actionTypes";

// Favorite Actions

export const setFavorites = (payload) => {
    return {
        type: SET_FAVORITES,
        payload,
    };
};

export const addAnimeFav = (payload) => {
    return {
        type: ADD_FAVORITE,
        payload,
    };
};

export const removeAnimeFav = (payload) => {
    return {
        type: REMOVE_FAVORITE,
        payload,
    };
};

// Download Actions

export const setDownloads = (payload) => {
    return {
        type: SET_DOWNLOADS,
        payload,
    };
};

export const addDownload = (payload) => {
    return {
        type: ADD_DOWNLOAD,
        payload,
    };
};

export const removeDownload = (payload) => {
    return {
        type: REMOVE_DOWNLOAD,
        payload,
    };
};

export const updateDownload = (payload) => {
    return {
        type: UPDATE_DOWNLOAD,
        payload,
    };
};
