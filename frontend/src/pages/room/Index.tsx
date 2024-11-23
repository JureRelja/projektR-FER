import { useParams } from "react-router-dom";
import { socket } from "../../websocket/socket";
import { useEffect, useState } from "react";
import { Participant } from "../../types/Participant";

export default function Index() {
    const params = useParams<{ id: string }>();
    const [participants, setParticipants] = useState<Participant[]>([]);

    useEffect(() => {
        const fetchParticipantData = async () => {
            const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/in-room/${params.id}`);

            if (thisParticipant.ok) {
                const data: Participant[] = await thisParticipant.json();

                console.log(data);
                setParticipants(data);
            }
        };

        fetchParticipantData();
    }, []);

    socket.on("roomData", (data: Participant[]) => {
        console.log(data);
        setParticipants(data);
    });

    return (
        <div className="flex flex-col gap-10 justify-between items-center">
            <h2 className="text-2xl ">ID poziva: {params.id}</h2>

            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Učesnici u pozivu:</h2>

                <div className="flex gap-2">
                    <ul>
                        {participants.map((participant, index) => (
                            <li key={index}>
                                {participant.id} - {participant.role}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
