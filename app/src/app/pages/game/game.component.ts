import { Component, ElementRef, AfterViewInit, ViewChild, booleanAttribute } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Application } from 'pixi.js';
import { MainScene } from './logic/MainScene';
import { Subscription } from 'rxjs';
import { Position } from './logic/FunctionsAndInterfaces';

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
    ) {
        if (this.socketService.roomHash === null) {
            this.router.navigateByUrl("/home")
            return
        }
        this.socketService.socket.on('init-game', () => this.initGame())
        this.socketService.socket.on('my-turn', () => this.executeTurn())
        this.socketService.socket.on('evaluate-attack', (position: Position) => this.evaluateAttack(position))
        this.socketService.socket.on('evaluate-attack-result', (hit: boolean) => this.processEvaluatedAttackResult(hit))
    }

    private mainScene!: MainScene
    private readyHandler!: Subscription
    private attackHandler!: Subscription

    ngAfterViewInit(): void {
        //////////
        // APP //
        //////////
        this.app = new Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
        })
        this.appContainer.nativeElement.appendChild(this.app.view)

        ////////////////
        // MAIN SCENE //
        ////////////////
        this.mainScene = new MainScene(this.app)
        this.readyHandler = this.mainScene.areShipsPlaced().subscribe((ready: boolean) => { if (ready) this.ready() })
        window.addEventListener('resize', (e: any) => {
            this.app.renderer.resize(
                document.body.clientWidth,
                document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
                )
            this.mainScene.resize()
            this.app.render()
        })
        this.socketService.socket.emit('loaded')
    }

    initGame() {
        this.mainScene.makeShipsDraggable()
    }

    ready() {
        this.socketService.socket.emit('ready')
        this.readyHandler.unsubscribe()
        this.mainScene.makeShipsNonDraggable()
    }

    private hitTargetPosition: Position | undefined
    executeTurn() {
        this.mainScene.hideShipsBoard().then(() => this.mainScene.showAttackBoard())
        this.attackHandler = this.mainScene.attackResult().subscribe(position => {
            this.attackHandler.unsubscribe()
            this.hitTargetPosition = position
            this.socketService.socket.emit("evaluate-attack", position)
        })
    }

    evaluateAttack(position: Position) {
        this.socketService.socket.emit("evaluate-attack-result", this.mainScene.evaluateAttack(position))
    }
    
    processEvaluatedAttackResult(hit: boolean) {
        this.mainScene.putMarkerOntoAttackBoard(hit, this.hitTargetPosition!)
        if (hit) {
            this.mainScene.hideAttackBoard().then(() => this.mainScene.showShipsBoard().then(() => {this.socketService.socket.emit("end-turn")}))
        } else {
            this.mainScene.hideAttackBoard().then(() => this.mainScene.showShipsBoard().then(() => {this.socketService.socket.emit("end-turn")}))
        }
    }
}
