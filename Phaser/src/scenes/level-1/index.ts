import { Scene } from 'phaser';
import { Player } from '../../classes/player';
import { io, Socket } from 'socket.io-client';
import { OtherOnlinePlayer } from '../../classes/otherOnlinePlayer';

export class Level1 extends Scene {
  private player!: Player;
  private socket!: Socket;
  private socketIP!: string;
  private emitflipflop!: boolean;
  private otherPlayersData!: Map<string, any>;
  private otherPlayers!: Map<string, OtherOnlinePlayer>;

  constructor() {
    super('level-1-scene');
  }
  create(): void {
    this.player = new Player(this, 200, 28);
    this.otherPlayersData = new Map();
    this.otherPlayers = new Map();
    this.socketIP = "192.168.1.75:3000";
    this.socket = io(this.socketIP, {
      reconnectionDelayMax: 10000
    });
    let self = this
    this.socket.on('all_players_update', function (data: Object) {
     // console.log("received data from socket server: \n")
      let localdata = new Map<string, any>(Object.entries(data))
      if (localdata) {
      //  console.log(localdata)
        if (localdata.has(self.player.playerID))
          localdata.delete(self.player.playerID)
        self.TryUpdateOtherPlayersData(localdata)
        self.otherPlayersData = localdata

        var otherPlayerKeys = self.otherPlayers.keys()
        var otherPlayerKey = otherPlayerKeys.next()
        while (!otherPlayerKey.done) {
          if (localdata.has(otherPlayerKey.value)) {
            let otherPlayer = self.otherPlayers.get(otherPlayerKey.value);
            if (otherPlayer != null)
              otherPlayer.otherPlayerData = localdata.get(otherPlayerKey.value)
          }
          otherPlayerKey = otherPlayerKeys.next()
        }
      }

    })
  }
  update(): void {
    this.player.update();
    if (this.otherPlayers)
      this.otherPlayers.forEach(op => op.update())
    // limit socket emits to 30fps to lower network overhead
    this.emitflipflop = !this.emitflipflop;
    if (this.emitflipflop && !this.playerIdle())
      this.socket.emit('player_update', { "playerID": this.player.playerID, "x": this.player.x, "y": this.player.y })
  }

  TryUpdateOtherPlayersData(data: Map<string, any>) {
    if (this.otherPlayers.size < data.size) {
      let localKeys = this.otherPlayers.keys()
      let dataKeys = data.keys()

      let dataKey = dataKeys.next()
      while (!dataKey.done) {
        if (!(dataKey.value in localKeys)) {
          this.otherPlayers.set(dataKey.value, new OtherOnlinePlayer(this, data.get(dataKey.value)))
        }
        dataKey = dataKeys.next()
      }

    }
    else if (this.otherPlayers.size > data.size) {
      // online player has left, remove them
      let localKeys = this.otherPlayers.keys()
      let dataKeys = data.keys()

      let localKey = localKeys.next()
      while (!localKey.done) {
        if (!(localKey.value in dataKeys)) {
          this.otherPlayers.get(localKey.value)?.destroy()
          this.otherPlayers.delete(localKey.value)
          console.log("deleted other idle player")
        }
        localKey = localKeys.next()
      }
    }

  }

  playerIdle()
  {
        return this.player.idleTimer > 15
  }
}