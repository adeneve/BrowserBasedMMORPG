import { Scene } from 'phaser';
import { Player } from '../../classes/player';
import {io, Socket} from 'socket.io-client';

export class Level1 extends Scene {
  private player!: Player;
  private socket!: Socket;
  private socketIP!: string;

  constructor() {
    super('level-1-scene');
  }
  create(): void {
    this.player = new Player(this, 24, 28);
    this.socketIP = "192.168.1.75:3000";
    this.socket = io(this.socketIP, {
        reconnectionDelayMax: 10000
    });
  }
  update(): void {
    this.player.update();
    this.socket.emit('player_update', {"playerID": this.player.playerID, "x": this.player.x, "y": this.player.y})
  }
}