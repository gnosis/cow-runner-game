import { CollisionBox, FPS, IS_HIDPI, getTimeStamp, Position, Status } from '.'
import { Runner } from './Runner';

/**
* T-rex player config.
* @enum {number}
*/
const DEFAULT_CONFIG = {
  DROP_VELOCITY: -5,
  GRAVITY: 0.6,
  HEIGHT: 47,
  HEIGHT_DUCK: 25,
  INIITAL_JUMP_VELOCITY: -10,
  INTRO_DURATION: 1500,
  MAX_JUMP_HEIGHT: 30,
  MIN_JUMP_HEIGHT: 30,
  SPEED_DROP_COEFFICIENT: 3,
  SPRITE_WIDTH: 262,
  START_X_POS: 50,
  WIDTH: 44,
  WIDTH_DUCK: 59
};

interface AnimFrame {
  frames: [number],
  msPerFrame: number
}

/**
* T-rex game character.
* @param {HTMLCanvas} canvas
* @param {Object} spritePos Positioning within image sprite.
* @constructor
*/
export class Trex{
  config: typeof DEFAULT_CONFIG;
  canvas: HTMLCanvasElement
  canvasCtx: CanvasRenderingContext2D
  xPos: number
  yPos: number
  groundYPos: number
  currentFrame: number
  jumpVelocity: number
  jumping: boolean
  ducking: boolean
  midair: boolean
  speedDrop: boolean
  jumpCount: number
  blinkDelay: number
  blinkCount: number
  animStartTime: number
  timer: number
  msPerFrame: number
  spritePos: Position
  status: Status  

  /**
  * Animation config for different states.
  * @enum {Object}
  */
  animFrames: {[status: Status]: AnimFrame} = {
    WAITING: {
        frames: [44, 0],
        msPerFrame: 1000 / 3
    },
    RUNNING: {
        frames: [88, 132],
        msPerFrame: 1000 / 12
    },
    CRASHED: {
        frames: [220],
        msPerFrame: 1000 / 60
    },
    JUMPING: {
        frames: [0],
        msPerFrame: 1000 / 60
    },
    DUCKING: {
        frames: [264, 323],
        msPerFrame: 1000 / 8
    }
  };

  /**
  * Used in collision detection.
  * @type {Array<CollisionBox>}
  */
  collisionBoxes = {
    DUCKING: [
        new CollisionBox(1, 18, 55, 25)
    ],
    RUNNING: [
        new CollisionBox(22, 0, 17, 16),
        new CollisionBox(1, 18, 30, 9),
        new CollisionBox(10, 35, 14, 8),
        new CollisionBox(1, 24, 29, 5),
        new CollisionBox(5, 30, 21, 4),
        new CollisionBox(9, 34, 15, 4)
    ]
  }

  /**
  * Blinking coefficient.
  * @const
  */
  BLINK_TIMING = 7000;

  constructor(canvas: HTMLCanvasElement, spritePos: Position) {
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext('2d');
    this.spritePos = spritePos;
    this.xPos = 0;
    this.yPos = 0;
    // Position when on the ground.
    this.groundYPos = 0;
    this.currentFrame = 0;
    this.currentAnimFrames = [];
    this.blinkDelay = 0;
    this.blinkCount = 0;
    this.animStartTime = 0;
    this.timer = 0;
    this.msPerFrame = 1000 / FPS;
    this.config = Trex.config;
    // Current status.
    this.status = Status.WAITING;
  
    this.jumping = false;
    this.ducking = false;
    this.jumpVelocity = 0;
    this.reachedMinHeight = false;
    this.speedDrop = false;
    this.jumpCount = 0;
    this.jumpspotX = 0;
  
    this.init();
  };

  /**
   * T-rex player initaliser.
   * Sets the t-rex to blink at random intervals.
   */
   init() {
        if (!window.Runner) return

        this.groundYPos = Runner.defaultDimensions.HEIGHT - this.config.HEIGHT -
        window.Runner.config.BOTTOM_PAD;
        this.yPos = this.groundYPos;
        this.minJumpHeight = this.groundYPos - this.config.MIN_JUMP_HEIGHT;

        this.draw(0, 0);
        this.update(0, Status.WAITING);
    }

    /**
     * Setter for the jump velocity.
     * The approriate drop velocity is also set.
     */
     setJumpVelocity(setting: number) {
        this.config.INIITAL_JUMP_VELOCITY = -setting;
        this.config.DROP_VELOCITY = -setting / 2;
    }

    /**
     * Set the animation status.
     * @param {!number} deltaTime
     * @param {Trex.status} status Optional status to switch to.
     */
     update(deltaTime: number, opt_status) {
        this.timer += deltaTime;

        // Update the status.
        if (opt_status) {
            this.status = opt_status;
            this.currentFrame = 0;
            this.msPerFrame = Trex.animFrames[opt_status].msPerFrame;
            this.currentAnimFrames = Trex.animFrames[opt_status].frames;

            if (opt_status == Status.WAITING) {
                this.animStartTime = getTimeStamp();
                this.setBlinkDelay();
            }
        }

        // Game intro animation, T-rex moves in from the left.
        if (this.playingIntro && this.xPos < this.config.START_X_POS) {
            this.xPos += Math.round((this.config.START_X_POS /
                this.config.INTRO_DURATION) * deltaTime);
        }

        if (this.status == Status.WAITING) {
            this.blink(getTimeStamp());
        } else {
            this.draw(this.currentAnimFrames[this.currentFrame], 0);
        }

        // Update the frame position.
        if (this.timer >= this.msPerFrame) {
            this.currentFrame = this.currentFrame ==
                this.currentAnimFrames.length - 1 ? 0 : this.currentFrame + 1;
            this.timer = 0;
        }

        // Speed drop becomes duck if the down key is still being pressed.
        if (this.speedDrop && this.yPos == this.groundYPos) {
            this.speedDrop = false;
            this.setDuck(true);
        }
    }

    /**
     * Draw the t-rex to a particular position.
     * @param {number} x
     * @param {number} y
     */
    draw(x: number, y: number) {
        if (!window.Runner) return

        var sourceX = x;
        var sourceY = y;
        var sourceWidth = this.ducking && this.status != Status.CRASHED ?
            this.config.WIDTH_DUCK : this.config.WIDTH;
        var sourceHeight = this.config.HEIGHT;

        if (IS_HIDPI) {
            sourceX *= 2;
            sourceY *= 2;
            sourceWidth *= 2;
            sourceHeight *= 2;
        }

        // Adjustments for sprite sheet position.
        sourceX += this.spritePos.x;
        sourceY += this.spritePos.y;

        // Ducking.
        if (this.ducking && this.status != Status.CRASHED) {
            this.canvasCtx.drawImage(window.Runner.imageSprite, sourceX, sourceY,
                sourceWidth, sourceHeight,
                this.xPos, this.yPos,
                this.config.WIDTH_DUCK, this.config.HEIGHT);
        } else {
            // Crashed whilst ducking. Trex is standing up so needs adjustment.
            if (this.ducking && this.status == Status.CRASHED) {
                this.xPos++;
            }
            // Standing / running
            this.canvasCtx.drawImage(window.Runner.imageSprite, sourceX, sourceY,
                sourceWidth, sourceHeight,
                this.xPos, this.yPos,
                this.config.WIDTH, this.config.HEIGHT);
        }
    }

    /**
     * Sets a random time for the blink to happen.
     */
     setBlinkDelay() {
        this.blinkDelay = Math.ceil(Math.random() * Trex.BLINK_TIMING);
    },

    /**
     * Make t-rex blink at random intervals.
     * @param {number} time Current time in milliseconds.
     */
     blink(time) {
        var deltaTime = time - this.animStartTime;

        if (deltaTime >= this.blinkDelay) {
            this.draw(this.currentAnimFrames[this.currentFrame], 0);

            if (this.currentFrame == 1) {
                // Set new random delay to blink.
                this.setBlinkDelay();
                this.animStartTime = time;
                this.blinkCount++;
            }
        }
    },

    /**
     * Initialise a jump.
     * @param {number} speed
     */
     startJump(speed) {
        if (!this.jumping) {
            this.update(0, Status.JUMPING);
            // Tweak the jump velocity based on the speed.
            this.jumpVelocity = this.config.INIITAL_JUMP_VELOCITY - (speed / 10);
            this.jumping = true;
            this.reachedMinHeight = false;
            this.speedDrop = false;
        }
    },

    /**
     * Jump is complete, falling down.
     */
     endJump() {
        if (this.reachedMinHeight &&
            this.jumpVelocity < this.config.DROP_VELOCITY) {
            this.jumpVelocity = this.config.DROP_VELOCITY;
        }
    },

    /**
     * Update frame for a jump.
     * @param {number} deltaTime
     * @param {number} speed
     */
     updateJump(deltaTime:number, speed:number) {
        var msPerFrame = Trex.animFrames[this.status].msPerFrame;
        var framesElapsed = deltaTime / msPerFrame;

        // Speed drop makes Trex fall faster.
        if (this.speedDrop) {
            this.yPos += Math.round(this.jumpVelocity *
                this.config.SPEED_DROP_COEFFICIENT * framesElapsed);
        } else {
            this.yPos += Math.round(this.jumpVelocity * framesElapsed);
        }

        this.jumpVelocity += this.config.GRAVITY * framesElapsed;

        // Minimum height has been reached.
        if (this.yPos < this.minJumpHeight || this.speedDrop) {
            this.reachedMinHeight = true;
        }

        // Reached max height
        if (this.yPos < this.config.MAX_JUMP_HEIGHT || this.speedDrop) {
            this.endJump();
        }

        // Back down at ground level. Jump completed.
        if (this.yPos > this.groundYPos) {
            this.reset();
            this.jumpCount++;
        }

        this.update(deltaTime);
    }

    /**
     * Set the speed drop. Immediately cancels the current jump.
     */
    setSpeedDrop() {
        this.speedDrop = true;
        this.jumpVelocity = 1;
    }

    /**
     * @param {boolean} isDucking.
     */
    setDuck(isDucking: boolean) {
        if (isDucking && this.status != Status.DUCKING) {
            this.update(0, Status.DUCKING);
            this.ducking = true;
        } else if (this.status == Status.DUCKING) {
            this.update(0, Status.RUNNING);
            this.ducking = false;
        }
    }

    /**
     * Reset the t-rex to running at start of game.
     */
    reset() {
        this.yPos = this.groundYPos;
        this.jumpVelocity = 0;
        this.jumping = false;
        this.ducking = false;
        this.update(0, Status.RUNNING);
        this.midair = false;
        this.speedDrop = false;
        this.jumpCount = 0;
    }
}




