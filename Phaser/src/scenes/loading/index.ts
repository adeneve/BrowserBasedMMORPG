import { GameObjects, Scene } from 'phaser';

export class LoadingScene extends Scene {
  private player!: GameObjects.Sprite;
  constructor() {
    super('loading-scene');
  }
  create(): void {
    this.scene.start('level-1-scene');
    console.log('Loading scene was created');

  }
  preload(): void {
    this.load.baseURL = 'assets/';
    this.load.image('player', 'sprites/maleBase.png');
    this.load.image('arrowKey', 'sprites/ArrowKey.png');

  }
}