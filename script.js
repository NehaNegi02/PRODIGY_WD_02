let ms = 0, timer = null, laps = [], lapStart = 0;

const display  = document.getElementById('display');
const msEl     = document.getElementById('ms');
const prog     = document.getElementById('prog');
const lapList  = document.getElementById('lapList');
const emptyMsg = document.getElementById('emptyMsg');

// Format ms into HH:MM:SS
function fmt(t) {
  const h = String(Math.floor(t / 360000)).padStart(2,'0');
  const m = String(Math.floor((t % 360000) / 6000)).padStart(2,'0');
  const s = String(Math.floor((t % 6000) / 100)).padStart(2,'0');
  return `${h}:${m}:${s}`;
}

// Update the ring progress (one full rotation = 60s)
function updateRing(t) {
  const secs = (t / 100) % 60;
  prog.style.strokeDashoffset = 565 - (secs / 60) * 565;
}

function tick() {
  ms++;
  display.textContent = fmt(ms);
  msEl.textContent = String(ms % 100).padStart(2,'0');
  updateRing(ms);
}

function startWatch() {
  if (timer) return;
  timer = setInterval(tick, 10);
  lapStart = lapStart || ms;
  document.getElementById('startBtn').disabled = true;
  document.getElementById('pauseBtn').disabled = false;
  document.getElementById('lapBtn').disabled   = false;
}

function pauseWatch() {
  clearInterval(timer); timer = null;
  document.getElementById('startBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  document.getElementById('lapBtn').disabled   = true;
}

function resetWatch() {
  clearInterval(timer); timer = null;
  ms = 0; laps = []; lapStart = 0;
  display.textContent = '00:00:00';
  msEl.textContent = '00';
  prog.style.strokeDashoffset = 565;
  lapList.innerHTML = '';
  emptyMsg.style.display = 'block';
  document.getElementById('startBtn').disabled = false;
  document.getElementById('pauseBtn').disabled = true;
  document.getElementById('lapBtn').disabled   = true;
}

function addLap() {
  const lapTime = ms - lapStart;
  laps.push(lapTime);
  lapStart = ms;
  emptyMsg.style.display = 'none';

  // Find best & worst lap
  const best  = Math.min(...laps);
  const worst = Math.max(...laps);

  // Re-render all laps with correct colour coding
  lapList.innerHTML = '';
  laps.forEach((t, i) => {
    const li = document.createElement('li');
    if (laps.length > 1 && t === best)  li.className = 'best';
    if (laps.length > 1 && t === worst) li.className = 'worst';
    li.innerHTML = `<span class="lap-num">Lap ${i+1}</span><span class="lap-time">${fmt(t)}.${String(t%100).padStart(2,'0')}</span>`;
    lapList.prepend(li);
  });
}
