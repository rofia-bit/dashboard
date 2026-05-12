import { useEffect } from "react";
import { Client } from "@stomp/stompjs";

export function useLogsWebSocket({ role, guardId, onLogReceived }) {

    useEffect(() => {

        const client = new Client({
            brokerURL: "ws://localhost:8081/ws-chat" ,
            reconnectDelay: 5000,

            onConnect: () => {
                console.log("Logs websocket connected");

                client.subscribe("/topic/logs", message => {
                    console.log("NEW ADMIN LOG:", message.body);
                    onLogReceived(JSON.parse(message.body));
                });

                if (guardId) {
                    client.subscribe(`/topic/logs/guard/${guardId}`, message => {
                        console.log("NEW GUARD LOG:", message.body);
                        onLogReceived(JSON.parse(message.body));
                    });
                }
            },

            onStompError: frame => {
                console.error("STOMP error:", frame);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };

    }, [role, guardId, onLogReceived]);
}