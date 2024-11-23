import { useState } from "react";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import { socket } from "../../websocket/socket";
import { useNavigate } from "react-router-dom";

function App() {
    const navigate = useNavigate();

    //Create new room - start
    const roomCreateHandler = async (): Promise<void> => {
        socket.emit("createRoom", (roomId: number) => {
            console.log("Room created with id: ", roomId);
            navigate(`/room/${roomId}`);
        });
    };
    //Create new room - end

    //Join existing room - start
    const [roomCode, setRoomCode] = useState<string>("");

    const roomCodeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setRoomCode(e.target.value);
    };

    const roomJoinHandler = (): void => {
        socket.connect();

        socket.emit("joinRoom", { roomId: roomCode }, (success: boolean) => {
            if (success) {
                navigate(`/room/${roomCode}`);
            }
        });
    };
    //Join existing room - end

    return (
        <div className="flex flex-col gap-12 w-full">
            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Započni novi poziv</h2>
                <Button label="Novi poziv" onClick={roomCreateHandler} />
            </div>

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
