import { getuid } from 'process';
import { Actor } from './actor';
import { Physics } from 'phaser';
export class Player extends Actor {
    private keyW!: Phaser.Input.Keyboard.Key;
    private keyA!: Phaser.Input.Keyboard.Key;
    private keyS!: Phaser.Input.Keyboard.Key;
    private keyD!: Phaser.Input.Keyboard.Key;
    private isMobile!: boolean;
    private velocity: number;
    public playerID: string;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        if (this.scene?.input?.keyboard != null) {
            // KEYS
            this.keyW = this.scene.input.keyboard.addKey('W');
            this.keyA = this.scene.input.keyboard.addKey('A');
            this.keyS = this.scene.input.keyboard.addKey('S');
            this.keyD = this.scene.input.keyboard.addKey('D');
        }

        //#region mobile virtual control pad setup
        if (this.isMobile) {
            var virtualKeyUp = new Physics.Arcade.Sprite(scene, 50, 50, 'arrowKey')
            virtualKeyUp.setScale(3, 3)
            virtualKeyUp.y = scene.cameras.main.centerY + (.1 * scene.cameras.main.height)
            virtualKeyUp.x = scene.cameras.main.centerX / 3
            virtualKeyUp.setInteractive().
                on('pointerdown', function () { console.log("up pressed") }, this)
            scene.add.existing(virtualKeyUp)

            var virtualKeyDown = new Physics.Arcade.Sprite(scene, 50, 50, 'arrowKey')
            virtualKeyDown.setScale(3, -3)
            virtualKeyDown.y = scene.cameras.main.centerY + (.3 * scene.cameras.main.height)
            virtualKeyDown.x = scene.cameras.main.centerX / 3
            virtualKeyDown.setInteractive().
                on('pointerdown', function () { console.log("down pressed") }, this)
            scene.add.existing(virtualKeyDown)

            var virtualKeyLeft = new Physics.Arcade.Sprite(scene, 50, 50, 'arrowKey')
            virtualKeyLeft.setScale(3, 3)
            virtualKeyLeft.setRotation(1.5708 * 3)
            virtualKeyLeft.y = scene.cameras.main.centerY + (.2 * scene.cameras.main.height)
            virtualKeyLeft.x = scene.cameras.main.centerX / 3 - (.07 * scene.cameras.main.width)
            virtualKeyLeft.setInteractive().
                on('pointerdown', function () { console.log("left pressed") }, this)
            scene.add.existing(virtualKeyLeft)

            var virtualKeyRight = new Physics.Arcade.Sprite(scene, 50, 50, 'arrowKey')
            virtualKeyRight.setScale(3, 3)
            virtualKeyRight.setRotation(1.5708)
            virtualKeyRight.y = scene.cameras.main.centerY + (.2 * scene.cameras.main.height)
            virtualKeyRight.x = scene.cameras.main.centerX / 3 + (.07 * scene.cameras.main.width)
            virtualKeyRight.setInteractive().
                on('pointerdown', function () { console.log("right pressed") }, this)
            scene.add.existing(virtualKeyRight)


        }

        //#endregion

        // PHYSICS
        this.getBody().setSize(30, 30);
        this.getBody().setOffset(8, 0);
        this.setScale(3, 3)
        this.velocity = 150
        this.playerID = crypto.randomUUID();
        console.log('playerID: %s', this.playerID)
    }
    update(): void {
        if (this.body == null)
            return;
        this.getBody().setVelocity(0);

        if (this.isMobile) {
            if (this.scene.input.activePointer.isDown) {
                console.log(this.scene.input.activePointer)
            }
        }
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

    upPressed() {
        console.log("up button pressed")
        return true;
    }
}