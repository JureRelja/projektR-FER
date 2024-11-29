import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Participant } from "../../types/Participant";
import { webRTC } from "../Home";
import { webSocketsSignalling } from "../Home";
import { socket } from "../../signalling/websocket/socket";

// const startSignallingServer = () => {
//     //websockets implementation
//     webSocketsSignalling.answerMade(webRTC.getPeerConnection());
// };

export default function Index() {
    const params = useParams<{ id: string }>();
    const [participant1, setParticipant1] = useState<Participant>();
    const [participant2, setParticipant2] = useState<Participant>();
    const [callStarted, setCallStarted] = useState<boolean>(false);

    const fetchParticipantData = async () => {
        const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/${params.id}`);

        if (thisParticipant.ok) {
            const data: Participant[] = await thisParticipant.json();
            console.log(data);

            if (data.length >= 1 && data[0]) {
                data[0].stream = webRTC.getParticipant1Stream();

                setParticipant1(data[0]);
                setCallStarted(true);
            }

            if (data.length == 2 && data[1]) {
                data[0].stream = webRTC.getParticipant2Stream();

                setParticipant2(data[1]);
            }
        }
    };

    useEffect(() => {
        // Reference to track if the event handler is already set up
        const isHandlerSet = useRef(false);

        const handleAnswerMade = async (data: { caleeSocketId: string; answer: RTCSessionDescriptionInit }) => {
            console.log("answerMade", data);

            if (!webRTC.getPeerConnection().currentRemoteDescription) {
                if (data.caleeSocketId !== socket.id) {
                    console.log("connecting " + data.caleeSocketId + " and " + socket.id);
                    await webRTC.getPeerConnection().setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            }

            fetchParticipantData();
        };

        // Ensure event handler runs only once
        if (!isHandlerSet.current) {
            socket.on("answerMade", handleAnswerMade);
            isHandlerSet.current = true;
        }

        // Cleanup the event listener on component unmount
        return () => {
            socket.off("answerMade", handleAnswerMade);
        };
    }, []);

    return (
        <div className="flex flex-col gap-10 justify-between items-center">
            <div className="flex flex-col gap-5 justify-center items-center">
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
            </div>
        </div>
    );
}
