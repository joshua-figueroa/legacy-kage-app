import { SET_FAVORITES, ADD_FAVORITE, REMOVE_FAVORITE } from "../actionTypes";

const initialState = {
    animeList: [],
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_FAVORITES:
            return {
                animeList: action.payload,
            };

        case ADD_FAVORITE:
            return {
                animeList: [...state.animeList, action.payload],
            };

        case REMOVE_FAVORITE:
            return {
                animeList: state.animeList.filter((anime) => anime.animeID !== action.payload.animeID),
            };

        default:
            return state;
    }
}
