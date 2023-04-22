import { Actor } from './actor';
export class Player extends Actor {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private velocity: number;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        if (this.scene?.input?.keyboard == null)
            throw "keyboard is null";
        // KEYS
        this.keyW = this.scene.input.keyboard.addKey('W');
        this.keyA = this.scene.input.keyboard.addKey('A');
        this.keyS = this.scene.input.keyboard.addKey('S');
        this.keyD = this.scene.input.keyboard.addKey('D');
        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
        this.setScale(3, 3)
        this.velocity = 150
    }
    update(): void {
        if (this.body == null)
            return;
        this.getBody().setVelocity(0);
        if (this.keyW?.isDown) {
            this.body.velocity.y = -this.velocity;
        }
        if (this.keyA?.isDown) {
            this.body.velocity.x = -this.velocity;
            this.checkFlip();
            this.getBody().setOffset(48, 15);
        }
        if (this.keyS?.isDown) {
            this.body.velocity.y = this.velocity;
        }
        if (this.keyD?.isDown) {
            this.body.velocity.x = this.velocity;
            this.checkFlip();
            this.getBody().setOffset(15, 15);
        }
        if (this.movingDiagonally()) {
            let horizontalScale = 1
            if (this.keyD?.isDown)
                horizontalScale = 1
            else
                horizontalScale = -1

            let verticalScale = 1
            if (this.keyW?.isDown)
                verticalScale = -1
            else
                verticalScale = 1

            let newVelocity = Math.sqrt((this.velocity ** 2) / 2)
            this.body.velocity.x = newVelocity * horizontalScale
            this.body.velocity.y = newVelocity * verticalScale
        }
    }
    movingDiagonally() {
        if ((this.keyD?.isDown && this.keyS?.isDown) ||
            (this.keyD?.isDown && this.keyW?.isDown) ||
            (this.keyA?.isDown && this.keyS?.isDown) ||
            (this.keyA?.isDown && this.keyW?.isDown))
            return true;
        else
            return false;
    }
}