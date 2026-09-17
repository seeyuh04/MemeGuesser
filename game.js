const MEMES = [
  {name:"DOGE", file:"doge.png", hint:"The original Shiba Inu meme."},
  {name:"WIF", file:"wif.png", hint:"A dog wearing a very recognizable hat."},
  {name:"BONK", file:"bonk.png", hint:"A Solana-era Shiba Inu memecoin."},
  {name:"PENGU", file:"pengu.png", hint:"Think penguins."},
  {name:"PEPE", file:"pepe.png", hint:"This one is amphibious rather than furry."},
  {name:"FLOKI", file:"floki.png", hint:"A Shiba-themed token with a Viking identity."},
  {name:"MOG", file:"mog.png", hint:"A cat meme associated with 'mogging' culture."},
  {name:"PNUT", file:"pnut.png", hint:"A famous squirrel."},
  {name:"SHIB", file:"shib.png", hint:"One of the best-known Shiba Inu tokens."}
];

const $ = id => document.getElementById(id);
let rounds=[], idx=0, score=0, streak=0, time=15, tick, locked=false, hintUsed=false;

function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
function begin(){
  rounds=shuffle(MEMES).slice(0,5); idx=score=streak=0;
  $("start").classList.add("hidden"); $("finish").classList.add("hidden"); $("game").classList.remove("hidden");
  render();
}
function render(){
  clearInterval(tick); locked=false; hintUsed=false; time=15;
  const m=rounds[idx];
  $("round").textContent=`ROUND ${idx+1} / ${rounds.length}`;
  $("streak").textContent=`🔥 ${streak}`; $("score").textContent=`${score} PTS`;
  $("message").textContent=""; $("timer").textContent=time; $("bar").style.width="100%";
  const img=$("meme"); $("missing").classList.add("hidden"); img.classList.remove("hidden"); img.classList.add("shadow");
  img.src=`/memes/${m.file}`; img.alt=`${m.name} meme`;
  img.onerror=()=>{img.classList.add("hidden");$("missing").classList.remove("hidden")};
  const wrong=shuffle(MEMES.filter(x=>x.name!==m.name)).slice(0,3).map(x=>x.name);
  const opts=shuffle([m.name,...wrong]);
  $("answers").innerHTML="";
  opts.forEach(name=>{const b=document.createElement("button");b.textContent=name;b.onclick=()=>guess(name,b);$("answers").appendChild(b)});
  tick=setInterval(()=>{time--; $("timer").textContent=time; $("bar").style.width=`${time/15*100}%`; if(time<=0){clearInterval(tick);resolve(null)}},1000);
}
function guess(name,button){if(locked)return; resolve(name,button)}
function resolve(name,button){
  if(locked)return; locked=true; clearInterval(tick);
  const m=rounds[idx]; $("meme").classList.remove("shadow");
  [...$("answers").children].forEach(b=>{b.disabled=true;if(b.textContent===m.name)b.classList.add("correct")});
  if(name===m.name){
    let gain=Math.max(250,Math.round((700+time*20)/50)*50); if(hintUsed)gain=Math.max(250,gain-250);
    streak++; gain+=Math.min(streak-1,4)*100; score+=gain; $("message").textContent=`CORRECT · +${gain} PTS`;
  } else {
    streak=0; if(button)button.classList.add("wrong"); $("message").textContent=name?`NOPE — IT'S ${m.name}`:`TIME — IT'S ${m.name}`;
  }
  $("score").textContent=`${score} PTS`; $("streak").textContent=`🔥 ${streak}`;
  setTimeout(()=>{idx++; idx<rounds.length?render():finish()},1800);
}
function finish(){
  $("game").classList.add("hidden"); $("finish").classList.remove("hidden");
  $("finalScore").textContent=score.toLocaleString()+" PTS";
  $("finalText").textContent=`You survived ${rounds.length} memecoin silhouettes.`;
}
$("hintBtn").onclick=()=>{if(locked||hintUsed)return;hintUsed=true;$("message").textContent=rounds[idx].hint};
$("startBtn").onclick=begin; $("againBtn").onclick=begin;
$("shareBtn").onclick=()=>{const text=encodeURIComponent(`I scored ${score.toLocaleString()} points on Shadow Coin 🐕‍🦺🪙\nCan you beat me?`); window.open(`https://x.com/intent/post?text=${text}&url=${encodeURIComponent(location.href)}`,"_blank")};