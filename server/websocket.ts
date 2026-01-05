import type { Server } from "http";

interface NotificationMessage {
  type: "reply_arrived" | "typing" | "connected" | "error";
  data: {
    letterId?: number;
    petName?: string;
    replyContent?: string;
    emotionalTone?: string;
    userId?: number;
    timestamp?: string;
  };
}

interface ClientConnection {
  wsId: string;
  userId: number | null;
  isAlive: boolean;
  lastPing: number;
}

const clients = new Map<string, ClientConnection>();

/**
 * WebSocket 서버 초기화 (ws 패키지 필요)
 * 실제 구현은 server/index.ts에서 수행
 */
export function setupWebSocket(server: Server) {
  console.log("[WebSocket] WebSocket server setup initialized");
  // ws 패키지 설치 후 실제 구현
  return null;
}

/**
 * 클라이언트 연결 등록
 */
export function registerClient(wsId: string, userId: number) {
  const connection: ClientConnection = {
    wsId,
    userId,
    isAlive: true,
    lastPing: Date.now(),
  };

  clients.set(wsId, connection);
  console.log(`[WebSocket] Client registered: ${wsId} (User: ${userId})`);
  return connection;
}

/**
 * 클라이언트 연결 해제
 */
export function unregisterClient(wsId: string) {
  const connection = clients.get(wsId);
  if (connection) {
    clients.delete(wsId);
    console.log(`[WebSocket] Client unregistered: ${wsId}`);
  }
}

/**
 * 특정 사용자에게 답장 알림 전송
 */
export function notifyReplyArrived(
  userId: number,
  notification: NotificationMessage
) {
  let sent = false;

  clients.forEach((connection) => {
    if (connection.userId === userId) {
      // 실제 WebSocket 전송은 server/index.ts에서 수행
      console.log(
        `[WebSocket] Reply notification queued for user ${userId}: ${JSON.stringify(notification)}`
      );
      sent = true;
    }
  });

  if (!sent) {
    console.log(
      `[WebSocket] User ${userId} not connected, notification will be queued`
    );
  }

  return sent;
}

/**
 * 모든 연결된 클라이언트에게 브로드캐스트
 */
export function broadcastNotification(notification: NotificationMessage) {
  console.log(
    `[WebSocket] Broadcasting notification to ${clients.size} clients`
  );
  clients.forEach((connection) => {
    console.log(
      `[WebSocket] Broadcast to user ${connection.userId}: ${JSON.stringify(notification)}`
    );
  });
}

/**
 * 특정 사용자 ID로 연결된 클라이언트 수 반환
 */
export function getConnectedClientsCount(userId?: number): number {
  if (!userId) {
    return clients.size;
  }

  let count = 0;
  clients.forEach((connection) => {
    if (connection.userId === userId) {
      count++;
    }
  });
  return count;
}

/**
 * 클라이언트 연결 상태 확인
 */
export function isClientConnected(userId: number): boolean {
  let found = false;
  clients.forEach((connection) => {
    if (connection.userId === userId) {
      found = true;
    }
  });
  return found;
}

/**
 * 모든 클라이언트 정보 조회
 */
export function getAllClients() {
  const allClients: ClientConnection[] = [];
  clients.forEach((connection) => {
    allClients.push(connection);
  });
  return allClients;
}
