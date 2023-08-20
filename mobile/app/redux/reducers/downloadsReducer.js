import { SET_DOWNLOADS, ADD_DOWNLOAD, REMOVE_DOWNLOAD, UPDATE_DOWNLOAD } from "../actionTypes";

const initialState = {
    downloadList: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_DOWNLOADS:
            return {
                downloadList: action.payload,
            };

        case ADD_DOWNLOAD:
            return {
                downloadList: [...state.downloadList, action.payload],
            };

        case REMOVE_DOWNLOAD: {
            return {
                downloadList: state.downloadList.filter((download) => download.animeID !== action.payload.animeID),
            };
        }

        case UPDATE_DOWNLOAD: {
            return {
                downloadList: [
                    ...state.downloadList.filter((download) => download.animeID !== action.payload.animeID),
                    action.payload,
                ],
            };
        }

        default:
            return state;
    }
}
