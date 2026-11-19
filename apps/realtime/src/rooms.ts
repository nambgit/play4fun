export type Player = { id: string; name: string };

export type Room = {
  code: string;
  gameSlug: string;
  hostId: string;
  players: Map<string, Player>;
  status: "lobby" | "playing" | "ended";
  createdAt: number;
};

export type RoomView = Omit<Room, "players"> & { players: Player[] };

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // bỏ O/0/I/1 cho dễ đọc
const CODE_LENGTH = 5;
export const MAX_PLAYERS = 12;

/**
 * Trạng thái phòng giữ trong RAM: đủ cho 1 instance realtime.
 * Khi cần scale nhiều instance thì chuyển sang Valkey/Redis + socket.io redis adapter.
 */
export const rooms = new Map<string, Room>();

export function newRoomCode(): string {
  for (;;) {
    let code = "";
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
    if (!rooms.has(code)) return code;
  }
}

export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.trim().replace(/\s+/g, " ").slice(0, 20);
  return name.length > 0 ? name : null;
}

export function view(room: Room): RoomView {
  return { ...room, players: [...room.players.values()] };
}
