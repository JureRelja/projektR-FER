import { io } from "socket.io-client";

const socketUrl = import.meta.env.REACT_APP_BACKEND_URL;

export const socket = io(socketUrl);
