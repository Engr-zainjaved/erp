import { useState, useEffect, useRef } from "react";

const useWebSocket = (): any => {
  const [webSocketData, setwebSocketData] = useState(null);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const webSocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const userToken = localStorage.getItem("backendToken");
    if (userToken && !webSocketRef.current) {
      const handleWebSocket = () => {
        const socket = new WebSocket(
          `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/?token=${userToken}`
        );

        socket.onopen = () => {
          setIsWebSocketConnected(true);
        };

        socket.onmessage = (event) => {
          const eventData = JSON.parse(event.data);
          setwebSocketData(eventData);
        };

        socket.onclose = () => {
          setIsWebSocketConnected(false);
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        webSocketRef.current = socket;

        return () => {
          if (webSocketRef.current) {
            webSocketRef.current.close();
            webSocketRef.current = null;
          }
        };
      };

      handleWebSocket();
    }
  }, []);

  return { webSocketData, isWebSocketConnected };
};

export default useWebSocket;
