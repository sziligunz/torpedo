import { Component, ElementRef, AfterViewInit, ViewChild, OnInit } from '@angular/core';
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
        this.socketService.socket.on('evaluate-attack-result', (hit: boolean, allShipDestroyed: boolean, position: Position) => this.processEvaluatedAttackResult(hit, allShipDestroyed, position))
        this.socketService.socket.on('lost', () => this.gameLost())
    }

    ngOnInit(): void {
        const lastState = this.router.lastSuccessfulNavigation?.extras.state;
        if (lastState && lastState['data']) this.captain = lastState['data']['captain']
        console.log(this.captain)
    }

    private mainScene!: MainScene
    private readyHandler!: Subscription
    private attackHandler!: Subscription
    private attackEvaluationRequestHandler!: Subscription
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
        this.attackEvaluationRequestHandler = this.mainScene.getAttackEvaluationRequester().subscribe((targetPositions: Position[]) => {
            this.inAbilityMode = targetPositions.length
            this.attackHandler.unsubscribe()
            targetPositions.forEach(x => this.socketService.socket.emit("evaluate-attack", x))
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
        this.socketService.socket.emit("evaluate-attack-result", this.mainScene.evaluateAttack(position), this.mainScene.areAllShipsSunken(), position)
    }
    
    processEvaluatedAttackResult(hit: boolean, allShipDestroyed: boolean, position: Position) {
        this.mainScene.putMarkerOntoAttackBoard(hit, position)
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

    private gameWon() {
        console.log("YOU HAVE WON THE GAME")
    }
    
    private gameLost() {
        console.log("YOU HAVE LOST THE GAME")
    }
}
