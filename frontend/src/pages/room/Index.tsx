import { useParams } from "react-router-dom";
import { socket } from "../../websocket/socket";
import { useEffect, useState } from "react";
import { Participant } from "../../types/Participant";
import { Socket } from "socket.io-client";

const configuration = { iceServers: [{ urls: "stun:stun.example.org" }] };
const peerConnection = new RTCPeerConnection(configuration);

const getUserMedia = async (): Promise<MediaStream | undefined> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        return stream;
    } catch (error) {
        console.error("Error accessing media devices.", error);
    }
};

//Create Offer
const createAndSendOffer = async (
    setParicipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    roomId: number,
    mySocket: Socket,
) => {
    //Displaying and capturing media for the first participant
    getUserMedia().then((stream) => {
        if (!stream) {
            return;
        }

        setParicipant1((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = stream;
            }

            return newParticipant;
        });
    });

    //Media from the other peer
    peerConnection.ontrack = function (event) {
        setParticipant2((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = event.streams[0];
            }

            return newParticipant;
        });
    };

    const offer: RTCSessionDescriptionInit = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    mySocket.emit("makeCall", { offer, roomId: roomId });
};

//Callee Is getting called
//Create Answer
const createAndSendAnswer = async (
    mySocket: Socket,
    data: { offer: RTCSessionDescriptionInit; socketId: string },
    setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
) => {
    //Displaying and capturing media for the first participant
    let localStream: MediaStream | undefined;

    await getUserMedia().then((stream) => {
        if (!stream) {
            return;
        }
        localStream = stream;

        setParticipant1((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = stream;
            }

            return newParticipant;
        });
    });

    //Media from the other peer
    peerConnection.ontrack = function (event) {
        setParticipant2((prev) => {
            const newParticipant = prev;

            if (newParticipant) {
                newParticipant.stream = event.streams[0];
            }

            return newParticipant;
        });
    };

    if (localStream) {
        localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream as MediaStream));

        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(new RTCSessionDescription(answer));

        mySocket.emit("makeAnswer", { answer, to: data.socketId });
    }
};

const startSockets = (
    socket: Socket,
    setParticipant1: React.Dispatch<React.SetStateAction<Participant | undefined>>,
    setParticipant2: React.Dispatch<React.SetStateAction<Participant | undefined>>,
) => {
    socket.on("gettingCalled", (data) => {
        console.log("You are getting called by socketId", data.socketId);
        createAndSendAnswer(socket, data, setParticipant1, setParticipant2);
    });

    socket.on("answerMade", async (data) => {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });
};

export default function Index() {
    const params = useParams<{ id: string }>();
    const [participant1, setParticipant1] = useState<Participant>();
    const [participant2, setParticipant2] = useState<Participant>();

    useEffect(() => {
        const fetchParticipantData = async () => {
            const thisParticipant = await fetch(`${import.meta.env.VITE_BACKEND_URL}/participants/in-room/${params.id}`);

            if (thisParticipant.ok) {
                const data: Participant[] = await thisParticipant.json();

                console.log(data);

                if (data.length >= 1 && data[0]) {
                    setParticipant1(data[0]);
                }

                if (data.length == 2 && data[1]) {
                    setParticipant2(data[1]);
                }
            }
        };

        fetchParticipantData();

        startSockets(socket, setParticipant1, setParticipant2);

        createAndSendOffer(setParticipant1, setParticipant2, parseInt(params.id as string), socket);
    }, []);

    return (
        <div className="flex flex-col gap-10 justify-between items-center">
            <h2 className="text-2xl ">ID poziva: {params.id}</h2>

            <div className="flex flex-col gap-5 justify-center items-center">
                <h2 className="text-2xl text-center">Učesnici u pozivu:</h2>

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
