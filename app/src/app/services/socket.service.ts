import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  public socket: Socket

  constructor() {
    this.socket = io(environment.socketServerConfig.url)

    this.socket.on("mm-lobby-count", (mm_lobby) => console.log(mm_lobby))
  }
}
