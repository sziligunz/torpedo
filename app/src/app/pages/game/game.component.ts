import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Application } from 'pixi.js';
import { MainScene } from './game.logic';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

    private app!: Application

    @ViewChild("appContainer") appContainer!: ElementRef;

    constructor(
        private router: Router,
        private socketService: SocketService,
        private authService: AuthService
    ) {
        if (this.socketService.roomHash === null) {
            this.router.navigateByUrl("/home")
            return
        }
        this.socketService.socket.on('start-game', () => this.startGame())
    }

    private mainScene!: MainScene

    ngAfterViewInit(): void {
        this.app = new Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
        })
        this.appContainer.nativeElement.appendChild(this.app.view)
        this.mainScene = new MainScene(this.app)
        window.addEventListener('resize', (e: any) => {
            this.app.renderer.resize(
                document.body.clientWidth,
                document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
                )
            this.mainScene.resize()
            this.app.render()
        })

        this.socketService.socket.emit('ready')
    }

    startGame() {
        this.mainScene.longShip.makeDraggable()
    }
}
