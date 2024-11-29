import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Participant } from "../../types/Participant";
import { webRTC } from "../Home";
import { socket } from "../../signalling/websocket/socket";

export default function Index() {
    const params = useParams<{ id: string }>();
    const [participant1, setParticipant1] = useState<Participant>();
    const [participant2, setParticipant2] = useState<Participant>();

    const fetchParticipantData = async () => {
        const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/${params.id}`);

        if (thisParticipant.ok) {
            const data: Participant[] = await thisParticipant.json();

            if (data.length >= 1 && data[0]) {
                data[0].stream = webRTC.getParticipant1Stream();

                setParticipant1(data[0]);
            }

            if (data.length == 2 && data[1]) {
                data[0].stream = webRTC.getParticipant2Stream();

                setParticipant2(data[1]);
            }
        }
    };
    useEffect(() => {
        // if (!callStarted) startSignallingServer();

        fetchParticipantData();

        const handleAnswerMade = async (data: { caleeSocketId: string; answer: RTCSessionDescriptionInit }) => {
            console.log("answerMade", data);

            if (!webRTC.getPeerConnection().currentRemoteDescription) {
                if (data.caleeSocketId != socket.id) {
                    console.log("connecting " + data.caleeSocketId + " and " + socket.id);
                    await webRTC.getPeerConnection().setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            }
            console.log(webRTC);
            fetchParticipantData();
        };

        socket.on("answerMade", async (data) => {
            handleAnswerMade(data);
        });

        return () => {
            socket.off("answerMade"); // Cleanup on unmount
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
