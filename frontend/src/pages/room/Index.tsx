import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Participant } from "../../types/Participant";
import { WebRTC } from "../../WebRTC";
import { webSocketsSignalling } from "../Home";
import { Room } from "../../types/Room";
import Button from "../../components/Button";
import { Message } from "../../types/Message";

const webRTC = new WebRTC(webSocketsSignalling);

const startSignallingServer = (fetchParticipantData: () => Promise<void>, handleNewMessage: (message: Message) => void) => {
    webSocketsSignalling.answerMade(webRTC.getPeerConnection(), fetchParticipantData);

    webSocketsSignalling.listenForIceCandidate(webRTC.getPeerConnection());

    webSocketsSignalling.listenForMessage(handleNewMessage);
};

const messages_test = [
    {
        id: 1,
        message: "Hello",
        senderId: "1",
    },
    {
        id: 2,
        message: "Hi",
        senderId: "2",
    },
    {
        id: 3,
        message: "How are you?",
        senderId: "1",
    },
    {
        id: 4,
        message: "I'm good",
        senderId: "2",
    },
    {
        id: 5,
        message: "How about you?",
        senderId: "2",
    },
    {
        id: 6,
        message: "I'm good too",
        senderId: "1",
    },
    {
        id: 7,
        message: "That's great",
        senderId: "2",
    },
    {
        id: 8,
        message: "Yeah",
        senderId: "1",
    },
    {
        id: 9,
        message: "I have to go now",
        senderId: "1",
    },
    {
        id: 10,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 11,
        message: "Bye",
        senderId: "2",
    },

    {
        id: 12,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 13,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 14,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 15,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 16,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 17,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 18,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 19,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 20,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 21,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 22,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 23,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 24,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 25,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 26,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 27,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 28,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 29,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 30,
        message: "Bye",
        senderId: "1",
    },
    {
        id: 31,
        message: "Bye",
        senderId: "2",
    },
    {
        id: 32,
        message: "Bye",
        senderId: "1",
    },
];

export default function Index() {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const [thisParticipant, setThisParticipant] = useState<Participant>();
    const thisParticipantVideo = useRef<HTMLVideoElement>(null);

    // Video
    const [remoteParticipant, setRemoteParticipant] = useState<Participant>();
    const remoteParticipantVideo = useRef<HTMLVideoElement>(null);

    // Chat
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessageHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const messageForSending: Message = {
            id: Date.now(),
            message: message,
            name: thisParticipant?.name as string,
            socketId: thisParticipant?.socketId as string,
            roomUUID: params.id as string,
        };

        webSocketsSignalling.emitMessage(messageForSending);

        setMessages((prev) => [...prev, messageForSending]);

        setMessage("");
    };

    const handleNewMessage = (message: Message) => {
        setMessages((prev) => {
            if (prev.find((msg) => msg.id === message.id)) {
                return prev;
            } else {
                return [...prev, message];
            }
        });
    };

    useEffect(() => {
        if (!params.id) {
            navigate("/");
        }

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

        startSignallingServer(fetchParticipantData, handleNewMessage);

        fetchParticipantData();

        const negotiateWebRTC = async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/rooms/${params.id}`);

            const data: Room = await response.json();

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

        return () => {
            webSocketsSignalling.removeAnswerMade();
        };
    }, []);

    return (
        <div className="flex h-full gap-10 justify-between items-center">
            <div className="flex flex-col gap-5 justify-center items-center">
                <div className="flex gap-2">
                    {thisParticipantVideo && (
                        <div className="h-full w-full">
                            <video autoPlay={true} controls={false} ref={thisParticipantVideo} width="375px" height="200px" />
                            {thisParticipant && <p className="text-center">{thisParticipant.name}</p>}
                        </div>
                    )}

                    {remoteParticipantVideo && (
                        <div className="h-full w-full">
                            <video autoPlay={true} controls={false} ref={remoteParticipantVideo} width="375px" height="200px" />
                            {remoteParticipant && <p className="text-center">{remoteParticipant.name}</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Chat */}
            <div className="flex flex-col w-[400px] h-full py-2 border-2 border-gray-200">
                <div className="h-[500px] flex flex-col gap-2 overflow-y-auto px-2">
                    {messages.map((message) => {
                        return (
                            <div key={message.id} className={`flex ${message.socketId === thisParticipant?.socketId ? "justify-end" : "justify-start"} items-center gap-2`}>
                                <div className="flex flex-col">
                                    <p className={`underline ${message.socketId === thisParticipant?.socketId ? "text-end" : "text-start"}`}>
                                        {message.socketId === thisParticipant?.socketId ? "Vi" : remoteParticipant?.name}
                                    </p>
                                    <p className=" border-2 border-gray-200 p-2 rounded-md">{message.message}</p>{" "}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <form className="flex justify-between gap-2 items-center p-2 border-t-2 border-gray-200">
                    <input
                        className="border-2 px-3 py-[6px] rounded-md border-gray-400 w-full"
                        type="text"
                        placeholder="Poruka..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button
                        label="Send"
                        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                            sendMessageHandler(event);
                        }}
                    />
                </form>
            </div>
        </div>
    );
}
