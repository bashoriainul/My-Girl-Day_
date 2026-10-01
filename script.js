const story = document.getElementById("story");
const pages = [...document.querySelectorAll(".page")];
const dots = [...document.querySelectorAll(".dot")];
const progressFill = document.getElementById("progressFill");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicText = document.getElementById("musicText");
const openBtn = document.getElementById("openBtn");
const restartBtn = document.getElementById("restartBtn");
const bouquet = document.getElementById("bouquet");

let currentPage = 0;
let musicStarted = false;

function setMusicUI(playing){
  musicToggle.textContent = playing ? "❚❚" : "▶";
  musicText.textContent = playing ? "Music on" : "Music off";
}

async function startMusic(){
  try{
    await music.play();
    musicStarted = true;
    setMusicUI(true);
  }catch(e){
    setMusicUI(false);
  }
}

openBtn.addEventListener("click", () => {
  startMusic();
  goToPage(1);
});

musicToggle.addEventListener("click", async () => {
  if(music.paused){
    await startMusic();
  }else{
    music.pause();
    setMusicUI(false);
  }
});

function goToPage(index){
  index = Math.max(0, Math.min(pages.length - 1, index));
  pages[index].scrollIntoView({behavior:"smooth", block:"start"});
}

dots.forEach(dot => {
  dot.addEventListener("click", () => goToPage(Number(dot.dataset.go)));
});

restartBtn.addEventListener("click", () => {
  music.currentTime = 0;
  startMusic();
  goToPage(0);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    currentPage = Number(entry.target.dataset.page);
    dots.forEach((d,i) => d.classList.toggle("active", i === currentPage));
    progressFill.style.width = `${((currentPage + 1) / pages.length) * 100}%`;

    if(currentPage === 1) bloomBouquet();
  });
},{root:story, threshold:.6});

pages.forEach(p => observer.observe(p));

function createLily(i, total){
  const flower = document.createElement("div");
  flower.className = "lily";
  const cols = window.innerWidth < 760 ? 5 : 7;
  const row = Math.floor(i / cols);
  const col = i % cols;
  const x = (col / (cols - 1)) * 100 + (Math.random()*8 - 4);
  const y = 9 + row * (window.innerWidth < 760 ? 19 : 16) + (Math.random()*7 - 3.5);
  const scale = (window.innerWidth < 760 ? .55 : .72) + Math.random() * .5;
  const tilt = (Math.random()*26 - 13).toFixed(1) + "deg";
  const dur = (3.2 + Math.random()*2.2).toFixed(2) + "s";

  flower.style.left = `calc(${x}% - 45px)`;
  flower.style.top = `${Math.min(y,86)}%`;
  flower.style.setProperty("--tilt", tilt);
  flower.style.setProperty("--dur", dur);
  flower.style.transform = `scale(${scale})`;
  flower.style.animationDelay = `${i * 0.045}s`;

  flower.innerHTML = `
    <div class="stem"></div>
    <div class="leaf"></div><div class="leaf two"></div>
    <div class="bloom">
      <i class="petal"></i><i class="petal"></i><i class="petal"></i>
      <i class="petal"></i><i class="petal"></i><i class="petal"></i>
      <i class="center"></i>
    </div>`;
  bouquet.appendChild(flower);
}

let bouquetBuilt = false;
function bloomBouquet(){
  if(bouquetBuilt) return;
  bouquetBuilt = true;
  const count = window.innerWidth < 760 ? 22 : 34;
  for(let i=0;i<count;i++) createLily(i,count);
  requestAnimationFrame(() => {
    document.querySelectorAll(".lily").forEach(el => el.classList.add("show"));
  });
}

story.addEventListener("scroll", () => {
  const max = story.scrollHeight - story.clientHeight;
  if(max > 0){
    const pct = Math.max(25, Math.min(100, (story.scrollTop / max) * 100));
    progressFill.style.width = `${pct}%`;
  }
});

// Keyboard navigation for desktop.
window.addEventListener("keydown", e => {
  if(e.key === "ArrowDown" || e.key === "PageDown") {
    e.preventDefault(); goToPage(currentPage + 1);
  }
  if(e.key === "ArrowUp" || e.key === "PageUp") {
    e.preventDefault(); goToPage(currentPage - 1);
  }
});

setMusicUI(false);
