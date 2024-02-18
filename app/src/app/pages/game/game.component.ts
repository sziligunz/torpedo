import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Application } from 'pixi.js';
import { MainScene } from './logic/MainScene';
import { Subscription } from 'rxjs';
import { Position } from './logic/FunctionsAndInterfaces';
import { AbilityType } from './logic/Ability';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit, OnInit {

    private app!: Application
    private captain!: string

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
        this.socketService.socket.on('evaluate-attack-result', (hit: boolean, allShipDestroyed: boolean, position: Position, sunkenShipId: number, sunkenShipPosition: Position, sunkenShipRotation: number, sunkenShipAnchor: Position) => this.processEvaluatedAttackResult(hit, allShipDestroyed, position, sunkenShipId, sunkenShipPosition, sunkenShipRotation, sunkenShipAnchor))
        this.socketService.socket.on('evaluate-reveal', (position: Position) => this.evaluateReveal(position))
        this.socketService.socket.on('evaluate-reveal-result', (hit: boolean, position: Position) => this.processEvaluatedRevealResult(hit, position))
        this.socketService.socket.on('lost', () => this.gameLost())
    }

    ngOnInit(): void {
        const lastState = this.router.lastSuccessfulNavigation?.extras.state;
        if (lastState && lastState['data']) this.captain = lastState['data']['captain']
    }

    private mainScene!: MainScene
    private readyHandler!: Subscription
    private attackHandler!: Subscription
    private inAbilityMode: number = 0

    ngAfterViewInit(): void {
        //////////
        // APP //
        //////////
        this.app = new Application({
            width: document.body.clientWidth,
            height: document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight,
            antialias: true
        })
        this.appContainer.nativeElement.appendChild(this.app.view)

        ////////////////
        // MAIN SCENE //
        ////////////////
        this.mainScene = new MainScene(this.app, this.captain)
        this.readyHandler = this.mainScene.areShipsPlaced().subscribe((ready: boolean) => { if (ready) this.ready() })
        this.mainScene.getAttackEvaluationRequester().subscribe((data: {"positions": Position[], "type": AbilityType}) => {
            this.attackHandler.unsubscribe()
            this.mainScene.attackBoard.makeNonInteractable()
            if (data.positions.length == 0) {
                setTimeout(() => {
                    this.mainScene.incrementCaptainAbilityPoints()
                    this.mainScene.disableCaptainButtons()
                    this.mainScene.hideAttackBoard().then(() => this.mainScene.showShipsBoard().then(() => {this.socketService.socket.emit("end-turn")}))
                }, 2000)
            } else {
                this.inAbilityMode = data.positions.length
                switch(data.type) {
                    case AbilityType.ATTACK:
                        data.positions.forEach(x => this.socketService.socket.emit("evaluate-attack", x))
                        break;
                    case AbilityType.REVEAL:
                        data.positions.forEach(x => this.socketService.socket.emit("evaluate-reveal", x))
                        break;
                }
            }
        })
        // window.addEventListener('resize', (e: any) => {
        //     this.app.renderer.resize(
        //         document.body.clientWidth,
        //         document.body.clientHeight - document.getElementsByClassName("mat-toolbar")[0].clientHeight
        //         )
        //     this.mainScene.resize()
        //     this.app.render()
        // })
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

    executeTurn(reExecute: boolean = false) {
        if (!reExecute) {
            this.mainScene.enableCaptainButtons()
            this.mainScene.hideShipsBoard().then(() => this.mainScene.showAttackBoard())
        }
        this.attackHandler = this.mainScene.attackResult().subscribe(position => {
            this.attackHandler.unsubscribe()
            this.mainScene.disableCaptainButtons()
            this.socketService.socket.emit("evaluate-attack", position)
        })
    }

    evaluateAttack(position: Position) {
        const evaluation = this.mainScene.evaluateAttack(position)
        this.socketService.socket.emit("evaluate-attack-result", evaluation.hit, this.mainScene.areAllShipsSunken(), position, evaluation.sunkenShipId, evaluation.sunkenShipPosition, evaluation.sunkenShipRotation, evaluation.sunkenShipAnchor)
    }

    evaluateReveal(position: Position) {
        this.socketService.socket.emit("evaluate-reveal-result", this.mainScene.evaluateReveal(position), position)
    }
    
    processEvaluatedAttackResult(hit: boolean, allShipDestroyed: boolean, position: Position, sunkenShipId: number, sunkenShipPosition: Position, sunkenShipRotation: number, sunkenShipAnchor: Position) {
        this.mainScene.putMarkerOntoAttackBoard(hit, position)
        if(sunkenShipId != null && sunkenShipPosition != null && sunkenShipRotation != null && sunkenShipAnchor != null) {
            this.mainScene.putDestroyedShipOnAttackBoard(sunkenShipId, sunkenShipPosition, sunkenShipRotation, sunkenShipAnchor)
        }
        if (this.inAbilityMode > 1) {
            this.inAbilityMode--
            return
        }
        if (allShipDestroyed) {
            setTimeout(() => {
                this.gameWon()
                this.socketService.socket.emit("won")
            }, 1000)
        } else {
            if (hit && !(this.inAbilityMode > 0)) {
                this.mainScene.incrementCaptainAbilityPoints()
                this.executeTurn(true)
            } else {
                this.inAbilityMode = 0
                setTimeout(() => {
                    this.mainScene.incrementCaptainAbilityPoints()
                    this.mainScene.disableCaptainButtons()
                    this.mainScene.hideAttackBoard().then(() => this.mainScene.showShipsBoard().then(() => {this.socketService.socket.emit("end-turn")}))
                }, 2000)
            }
        }
    }

    processEvaluatedRevealResult(revealed: boolean, position: Position) {
        // if (revealed) 
            // PUT NUMBER OF FOUND SHIPS TO UI
        this.inAbilityMode--
        if (this.inAbilityMode <= 0) {
            this.inAbilityMode = 0
            setTimeout(() => {
                this.mainScene.incrementCaptainAbilityPoints()
                this.mainScene.disableCaptainButtons()
                this.mainScene.hideAttackBoard().then(() => this.mainScene.showShipsBoard().then(() => {this.socketService.socket.emit("end-turn")}))
            }, 2000)
        }
    }

    private gameWon() {
        console.log("YOU HAVE WON THE GAME")
    }
    
    private gameLost() {
        console.log("YOU HAVE LOST THE GAME")
    }
}
