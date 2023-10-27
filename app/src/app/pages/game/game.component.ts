import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { Application, Sprite, Texture, TilingSprite } from 'pixi.js';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements AfterViewInit {

  public app = new Application({width: 640, height: 640})

  @ViewChild("appContainer") appContainer!: ElementRef;

  constructor(
    private router: Router,
    private socketService: SocketService
  ) {
    if (this.socketService.roomHash === null) this.router.navigateByUrl("/home")
  }

  ngAfterViewInit(): void {
    this.appContainer.nativeElement.appendChild(this.app.view)

    let tileTexture = Texture.from('assets/sample.png')
    let board = new TilingSprite(tileTexture, 320, 320)
    board.tileScale.set(0.3, 0.3)

    this.app.stage.addChild(board);
    let elapsed = 0.0;
      this.app.ticker.add((delta) => {
        elapsed += delta;
        // sprite.x = 100.0 + Math.cos(elapsed/50) * 100.0;
      })
  }

}
