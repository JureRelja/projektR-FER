import { useParams } from "react-router-dom";
import { socket } from "../../signalling/websocket/socket";
import { useEffect, useState } from "react";
import { Participant } from "../../types/Participant";
import { webRTC } from "../Home";
import { peerConnection } from "../Home";
import { webSocketsSignalling } from "../Home";

const startSignallingServer = (
    setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
) => {
    //websockets implementation
    webSocketsSignalling.answerMade(peerConnection);

    webSocketsSignalling.getRoomData(setParticipant1, setParticipant2);
};

export default function Index() {
    const params = useParams<{ id: string }>();
    const [participant1, setParticipant1] = useState<Participant>();
    const [participant2, setParticipant2] = useState<Participant>();
    const [inCall, setInCall] = useState<boolean>(false);

    useEffect(() => {
        startSignallingServer(setParticipant1, setParticipant2);

        const fetchParticipantData = async () => {
            const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/in-room/${params.id}`);

            if (thisParticipant.ok) {
                const data: Participant[] = await thisParticipant.json();

                if (data.length >= 1 && data[0]) {
                    setParticipant1(data[0]);
                }

                if (data.length == 2 && data[1]) {
                    setParticipant2(data[1]);
                }
            }
        };

        fetchParticipantData();
    }, []);

    const joinCall = async () => {
        const currentParticipant = participant1?.socketId === socket.id ? participant1 : participant2;

        if (currentParticipant?.role === "MODERATOR") {
            await webRTC.createAndSendOffer(parseInt(params.id as string), setParticipant1, setParticipant2);
        } else if (currentParticipant?.role === "PARTICIPANT") {
            console.log(participant1);

            await webRTC.createAndSendAnswer(
                { offer: { sdp: participant1?.sdp, type: participant1?.sdpType as RTCSdpType }, socketId: participant1?.socketId as string },
                setParticipant1,
                setParticipant2,
            );
        }
        setInCall(true);
    };

    return (
        <div className="flex flex-col gap-10 justify-between items-center">
            <div className="flex flex-col gap-5 justify-center items-center">
                {!inCall ? (
                    <div className="flex flex-col gap-5">
                        <h2 className="text-2xl text-center">Članovi:</h2>
                        <div className="flex flex-col gap-2">
                            {participant1 && <p>{participant1.role}</p>}
                            {participant2 && <p>{participant2.role}</p>}
                        </div>

                        <button onClick={joinCall}>{socket.id == participant1?.socketId ? "Započni" : "Pridruži se pozivu"}</button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        {participant1 && (
                            <div>
                                <video
                                    autoPlay={true}
                                    controls={false}
                                    ref={(video) => {
                                        if (video && participant1.stream) {
                                            video.srcObject = participant1.stream;
                                        }
                                    }}
                                />
                                {participant1.id} - {participant1.role}
                            </div>
                        )}

                        {participant2 && (
                            <div>
                                <video
                                    autoPlay={true}
                                    controls={false}
                                    ref={(video) => {
                                        if (video && participant2.stream) {
                                            video.srcObject = participant2.stream;
                                        }
                                    }}
                                />
                                {participant2.id} - {participant2.role}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
