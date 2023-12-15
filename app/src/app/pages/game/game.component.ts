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

    private app!: Application

    @ViewChild("appContainer") appContainer!: ElementRef;

    constructor(
        private router: Router,
        private socketService: SocketService
    ) {
        if (this.socketService.roomHash === null) this.router.navigateByUrl("/home")
    }

    ngAfterViewInit(): void {
        this.app = new Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
        })
        this.appContainer.nativeElement.appendChild(this.app.view)
        const mainScene = new MainScene(this.app)
        window.addEventListener('resize', (e: any) => {
            this.app.renderer.resize(
                document.body.clientWidth,
                document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
                )
            mainScene.resize()
            this.app.render()
        })
    }
}
