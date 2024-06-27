import {IsNotEmpty} from 'class-validator';

export interface MessageEventDto extends MessageDto {
    socketId?: string;
    roomId: string;
    avatar: string;
}

export interface MessageDto {
    order: number
    username: string;
    content: string;
    createdAt: Date;
    avatar:string
}

export interface ChatDto extends MessageDto {
    socketId?: string;
    roomId: string;
    avatar: string;
}

// Assuming you have defined Participant interface in 'dto/chat.dto.ts'
export interface Participant {
    roomId: string;
    username: string;
    avatar: string;
    connected: boolean;
}


export class RoomData {
    createdBy: string;
    createdDate: Date;
    messages:MessageDto[];
    participants: Map<string, Participant>; // sockedId => Participant

    constructor(createdBy: string, messages: MessageDto[], participants: Participant[]) {
        this.createdBy = createdBy;
        this.createdDate = new Date();
        this.messages = new Array<MessageDto>();
        this.participants = new Map();
    }
}

export class RoomDto {
    @IsNotEmpty()
    roomId: string;
    @IsNotEmpty()
    creatorUsername: string;
}

export function toMessageDto(value: MessageEventDto) {
    const {order, username, content, createdAt,avatar} = value;
    return {order, username, content, createdAt,avatar}
}