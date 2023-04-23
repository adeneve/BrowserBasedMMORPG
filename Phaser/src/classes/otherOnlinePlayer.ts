import { getuid } from 'process';
import { Actor } from './actor';
export class OtherOnlinePlayer extends Actor {
    private velocity: number;
    public playerID: string;
    public otherPlayerData!: any;
    constructor(scene: Phaser.Scene, onlinePlayerData: any) {
        super(scene, onlinePlayerData.x, onlinePlayerData.y, 'player');
        // KEYS

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
        this.setScale(3, 3)
        this.velocity = 150
        this.otherPlayerData = onlinePlayerData
        this.playerID = onlinePlayerData.playerID;
        console.log('other online playerID: %s', this.playerID)
    }
    // no need to set velocity here, just set position
    // store position of last update to determine if we
    // need to flip the sprite
    update(): void {
        if (this.body == null)
            return;
        this.getBody().setVelocity(0);

        this.x = this.otherPlayerData.x
        this.y = this.otherPlayerData.y

    }

}