import { useEffect, useState } from "react";
import Button from "../components/Button";
import Divider from "../components/Divider";
import { socket } from "../signalling/websocket/socket";
import { useNavigate } from "react-router-dom";
import { Signalling } from "../signalling/Signalling";
import { WebSocketSignalling } from "../signalling/websocket/SocketSignalling";
import { Room } from "../types/Room";
import { MoonLoader } from "react-spinners";

export const webSocketsSignalling: Signalling = new WebSocketSignalling(socket);

function App() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [name, setName] = useState<string>("");

    const nameHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    //Create new room - start
    const roomCreateHandler = async (): Promise<void> => {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/create`, {
                body: JSON.stringify({ socketId: webSocketsSignalling.getUserId(), name: name }),
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
            });

            const room: Room = await response.json();

            webSocketsSignalling.joinRoom(room.uuid);

            navigate(`/room/${room.uuid}`);
        } catch (error) {
            console.log(error);
        }
    };
    //Create new room - end

    //Join existing room - start
    const [roomCode, setRoomCode] = useState<string>("");

    const roomCodeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRoomCode(e.target.value);
    };

    const roomJoinHandler = async (): Promise<void> => {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${roomCode}`, {
                method: "POST",
                body: JSON.stringify({ socketId: webSocketsSignalling.getUserId(), name: name }),
                headers: {
                    "Content-type": "application/json",
                },
            });

            if (response.ok) {
                webSocketsSignalling.joinRoom(roomCode);

                navigate(`/room/${roomCode}`);
            }
        } catch (error) {
            console.log(error);
            alert("U ovom pozivu se već nalazi dvoje sudionika.");
        }
    };
    //Join existing room - end

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);

        if (params.has("roomId")) {
            setRoomCode(params.get("roomId") as string);
        }
    }, []);

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Novi poziv</h2>
                <input
                    className="border-2 rounded-sm px-3 py-2 border-gray-400 w-[400px]"
                    type="text"
                    value={name}
                    placeholder="Unesite svoje ime, npr. Marko"
                    onChange={nameHandler}
                />
                <Button label="Novi poziv" onClick={roomCreateHandler} />
            </div>

            {loading && (
                <div className="bg-gray-400 w-full opacity-40 h-full absolute top-0 left-0 z-2">
                    <div className="flex flex-col gap-5 justify-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10">
                        <MoonLoader />
                    </div>
                </div>
            )}
            <Divider />

            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Pridruži se postojećem pozivu</h2>

                <input
                    className="border-2 rounded-sm px-3 py-2 border-gray-400 w-[400px]"
                    type="text"
                    value={name}
                    placeholder="Unesite svoje ime, npr. Marko"
                    onChange={nameHandler}
                />
                <input
                    className="border-2 rounded-sm px-3 py-2 border-gray-400 w-[400px]"
                    type="text"
                    value={roomCode}
                    placeholder="Unesite kod poziva, npr. f20jf04j043f0344fj0"
                    onChange={roomCodeHandler}
                />

                <Button label="Pridruži se" onClick={roomJoinHandler} />
            </div>
        </div>
    );
}

export default App;
