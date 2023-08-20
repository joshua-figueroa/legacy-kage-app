import { createStore } from "redux";
import roomReducer from "./reducers/rootReducer";

export default createStore(roomReducer);
