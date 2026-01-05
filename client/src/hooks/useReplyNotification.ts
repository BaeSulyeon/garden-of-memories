import { useEffect, useState, useCallback } from "react";

interface ReplyNotification {
  letterId: number;
  petName: string;
  replyContent: string;
  emotionalTone: string;
  timestamp: string;
}

interface UseReplyNotificationReturn {
  notification: ReplyNotification | null;
  isConnected: boolean;
  dismissNotification: () => void;
  registerUser: (userId: number) => void;
}

/**
 * WebSocket을 통해 실시간 답장 알림을 수신하는 훅
 * 실제 구현은 WebSocket 서버가 필요함
 */
export function useReplyNotification(): UseReplyNotificationReturn {
  const [notification, setNotification] = useState<ReplyNotification | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  // WebSocket 연결 설정
  useEffect(() => {
    if (!userId) return;

    try {
      // 현재는 로컬 개발 환경에서 WebSocket 서버가 없으므로 시뮬레이션
      console.log(
        `[useReplyNotification] Connecting to WebSocket for user ${userId}`
      );

      // 실제 구현:
      // const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws`;
      // const webSocket = new WebSocket(wsUrl);
      //
      // webSocket.onopen = () => {
      //   console.log('[WebSocket] Connected');
      //   setIsConnected(true);
      //   webSocket.send(JSON.stringify({ type: 'register', userId }));
      // };
      //
      // webSocket.onmessage = (event) => {
      //   const message = JSON.parse(event.data);
      //   if (message.type === 'reply_arrived') {
      //     setNotification(message.data);
      //   }
      // };
      //
      // webSocket.onclose = () => {
      //   console.log('[WebSocket] Disconnected');
      //   setIsConnected(false);
      // };
      //
      // webSocket.onerror = (error) => {
      //   console.error('[WebSocket] Error:', error);
      // };
      //
      // setWs(webSocket);

      // 시뮬레이션: 5초 후 알림 수신
      const timer = setTimeout(() => {
        console.log("[useReplyNotification] Simulating reply notification");
        setNotification({
          letterId: 1,
          petName: "별이",
          replyContent:
            "별이는 당신을 사랑합니다. 지금도, 영원히. 우리의 사랑은 죽음을 초월합니다.",
          emotionalTone: "love",
          timestamp: new Date().toISOString(),
        });
      }, 5000);

      setIsConnected(true);

      return () => {
        clearTimeout(timer);
        // if (ws) {
        //   ws.close();
        // }
      };
    } catch (error) {
      console.error("[useReplyNotification] Connection error:", error);
    }
  }, [userId]);

  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const registerUser = useCallback((newUserId: number) => {
    setUserId(newUserId);
  }, []);

  return {
    notification,
    isConnected,
    dismissNotification,
    registerUser,
  };
}
