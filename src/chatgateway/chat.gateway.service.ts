import { ConflictException, NotFoundException } from "@nestjs/common";
import { MessageDto, RoomData, RoomDto } from "./dto/chat.dto";

export class ChatWebsocketGateway {
    private static rooms: Map<string, RoomData> = new Map();

    static get(roomId: string): RoomData | undefined {
        return this.rooms.get(roomId);
    }

    static createRoom(roomDto: RoomDto): void {
        const roomId = roomDto.roomId;
        if (this.rooms.has(roomId)) {
            throw new ConflictException({ code: 'room.conflict', message: `Room with '${roomId}' already exists` })
        }
        this.rooms.set(roomId, new RoomData(roomDto.creatorUsername,[],[]));
    }

    // Add method to add messages to a room
    static addMessage(roomId: string, message: MessageDto): void {
        const room = this.rooms.get(roomId);
        if (room) {
            room.messages.push(message);
            this.rooms.set(roomId, room);
        }
    }

    static close(roomId: string) {
        if (!this.rooms.has(roomId)) {
            throw new NotFoundException({code: 'room.not-fond', message: `Room with '${roomId}' not found`})
        }
        this.rooms.delete(roomId);
    }
}
