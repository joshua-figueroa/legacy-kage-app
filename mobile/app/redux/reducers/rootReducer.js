import { combineReducers } from "redux";

import favoritesReducer from "./favoritesReducer";
import downloadsReducer from "./downloadsReducer";

export default combineReducers({ favorites: favoritesReducer, downloads: downloadsReducer });
