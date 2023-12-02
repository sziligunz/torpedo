import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SocketService {

    public socket: Socket
    public $roomHash: Subject<string> = new Subject<string>()
    public roomHash: string | null = null

    constructor() {
        this.socket = io(environment.socketServerConfig.url)

        this.socket.on("mm-lobby-count", (mm_lobby) => console.log(mm_lobby))
        this.socket.on("start-game", (roomHash) => {
            this.roomHash = roomHash
            this.$roomHash.next(roomHash)
        })
    }
}
