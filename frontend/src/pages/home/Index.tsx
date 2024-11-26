import { useState } from "react";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import { socket } from "../../signalling/websocket/socket";
import { useNavigate } from "react-router-dom";
import { Signalling } from "../../signalling/Signalling";
import { WebSocketSignalling } from "../../signalling/websocket/SocketSignalling";
import { WebRTC } from "../../WebRTC";

export const webSocketsSignalling: Signalling = new WebSocketSignalling(socket);
export const peerConnection = new RTCPeerConnection();
export const webRTC = new WebRTC(peerConnection, webSocketsSignalling);

function App() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);

    //Create new room - start
    const roomCreateHandler = async (): Promise<void> => {
        setLoading(true);

        fetch(`${import.meta.env.VITE_BACKEND_URL}/`);
    };
    //Create new room - end

    //Join existing room - start
    const [roomCode, setRoomCode] = useState<string>("");

    const roomCodeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRoomCode(e.target.value);
    };

    const roomJoinHandler = async (): Promise<void> => {
        setLoading(true);
    };
    //Join existing room - end

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Započni novi poziv</h2>
                <Button label="Novi poziv" onClick={roomCreateHandler} />
            </div>

            <div className="flex flex-col gap-5 justify-center">{loading && <p className="text-center">Učitavanje...</p>}</div>
            <Divider />

            <div className="flex flex-col gap-5 justify-center">
                <h2 className="text-2xl text-center">Pridruži se postojećem pozivu</h2>
                <input
                    className="border-2 rounded-sm px-3 py-2 border-gray-400"
                    type="text"
                    value={roomCode}
                    placeholder="Unesite kod poziva, npr. f20jf04j043f0344fj0"
                    onChange={roomCodeHandler}
                />
                <div className="flex flex-col justify-end items-center">
                    <Button label="Pridruži se " onClick={roomJoinHandler} />
                </div>
            </div>
        </div>
    );
}

export default App;
