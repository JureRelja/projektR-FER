import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Participant } from "../../types/Participant";
import { WebRTC } from "../../WebRTC";
import { webSocketsSignalling } from "../Home";
import { Room } from "../../types/Room";

const webRTC = new WebRTC(webSocketsSignalling);

const startSignallingServer = () => {
    webSocketsSignalling.answerMade(webRTC.getPeerConnection());
};

export default function Index() {
    const params = useParams<{ id: string }>();
    const [thisParticipant, setThisParticipant] = useState<Participant>();
    const thisParticipantVideo = useRef<HTMLVideoElement>(null);

    const [remoteParticipant, setRemoteParticipant] = useState<Participant>();
    const remoteParticipantVideo = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        startSignallingServer();

        const fetchParticipantData = async () => {
            const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/${params.id}`);

            if (thisParticipant.ok) {
                const data: Participant[] = await thisParticipant.json();

                // Caller participant screen
                if (data[0].socketId === webSocketsSignalling.getUserId()) {
                    if (data.length >= 1 && data[0]) {
                        setThisParticipant(data[0]);
                    }

                    if (data.length == 2 && data[1]) {
                        setRemoteParticipant(data[1]);
                    }
                }
                //Remote participant screen
                else {
                    if (data.length >= 1 && data[0]) {
                        setRemoteParticipant(data[0]);
                    }

                    if (data.length == 2 && data[1]) {
                        setThisParticipant(data[1]);
                    }
                }
            }
        };

        fetchParticipantData();

        const negotiateWebRTC = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${params.id}`);

            const data: Room = await response.json();

            console.log(data);

            if (data.sdp && data.sdpType) {
                const answer = await webRTC.createAndSendAnswer(thisParticipantVideo, remoteParticipantVideo, data.sdp, data.sdpType);

                if (answer) {
                    webSocketsSignalling.emitAnswer(answer, params.id as string);
                }
            } else {
                const offer = await webRTC.createAndSendOffer(thisParticipantVideo, remoteParticipantVideo);

                if (offer?.sdp && offer.type) {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${params.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                            sdpOffer: offer.sdp,
                            sdpType: offer.type,
                        }),
                        headers: {
                            "Content-type": "application/json",
                        },
                    });

                    const data: Room[] = await response.json();
                }
            }
        };

        negotiateWebRTC();
    }, []);

    return (
        <div className="flex flex-col gap-10 justify-between items-center">
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="flex gap-2">
                    {thisParticipant && (
                        <div>
                            <video autoPlay={true} controls={false} ref={thisParticipantVideo} />
                            {thisParticipant.id} - {thisParticipant.role}
                        </div>
                    )}

                    {remoteParticipant && (
                        <div>
                            <video autoPlay={true} controls={false} ref={remoteParticipantVideo} />
                            {remoteParticipant.id} - {remoteParticipant.role}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
