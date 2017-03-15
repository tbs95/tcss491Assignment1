const FRAME_SIZE = 150;
//Keyboard
var Key = {
  _pressed : {},
LEFT: 37,
RIGHT: 39,
UP: 38,
DOWN: 40,
A: 65,
S: 83,
D: 68,
F: 70,
SPACE: 32,
  isDown: function(keyCode) {
     return this._pressed[keyCode];
   },

   onKeydown: function(event) {
     this._pressed[event.keyCode] = true;
   },

   onKeyup: function(event) {
     delete this._pressed[event.keyCode];
   }
 };

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}
// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function ChunLi(game) {
  // function          Animation(spriteSheet,                                   startX,         startY,  frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
  this.idleAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),      0, 0 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 7, true, false);
  this.leftWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),  0, 1 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 16, true, false);
  this.rightWalkAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"), 0, 2 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 16, true, false);
  this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),      0, 3 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 9, false, false);
  this.kickAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),      0, 4 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 10, false, false);
  this.punchAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),     0, 5 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 6, false, false);
  this.fireballAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),  0, 6 * FRAME_SIZE, FRAME_SIZE, FRAME_SIZE, 0.1, 12, false, false);
  this.deathAnimation = new Animation(ASSET_MANAGER.getAsset("./img/chunli.png"),     0, 7 * FRAME_SIZE, 200,        FRAME_SIZE, 0.1, 16, false, false);

  this.walking = false;
  this.rightWalking = false;
  this.punching = false;
  this.kicking = false;
  this.fireball = false;
  this.jumping = false;
  this.dying = false;

  this.radius = 100;
  this.speed  = 150;
  this.ground = 400;
  Entity.call(this, game, 50, 100);
}

ChunLi.prototype = new Entity();
ChunLi.prototype.constructor = ChunLi;

ChunLi.prototype.update = function () {
    if (this.walking || this.rightWalking) {
        this.walking = false; this.rightWalking = false;
    }
    if(Key.isDown(Key.RIGHT)){
        this.x += this.game.clockTick * this.speed;
        this.rightWalking = true;
    }else if (Key.isDown(Key.LEFT)){
        this.x -= this.game.clockTick * this.speed;
        this.walking = true;
    } if(Key.isDown(Key.UP)){
        this.y -= this.game.clockTick * this.speed;
    } else if(Key.isDown(Key.DOWN)){
        this.y += this.game.clockTick * this.speed;
    } else if(Key.isDown(Key.A) || this.punching){
        if(this.punchAnimation.isDone()){
            this.punchAnimation.elapsedTime = 0;
            this.punching = false;
        } else {
            this.punching = true;
        }
    } else if (Key.isDown(Key.S) || this.kicking) {
        if(this.kickAnimation.isDone()){
            this.kickAnimation.elapsedTime = 0;
            this.kicking = false;
        } else {
            this.kicking = true;
        }
    } else if (Key.isDown(Key.D) || this.fireball) {
        if(this.fireballAnimation.isDone()){
            this.fireballAnimation.elapsedTime = 0;
            this.fireball = false;
        } else {
            this.fireball = true
        }
    } else if (Key.isDown(Key.SPACE) || this.jumping) {
        if(this.jumpAnimation.isDone()){
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        } else {
            this.jumping = true;
        }
    } else if (Key.isDown(Key.F) || this.dying) {
        if(this.deathAnimation.isDone()){
            this.deathAnimation.elapsedTime = 0;
            this.dying = false;
        } else {
            this.dying = true;
        }
    }
    //endoftesting
    if (this.jumping) {
        if (this.jumpAnimation.isDone()) {
            this.jumpAnimation.elapsedTime = 0;
            this.jumping = false;
        }
        var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        var totalHeight = 150;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));
        this.y = this.ground - height;
    }


    if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
}

ChunLi.prototype.draw = function (ctx) {

    if (this.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.rightWalking) {
        this.rightWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.walking) {
        this.leftWalkAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.kicking) {
        this.kickAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.punching) {
        this.punchAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.fireball) {
        this.fireballAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else if (this.dying) {
        this.deathAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    } else {
        this.idleAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/chunli.png");
ASSET_MANAGER.queueDownload("./img/background.jpg");
ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
    var chun_li = new ChunLi(gameEngine);

    gameEngine.init(ctx);
    gameEngine.start();
  var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.jpg"));
  gameEngine.addEntity(bg);
  gameEngine.addEntity(chun_li);
});
