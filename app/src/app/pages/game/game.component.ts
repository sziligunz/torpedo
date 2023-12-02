import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Application } from 'pixi.js';
import { MainScene } from './game.logic';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

    private app = new Application({ width: 1300, height: 1300 })

    @ViewChild("appContainer") appContainer!: ElementRef;

    constructor(
        private router: Router,
        private socketService: SocketService
    ) {
        if (this.socketService.roomHash === null) this.router.navigateByUrl("/home")
    }

    ngAfterViewInit(): void {
        this.appContainer.nativeElement.appendChild(this.app.view)
        const mainScene = new MainScene(this.app)
    }

}
