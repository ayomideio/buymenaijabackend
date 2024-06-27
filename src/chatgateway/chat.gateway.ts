import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import {
    ConflictException,
    ForbiddenException,
    NotFoundException,
  } from '@nestjs/common';
  import { PrismaClient } from '@prisma/client'; // Import PrismaClient from generated Prisma client
  import {
    Participant,
    ChatDto,
    MessageDto,
    RoomDto,
    RoomData,
    toMessageDto,
  } from './dto/chat.dto';
import { PrismaService } from '../prisma/prisma.service';
  
  
  
  @WebSocketGateway()
  export class ChatWebsocketGateway
    implements OnGatewayConnection, OnGatewayDisconnect {
        constructor(private readonly prisma: PrismaService) {}
    @WebSocketServer() server;
  
    handleConnection(socket: Socket): void {
      const socketId = socket.id;
      console.log(`New connecting... socket id:`, socketId);
      // No need to set participants in-memory anymore
    }
  
    handleDisconnect(socket: Socket): void {
      const socketId = socket.id;
      console.log(`Disconnection... socket id:`, socketId);
      // Handle disconnect logic here using Prisma to update participant status
    }
  
    @SubscribeMessage('participants')
    async onParticipate(socket: Socket, participant: Participant) {
        const socketId = socket.id;
        console.log(
            `Registering new participant... socket id: %s and participant: `,
            socketId,
            participant,
        );
    
        try {
            const room = await this.prisma.room.findUnique({
                where: { roomId: participant.roomId },
                include: { participants: true },
            });
    
            if (!room) {
                console.error(
                    `Room with id: ${participant.roomId} was not found, disconnecting the participant`,
                );
                socket.disconnect();
                throw new ForbiddenException('The access is forbidden');
            }
    
            // Ensure participant data aligns with Prisma's expected input
            await this.prisma.participant.create({
                data: {
                    connected: true,
                    socketId,
                    roomId: participant.roomId, // Ensure roomId is correctly assigned
                    username: participant.username,
                    avatar: participant.avatar,
                    // Use room connection based on its ID
                    // room: { connect: { id: room.id } },
                },
            });
    
            const participants = await this.prisma.participant.findMany({
                where: { roomId: participant.roomId },
            });
    
            this.server.emit(`participants/${participant.roomId}`, participants);
        } catch (error) {
            console.error('Error registering participant:', error);
            throw new ForbiddenException('Failed to register participant');
        }
    }
  
    @SubscribeMessage('exchanges')
    async onMessage(socket: Socket, message: ChatDto) {
      const socketId = socket.id;
      message.socketId = socketId;
      console.log('Received new message... socketId: %s, message: ', socketId, message);
  
      try {
        const newMessage = await this.prisma.message.create({
          data: {
            ...message,
            order:   1 ,
          },
        });
  
        this.server.emit(message.roomId, toMessageDto(newMessage));
      } catch (error) {
        console.error('Error saving message:', error);
        throw new ForbiddenException('Failed to save message');
      }
    }
  
    static async get(roomId: string): Promise<RoomData | null> {
        const prisma = new PrismaService(); 
      try {
        const room = await prisma.room.findUnique({
          where: { roomId },
          include: { messages: true, participants: true },
        });
  
        return room ? new RoomData(room.createdBy, room.messages, room.participants) : null;
      } catch (error) {
        console.error('Error fetching room:', error);
        return null;
      }
    }
  
    static async createRoom(roomDto: RoomDto): Promise<void> {
        const prisma = new PrismaService(); 
      try {
        await prisma.room.create({
          data: {
            roomId: roomDto.roomId,
            createdBy: roomDto.creatorUsername,
            createdDate: new Date(),
          },
        });
      } catch (error) {
        console.error('Error creating room:', error);
        throw new ConflictException({
          code: 'room.conflict',
          message: `Room with '${roomDto.roomId}' already exists`,
        });
      }
    }
  
    static async close(roomId: string): Promise<void> {
        const prisma = new PrismaService(); 
      try {
        await prisma.room.delete({
          where: { roomId },
        });
      } catch (error) {
        console.error('Error closing room:', error);
        throw new NotFoundException({
          code: 'room.not-found',
          message: `Room with '${roomId}' not found`,
        });
      }
    }
  }
  