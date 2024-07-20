import kaboom from "kaboom";

kaboom();

loadSprite("bird", "sprites/bird.png");
loadSprite("bg", "sprites/bg.png");
loadSprite("pipe", "sprites/pipe.png");
// load sounds

loadSound("jump", "sounds/jump.mp3");
loadSound("bruh", "sounds/bruh.mp3");
loadSound("pass", "sounds/pass.mp3");

let highScore = 0;

scene("game", () => {
  let score = 0;
  const PIPE_GAP = 150;
  setGravity(1600);

  add([sprite("bg", { width: width(), height: height() })]);

  const scoreText = add([text(score), pos(30, 30)]);

  const player = add([
    sprite("bird"),
    scale(1.5),
    pos(150, 100),
    area(),
    body(),
  ]);

  function createPipes() {
    const offset = rand(-50, 50);
    const pipeY = height() / 2 + offset;

    // bottom pipe
    add([
      sprite("pipe"),
      pos(width(), pipeY + PIPE_GAP / 2),
      "pipe",
      scale(2.2),
      area(),
      { passed: false },
    ]);

    // top pipe
    add([
      sprite("pipe", { flipY: true }),
      pos(width(), pipeY - PIPE_GAP / 2),
      "pipe",
      scale(2.2),
      area(),
      anchor("botleft"),
    ]);
  }

  loop(1.5, () => createPipes());

  onUpdate("pipe", (pipe) => {
    pipe.move(-300, 0);

    if (pipe.passed === false && pipe.pos.x < player.pos.x) {
      pipe.passed = true;
      score += 1;
      scoreText.text = score;
      play("pass");
    }
  });

  player.onCollide("pipe", async () => {
    const ss = await screenshot();
    go("game-over", score, ss);
  });

  player.onUpdate(async () => {
    if (player.pos.y > height()) {
      const ss = await screenshot();
      go("game-over", score, ss);
    }
  });

  onKeyPress("space", () => {
    player.jump(500);
    play("jump");
  });

  window.addEventListener("touchstart", () => {
    player.jump(500);
    play("jump");
  });
});

scene("game-over", (score, screenshot) => {
  if (score > highScore) highScore = score;

  play("bruh");

  loadSprite("gameOverScreen", screenshot);
  add([sprite("bg", { width: width(), height: height() })]);

  add([
    text(
      "Gameover!\n" +
        "score: " +
        score +
        "\nhigh score: " +
        highScore +
        "\nhit space or \ntouch to restart",
      {
        size: 30,
      }
    ),
    pos(width() / 2, height() / 3),
  ]);

  onKeyPress("space", () => {
    go("game");
  });

  window.addEventListener("touchstart", () => {
    go("game");
  });
});

go("game");
