const MEMES = [
  {
    name: "DOGE",
    file: "doge.png",
    hint: "The original Shiba Inu meme."
  },
  {
    name: "WIF",
    file: "wif.png",
    hint: "A dog wearing a very recognizable hat."
  },
  {
    name: "BONK",
    file: "bonk.png",
    hint: "A Solana-era Shiba Inu memecoin."
  },
  {
    name: "PENGU",
    file: "pengu.png",
    hint: "Think penguins."
  },
  {
    name: "PEPE",
    file: "pepe.png",
    hint: "This one is amphibious rather than furry."
  },
  {
    name: "FLOKI",
    file: "floki.png",
    hint: "A Shiba-themed token with a Viking identity."
  },
  {
    name: "MOG",
    file: "mog.png",
    hint: "A cat meme associated with mogging culture."
  },
  {
    name: "PNUT",
    file: "pnut.png",
    hint: "A famous squirrel."
  },
  {
    name: "SHIB",
    file: "shib.png",
    hint: "One of the best-known Shiba Inu tokens."
  }
];


const $ = id => document.getElementById(id);


let rounds = [];
let idx = 0;
let score = 0;
let streak = 0;

let time = 15;
let tick;

let locked = false;
let hintUsed = false;


/* SHUFFLE */

function shuffle(array) {

  return [...array]
    .sort(() => Math.random() - 0.5);

}


/* START GAME */

function begin() {

  rounds =
    shuffle(MEMES)
      .slice(0, 5);

  idx = 0;
  score = 0;
  streak = 0;

  $("start")
    .classList
    .add("hidden");

  $("finish")
    .classList
    .add("hidden");

  $("game")
    .classList
    .remove("hidden");

  $("score").textContent =
    "0 PTS";

  render();

}


/* CREATE ROUND */

function render() {

  clearInterval(tick);

  locked = false;
  hintUsed = false;
  time = 15;

  const meme =
    rounds[idx];


  /* META */

  $("round").textContent =
    `ROUND ${idx + 1} / ${rounds.length}`;

  $("streak").textContent =
    `🔥 ${streak}`;

  $("score").textContent =
    `${score.toLocaleString()} PTS`;

  $("message").textContent =
    "";

  $("timer").textContent =
    time;

  $("bar").style.width =
    "100%";


  /* RESET REVEAL */

  $("reveal")
    .classList
    .add("hidden");

  $("revealName").textContent =
    "";


  /* IMAGE */

  const img =
    $("meme");

  img.classList.remove(
    "hidden",
    "revealed"
  );

  img.classList.add(
    "shadow"
  );

  $("missing")
    .classList
    .add("hidden");

  img.src =
    `/memes/${meme.file}`;

  img.alt =
    `${meme.name} memecoin`;

  img.onerror = () => {

    img.classList.add(
      "hidden"
    );

    $("missing")
      .classList
      .remove("hidden");

  };


  /* ANSWERS */

  const wrong =
    shuffle(
      MEMES.filter(
        x => x.name !== meme.name
      )
    )
    .slice(0, 3)
    .map(x => x.name);


  const options =
    shuffle([
      meme.name,
      ...wrong
    ]);


  $("answers").innerHTML =
    "";


  options.forEach(name => {

    const button =
      document.createElement(
        "button"
      );

    button.textContent =
      name;

    button.onclick =
      () =>
        guess(
          name,
          button
        );

    $("answers")
      .appendChild(
        button
      );

  });


  /* TIMER */

  tick =
    setInterval(() => {

      time--;

      $("timer")
        .textContent =
        time;

      $("bar")
        .style
        .width =
        `${(time / 15) * 100}%`;

      if (time <= 0) {

        clearInterval(tick);

        resolve(null);

      }

    }, 1000);

}


/* GUESS */

function guess(
  name,
  button
) {

  if (locked)
    return;

  resolve(
    name,
    button
  );

}


/* REVEAL ANSWER */

function resolve(
  name,
  button
) {

  if (locked)
    return;

  locked = true;

  clearInterval(tick);


  const meme =
    rounds[idx];

  const img =
    $("meme");


  /* REVEAL CHARACTER */

  img.classList.remove(
    "shadow"
  );

  img.classList.add(
    "revealed"
  );


  /* SHOW NAME */

  $("revealName")
    .textContent =
    `${meme.name}!`;

  $("reveal")
    .classList
    .remove("hidden");


  /* DISABLE ANSWERS */

  [
    ...$("answers")
      .children
  ]
  .forEach(button => {

    button.disabled =
      true;

    if (
      button.textContent ===
      meme.name
    ) {

      button
        .classList
        .add("correct");

    }

  });


  /* CORRECT */

  if (
    name ===
    meme.name
  ) {

    let gain =
      Math.max(
        250,
        Math.round(
          (700 + time * 20) / 50
        ) * 50
      );


    if (hintUsed) {

      gain =
        Math.max(
          250,
          gain - 250
        );

    }


    streak++;


    gain +=
      Math.min(
        streak - 1,
        4
      ) * 100;


    score += gain;


    $("message")
      .textContent =
      `⚡ CORRECT · +${gain.toLocaleString()} PTS`;

  }


  /* WRONG */

  else {

    streak = 0;


    if (button) {

      button
        .classList
        .add("wrong");

    }


    $("message")
      .textContent =
      name
        ? `NOPE — IT'S ${meme.name}`
        : `TIME'S UP — IT'S ${meme.name}`;

  }


  /* UPDATE SCORE */

  $("score")
    .textContent =
    `${score.toLocaleString()} PTS`;

  $("streak")
    .textContent =
    `🔥 ${streak}`;


  /* NEXT ROUND */

  setTimeout(() => {

    idx++;

    if (
      idx <
      rounds.length
    ) {

      render();

    }

    else {

      finish();

    }

  }, 2400);

}


/* FINISH */

function finish() {

  $("game")
    .classList
    .add("hidden");

  $("finish")
    .classList
    .remove("hidden");


  $("finalScore")
    .textContent =
    `${score.toLocaleString()} PTS`;


  $("finalText")
    .textContent =
    `You survived ${rounds.length} mystery memecoins.`;

}


/* HINT */

$("hintBtn")
  .onclick =
  () => {

    if (
      locked ||
      hintUsed
    )
      return;


    hintUsed =
      true;


    $("message")
      .textContent =
      `💡 ${rounds[idx].hint}`;

  };


/* START */

$("startBtn")
  .onclick =
  begin;


/* PLAY AGAIN */

$("againBtn")
  .onclick =
  begin;


/* SHARE */

$("shareBtn")
  .onclick =
  () => {

    const text =
      encodeURIComponent(
        `I scored ${score.toLocaleString()} points on Who's That Meme? 🐕🪙\nCan you beat me?`
      );

    const url =
      encodeURIComponent(
        location.href
      );

    window.open(
      `https://x.com/intent/post?text=${text}&url=${url}`,
      "_blank"
    );

  };
