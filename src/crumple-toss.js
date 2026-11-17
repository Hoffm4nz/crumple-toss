/*!
 * Crumple Toss — flick paper into the bin. WebGL game by Omer Hoffman.
 * Bundles three.js r128 (MIT, © three.js authors). Icons: Lucide (ISC).
 */
import * as THREE from 'three';

var CSS = [
  '.ct-root{--ct-bg:#23292e;--ct-ink:#f4f1ea;--ct-panel:rgba(22,27,31,.62);--ct-line:rgba(244,241,234,.14);--ct-note:#ffd84d;--ct-note-ink:#2c2608;--ct-miss:#c8372d;',
  'position:relative;display:block;width:100%;height:var(--ct-height,100vh);height:var(--ct-height,100svh);overflow:hidden;isolation:isolate;',
  'background:var(--ct-bg);color:var(--ct-ink);font-family:var(--ct-font);font-weight:500;line-height:1.2;-webkit-font-smoothing:antialiased;',
  'touch-action:none;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;color-scheme:dark}',
  '.ct-root *,.ct-root *::before,.ct-root *::after{box-sizing:border-box}',
  '.ct-root [hidden]{display:none!important}',
  '.ct-root button{font-family:inherit;margin:0;-webkit-appearance:none;appearance:none}',
  '.ct-root canvas{position:absolute;inset:0;width:100%;height:100%;display:block}',
  '.ct-gl{touch-action:none;cursor:grab}.ct-gl:active{cursor:grabbing}',
  '.ct-trail{pointer-events:none;z-index:2}',
  '.ct-hud{position:absolute;z-index:3;top:calc(env(safe-area-inset-top,0px) + 14px);left:max(16px,env(safe-area-inset-left,0px));right:max(16px,env(safe-area-inset-right,0px));display:flex;justify-content:space-between;align-items:flex-start;gap:12px;pointer-events:none}',
  '.ct-note{position:relative;background:var(--ct-note);color:var(--ct-note-ink);padding:14px 16px 12px;min-width:104px;display:grid;gap:3px;transform:rotate(-2.5deg);border-radius:2px 2px 3px 14px/2px 2px 3px 6px;box-shadow:0 10px 18px -6px rgba(0,0,0,.55),0 2px 0 rgba(0,0,0,.08)}',
  '.ct-note::before{content:"";position:absolute;top:-9px;left:50%;width:46px;height:16px;transform:translateX(-50%) rotate(3deg);background:rgba(244,241,234,.55);box-shadow:0 1px 2px rgba(0,0,0,.15)}',
  '.ct-label{font-weight:700;font-size:10.5px;line-height:1;letter-spacing:.14em;text-transform:uppercase;opacity:.72}',
  '.ct-num{font-weight:900;font-size:46px;line-height:.95;font-variant-numeric:tabular-nums;letter-spacing:-.02em}',
  '.ct-best{font-weight:500;font-size:12.5px;line-height:1.2}.ct-best b{font-weight:900}',
  '.ct-note.bump{animation:ct-bump .45s cubic-bezier(.2,.9,.25,1.4)}',
  '@keyframes ct-bump{0%{transform:rotate(-2.5deg) scale(1)}40%{transform:rotate(-4deg) scale(1.08)}100%{transform:rotate(-2.5deg) scale(1)}}',
  '.ct-right{display:flex;gap:8px;align-items:flex-start}',
  '.ct-wind{background:var(--ct-panel);border:1px solid var(--ct-line);border-radius:14px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:9px 14px 10px;display:grid;gap:5px;justify-items:end;min-width:132px}',
  '.ct-wind-read{display:flex;align-items:center;gap:10px;font-weight:900;font-size:28px;line-height:1;font-variant-numeric:tabular-nums}',
  '.ct-arrow{width:34px;height:20px;color:var(--ct-note);transition:transform .35s cubic-bezier(.3,.8,.3,1)}.ct-arrow.left{transform:scaleX(-1)}',
  '.ct-bar{width:100%;height:4px;border-radius:2px;background:var(--ct-line);position:relative;overflow:hidden}',
  '.ct-bar i{position:absolute;top:0;bottom:0;left:50%;width:0;background:var(--ct-note);transition:left .35s,width .35s}',
  '.ct-sound{pointer-events:auto;width:44px;height:44px;padding:0;display:grid;place-items:center;border-radius:50%;border:1px solid var(--ct-line);background:var(--ct-panel);color:var(--ct-ink);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);cursor:pointer}',
  '.ct-sound svg{width:21px;height:21px}',
  '.ct-root button:focus-visible{outline:2px solid var(--ct-note);outline-offset:2px}',
  '.ct-levels{position:absolute;z-index:3;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);left:50%;transform:translateX(-50%);display:flex;gap:4px;padding:4px;background:var(--ct-panel);border:1px solid var(--ct-line);border-radius:16px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}',
  '.ct-levels button{pointer-events:auto;cursor:pointer;display:grid;gap:4px;justify-items:center;min-width:84px;padding:8px 14px;border:0;border-radius:12px;background:transparent;color:var(--ct-ink);font-weight:700;font-size:15px;line-height:1}',
  '.ct-levels button small{font-weight:500;font-size:11.5px;line-height:1;opacity:.68;letter-spacing:.02em;font-variant-numeric:tabular-nums}',
  '.ct-levels button[aria-pressed="true"]{background:var(--ct-ink);color:#1d2226}.ct-levels button[aria-pressed="true"] small{opacity:.8}',
  '.ct-hint{position:absolute;z-index:3;left:50%;transform:translateX(-50%);pointer-events:none;bottom:calc(env(safe-area-inset-bottom,0px) + 84px);width:max-content;max-width:calc(100% - 32px);text-align:center;font-weight:500;font-size:15px;line-height:1.3;background:var(--ct-panel);border:1px solid var(--ct-line);border-radius:999px;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);padding:8px 16px;transition:opacity .6s}',
  '.ct-hint.gone{opacity:0}',
  '.ct-toast{position:absolute;z-index:3;left:0;right:0;top:27%;display:grid;justify-items:center;gap:6px;pointer-events:none;opacity:0;text-align:center;padding-inline:16px}',
  '.ct-toast b{font-weight:900;font-size:clamp(38px,9.5vw,72px);line-height:1;letter-spacing:-.015em;color:var(--ct-note);text-shadow:0 4px 22px rgba(0,0,0,.55);text-wrap:balance}',
  '.ct-toast span{font-weight:700;font-size:14px;line-height:1;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 2px 8px rgba(0,0,0,.7)}',
  '.ct-toast.miss b{color:var(--ct-miss);text-shadow:0 1px 0 rgba(255,255,255,.35),0 4px 18px rgba(0,0,0,.28)}',
  '.ct-toast.show{animation:ct-pop 1.25s cubic-bezier(.2,.9,.2,1) forwards}',
  '@keyframes ct-pop{0%{opacity:0;transform:translateY(12px) scale(.86)}14%{opacity:1;transform:translateY(0) scale(1.04)}24%{transform:scale(1)}72%{opacity:1}100%{opacity:0;transform:translateY(-16px)}}',
  '.ct-fallback{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:24px;font-weight:700;font-size:17px;line-height:1.5}',
  '@media (max-width:420px){.ct-num{font-size:40px}.ct-wind{min-width:116px;padding:8px 12px}.ct-wind-read{font-size:24px}.ct-levels button{min-width:74px;padding:8px 10px}}',
  '@media (prefers-reduced-motion:reduce){.ct-toast.show{animation:ct-fade 1.2s linear forwards}.ct-note.bump{animation:none}@keyframes ct-fade{0%,75%{opacity:1}100%{opacity:0}}}'
].join('\n');

var SPEAKER = '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>';
var SVG_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

var TEMPLATE =
  '<canvas class="ct-gl" data-ct="gl" aria-label="Office with a wire wastebasket. Flick up to toss the paper ball."></canvas>' +
  '<canvas class="ct-trail" data-ct="trail" aria-hidden="true"></canvas>' +
  '<div class="ct-hud">' +
    '<div class="ct-note" data-ct="note"><span class="ct-label">In a row</span><span class="ct-num" data-ct="streak">0</span><span class="ct-best">Best <b data-ct="best">0</b></span></div>' +
    '<div class="ct-right">' +
      '<div class="ct-wind" aria-live="polite"><span class="ct-label">Wind</span>' +
        '<div class="ct-wind-read"><svg class="ct-arrow" data-ct="windArrow" viewBox="0 0 34 20" aria-hidden="true"><path d="M2 10h26M21 3l7 7-7 7" stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span data-ct="windVal">0.00</span></div>' +
        '<div class="ct-bar" aria-hidden="true"><i data-ct="windBar"></i></div>' +
      '</div>' +
      '<button class="ct-sound" data-ct="soundBtn" type="button" aria-label="Sound" aria-pressed="true">' +
        '<svg data-ct="icoOn" ' + SVG_ATTRS + '>' + SPEAKER + '<path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>' +
        '<svg data-ct="icoOff" ' + SVG_ATTRS + ' hidden>' + SPEAKER + '<line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>' +
      '</button>' +
    '</div>' +
  '</div>' +
  '<div class="ct-toast" data-ct="toast" aria-live="polite"><b data-ct="toastMain"></b><span data-ct="toastSub"></span></div>' +
  '<div class="ct-hint" data-ct="hint">Flick up to toss. Aim into the wind.</div>' +
  '<nav class="ct-levels" data-ct="levels" aria-label="Throw distance">' +
    '<button type="button" data-i="0" aria-pressed="true">Desk<small>3.0 m</small></button>' +
    '<button type="button" data-i="1" aria-pressed="false">Office<small>4.5 m</small></button>' +
    '<button type="button" data-i="2" aria-pressed="false">Lobby<small>6.0 m</small></button>' +
  '</nav>';

function injectCSS() {
  if (document.getElementById('crumple-toss-css')) return;
  var st = document.createElement('style'); st.id = 'crumple-toss-css'; st.textContent = CSS;
  document.head.appendChild(st);
}

/**
 * Mount the game into an element.
 * opts.font        font-family already loaded on the page (default "Satoshi")
 * opts.lockScroll  stop the page scrolling / pull-to-refresh (for a dedicated game page)
 */
export function mount(root, opts) {
  opts = opts || {};
  if (root.__crumpleToss) return root.__crumpleToss;
  var FAMILY = opts.font || 'Satoshi';
  var FONT_STACK = '"' + FAMILY + '", "Helvetica Neue", Arial, sans-serif';
  var MAX_DPR = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ? 1.75 : 2;
  var running = false;

  injectCSS();
  root.classList.add('ct-root');
  root.style.setProperty('--ct-font', FONT_STACK);
  root.innerHTML = TEMPLATE;
  if (opts.lockScroll) {
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
  }
  var $ = function (id) { return root.querySelector('[data-ct="' + id + '"]'); };


  /* ---------- storage (per-viewer convenience only) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- constants (metres, seconds) ---------- */
  var G = 9.8;
  var R = 0.05;            // paper ball radius
  var BIN_R = 0.2;         // rim radius
  var BIN_RB = 0.155;      // bottom radius (tapered basket)
  var BIN_H = 0.42;
  var RIM_T = 0.009;
  var WIND_ACC = 0.32;     // m/s² per wind unit
  var AIM_GAIN = 0.9;
  var START = new THREE.Vector3(0, 1.02, -0.3);
  var CAM_POS = new THREE.Vector3(0, 1.42, 0.55);
  var ROOM_W = 3.6;
  var MAX_BALLS = 18;
  var BACK_GAP = 2.3;      // bin to back wall
  var MARKER_BLUE = '#0000FF';

  var LEVELS = [
    { id: 'desk',   dist: 3.0, maxWind: 2.2, T: 1.0 },
    { id: 'office', dist: 4.5, maxWind: 3.6, T: 1.12 },
    { id: 'lobby',  dist: 6.0, maxWind: 5.0, T: 1.25 }
  ];

  var levelIdx = Math.max(0, Math.min(2, store.get('ct-level', 0) | 0));
  var best = store.get('ct-best', { desk: 0, office: 0, lobby: 0 });
  var streaks = store.get('ct-streak', { desk: 0, office: 0, lobby: 0 });
  var muted = !!store.get('ct-muted', false);
  var streak = 0, wind = 0, binZ = -LEVELS[levelIdx].dist, backZ = 0;
  var clock = 0, nextAt = 0, firstThrow = true;

  /* ---------- renderer ---------- */
  var canvas = $('gl');
  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (e) {
    root.insertAdjacentHTML('beforeend', '<div class="ct-fallback">This browser could not start WebGL, which the game needs.</div>');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  var maxAniso = renderer.capabilities.getMaxAnisotropy();

  var scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a3035);
  scene.fog = new THREE.Fog(0x2a3035, 11, 24);

  var camera = new THREE.PerspectiveCamera(48, 1, 0.05, 60);
  camera.position.copy(CAM_POS);

  /* ---------- texture helpers ---------- */
  function canvasTex(w, h, draw, rx, ry) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); draw(g, w, h);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    if (rx) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); }
    t.userData = { canvas: c, ctx: g };
    return t;
  }
  function speckle(g, w, h, n, colors, size) {
    for (var i = 0; i < n; i++) {
      g.fillStyle = colors[(Math.random() * colors.length) | 0];
      g.fillRect(Math.random() * w, Math.random() * h, size, size);
    }
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  var carpetTex = canvasTex(256, 256, function (g, w, h) {
    g.fillStyle = '#3a4550'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 6000, ['#33404b', '#45515c', '#2f3943', '#4a5763'], 2);
    g.globalAlpha = 0.18; g.strokeStyle = '#1e252b'; g.lineWidth = 1;
    for (var y = 6; y < h; y += 8) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.globalAlpha = 0.5; g.strokeStyle = '#252d34'; g.lineWidth = 3; g.strokeRect(0, 0, w, h);
    g.globalAlpha = 1;
  }, 1, 1);

  var tileTex = canvasTex(256, 256, function (g, w, h) {
    var s = 128;
    for (var i = 0; i < 2; i++) for (var j = 0; j < 2; j++) {
      g.fillStyle = 'hsl(28, 7%, ' + rnd(40, 45).toFixed(1) + '%)'; g.fillRect(i * s, j * s, s, s);
    }
    speckle(g, w, h, 2600, ['rgba(40,36,32,.35)', 'rgba(170,160,148,.28)', 'rgba(90,82,74,.4)'], 2);
    g.strokeStyle = 'rgba(28,25,22,.65)'; g.lineWidth = 2;
    for (var k = 0; k <= 2; k++) {
      g.beginPath(); g.moveTo(k * s, 0); g.lineTo(k * s, h); g.stroke();
      g.beginPath(); g.moveTo(0, k * s); g.lineTo(w, k * s); g.stroke();
    }
  }, 1, 1);

  var wallTex = canvasTex(256, 256, function (g, w, h) {
    g.fillStyle = '#c9d0c8'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 3000, ['#c3cac2', '#cfd6ce', '#bfc6be'], 2);
  }, 6, 2);

  var meshTex = canvasTex(256, 256, function (g, w, h) {
    g.clearRect(0, 0, w, h);
    g.strokeStyle = '#ffffff'; g.lineWidth = 15; g.lineCap = 'square';
    for (var k = -w; k <= 2 * w; k += 64) {
      g.beginPath(); g.moveTo(k, 0); g.lineTo(k + h, h); g.stroke();
      g.beginPath(); g.moveTo(k, h); g.lineTo(k + h, 0); g.stroke();
    }
  }, 10, 3.2);

  var paperTex = canvasTex(256, 256, function (g, w, h) {
    g.fillStyle = '#f7f5ee'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 900, ['#ecebe4', '#fbfaf5'], 2);
    g.strokeStyle = '#8fb1dc'; g.lineWidth = 2;
    for (var y = 14; y < h; y += 20) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    g.strokeStyle = '#e48a8a'; g.beginPath(); g.moveTo(42, 0); g.lineTo(42, h); g.stroke();
    g.fillStyle = '#4b5a78'; g.globalAlpha = 0.55; g.font = '600 15px cursive';
    g.fillText('todo: call Dana', 54, 50); g.fillText('Q3 numbers??', 60, 110); g.fillText('re: re: re: budget', 52, 190);
    g.globalAlpha = 1;
  });

  var dotTex = canvasTex(32, 32, function (g) {
    var gr = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 32, 32);
  });

  var MARKER = '"Marker Felt","Chalkboard SE","Segoe Print","Bradley Hand","Comic Sans MS",cursive';
  function sticky(g, x, y, color, lines, rot) {
    g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(4, 6, 150, 150);
    g.fillStyle = color; g.fillRect(0, 0, 150, 150);
    g.fillStyle = '#2b2b2b'; g.font = '600 30px ' + MARKER;
    lines.forEach(function (l, i) { g.fillText(l, 16, 52 + i * 40); });
    g.restore();
  }
  var boardTex = canvasTex(1024, 512, function (g, w, h) {
    g.fillStyle = '#f3f5f2'; g.fillRect(0, 0, w, h);
    g.globalAlpha = 0.05; g.fillStyle = '#3c4c70';
    for (var i = 0; i < 16; i++) g.fillRect(Math.random() * w, Math.random() * h, 120 + Math.random() * 220, 8 + Math.random() * 18);
    g.globalAlpha = 1;
    g.fillStyle = MARKER_BLUE; g.font = '700 58px ' + MARKER; g.fillText('SPRINT 47', 60, 96);
    g.strokeStyle = '#c8372d'; g.lineWidth = 5; g.beginPath(); g.moveTo(58, 114); g.quadraticCurveTo(200, 126, 336, 108); g.stroke();
    g.font = '600 34px ' + MARKER;
    [['ship pricing page', true], ['fix the nav', false], ['empty the bin', false]].forEach(function (it, i) {
      var y = 186 + i * 60;
      g.strokeStyle = MARKER_BLUE; g.lineWidth = 3; g.strokeRect(64, y - 28, 28, 28);
      if (it[1]) { g.strokeStyle = '#2f8a4a'; g.lineWidth = 6; g.beginPath(); g.moveTo(66, y - 14); g.lineTo(78, y - 2); g.lineTo(100, y - 38); g.stroke(); }
      g.fillStyle = MARKER_BLUE; g.fillText(it[0], 110, y);
    });
    g.strokeStyle = '#2d2d2d'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(610, 110); g.lineTo(610, 380); g.lineTo(950, 380); g.stroke();
    var bars = [70, 120, 95, 180, 240];
    g.fillStyle = '#2f8a4a';
    bars.forEach(function (b, i) { g.fillRect(636 + i * 62, 380 - b, 38, b - 3); });
    g.fillStyle = '#2d2d2d'; g.font = '600 28px ' + MARKER; g.fillText('balls in bin / day', 630, 430);
    sticky(g, 420, 300, '#ffd84d', ['standup', '9:30'], -0.06);
    sticky(g, 440, 40, '#ff9fb3', ['no paper', 'planes'], 0.05);
  });

  /* ---------- lights ---------- */
  scene.add(new THREE.HemisphereLight(0xf3f6ff, 0x39414a, 0.85));
  var sun = new THREE.DirectionalLight(0xfff1dc, 1.55);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.01;
  var sc = sun.shadow.camera; sc.left = -5; sc.right = 5; sc.top = 5; sc.bottom = -5; sc.near = 0.5; sc.far = 22;
  scene.add(sun); scene.add(sun.target);

  /* ---------- room shell ---------- */
  var carpetMat = new THREE.MeshStandardMaterial({ map: carpetTex, roughness: 0.95 });
  carpetTex.repeat.set(ROOM_W * 2 / 0.5, 20 / 0.5);
  var tileMat = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.38, metalness: 0.05 });
  tileTex.repeat.set(ROOM_W * 2 / 1.2, 20 / 1.2);
  var floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, 20), carpetMat);
  floor.rotation.x = -Math.PI / 2; floor.position.z = -7; floor.receiveShadow = true; scene.add(floor);

  var wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });
  var backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, 3.1), wallMat);
  backWall.receiveShadow = true; scene.add(backWall);
  var sideGeo = new THREE.PlaneGeometry(20, 3.1);
  var leftWall = new THREE.Mesh(sideGeo, wallMat); leftWall.rotation.y = Math.PI / 2; leftWall.position.set(-ROOM_W, 1.55, -7); leftWall.receiveShadow = true; scene.add(leftWall);
  var rightWall = new THREE.Mesh(sideGeo, wallMat); rightWall.rotation.y = -Math.PI / 2; rightWall.position.set(ROOM_W, 1.55, -7); rightWall.receiveShadow = true; scene.add(rightWall);
  var ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, 20), new THREE.MeshStandardMaterial({ color: 0xe4e6e2, roughness: 1 }));
  ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 3.1, -7); scene.add(ceil);
  var panelMat = new THREE.MeshBasicMaterial({ color: 0xfff8ea });
  for (var pz = -1; pz > -15; pz -= 2.4) {
    [-1.2, 1.2].forEach(function (px) {
      var p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), panelMat);
      p.rotation.x = Math.PI / 2; p.position.set(px, 3.09, pz); scene.add(p);
    });
  }
  var trimMat = new THREE.MeshStandardMaterial({ color: 0x353c42, roughness: 0.6 });
  var backTrim = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W * 2, 0.09, 0.02), trimMat); scene.add(backTrim);
  [-1, 1].forEach(function (s) {
    var t = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 20), trimMat);
    t.position.set(s * (ROOM_W - 0.01), 0.045, -7); scene.add(t);
  });
  var boardFrame = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.3, 0.035), new THREE.MeshStandardMaterial({ color: 0x9aa1a6, metalness: 0.4, roughness: 0.4 }));
  var board = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.35 }));
  scene.add(boardFrame); scene.add(board);

  /* ---------- wastebasket ---------- */
  var bin = new THREE.Group(); scene.add(bin);
  var binMat = new THREE.MeshStandardMaterial({ color: 0xb4bcc1, map: meshTex, alphaTest: 0.28, side: THREE.DoubleSide, metalness: 0.35, roughness: 0.45 });
  var binWall = new THREE.Mesh(new THREE.CylinderGeometry(BIN_R, BIN_RB, BIN_H, 48, 1, true), binMat);
  binWall.position.y = BIN_H / 2; binWall.castShadow = true; binWall.receiveShadow = true;
  binWall.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: meshTex, alphaTest: 0.28 });
  bin.add(binWall);
  var steel = new THREE.MeshStandardMaterial({ color: 0xc9d0d4, metalness: 0.55, roughness: 0.3 });
  var rim = new THREE.Mesh(new THREE.TorusGeometry(BIN_R, RIM_T, 10, 64), steel);
  rim.rotation.x = Math.PI / 2; rim.position.y = BIN_H; rim.castShadow = true; bin.add(rim);
  var band = new THREE.Mesh(new THREE.TorusGeometry(BIN_RB + 0.002, 0.006, 8, 48), steel);
  band.rotation.x = Math.PI / 2; band.position.y = 0.012; bin.add(band);
  var bottom = new THREE.Mesh(new THREE.CircleGeometry(BIN_RB, 40), new THREE.MeshStandardMaterial({ color: 0x5d666c, metalness: 0.3, roughness: 0.6 }));
  bottom.rotation.x = -Math.PI / 2; bottom.position.y = 0.006; bottom.receiveShadow = true; bin.add(bottom);

  function rAt(y) { var k = Math.max(0, Math.min(1, y / BIN_H)); return BIN_RB + (BIN_R - BIN_RB) * k; }

  /* ---------- desk fans (one each side; the spinning one is blowing) ---------- */
  function makeFan() {
    var g = new THREE.Group();
    var body = new THREE.MeshStandardMaterial({ color: 0xece8df, roughness: 0.5 });
    var dark = new THREE.MeshStandardMaterial({ color: 0x2b3035, roughness: 0.55, metalness: 0.25 });
    var bladeMat = new THREE.MeshStandardMaterial({ color: 0x7fb3c9, roughness: 0.4, metalness: 0.05 });
    var base = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.035, 32), body); base.position.y = 0.0175;
    var stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.37, 12), dark); stem.position.y = 0.2;
    var head = new THREE.Group(); head.position.y = 0.43;
    var motor = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.062, 0.11, 24), body); motor.rotation.x = Math.PI / 2; motor.position.z = -0.065;
    var cageA = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 8, 48), dark); cageA.position.z = 0.03;
    var cageB = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 8, 48), dark); cageB.position.z = -0.02;
    head.add(motor, cageA, cageB);
    for (var i = 0; i < 4; i++) {
      var sp = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.34, 0.004), dark);
      sp.rotation.z = i * Math.PI / 4; sp.position.z = 0.034; head.add(sp);
    }
    var rotor = new THREE.Group(); rotor.position.z = 0.005;
    var hub = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 10), body); hub.scale.z = 0.7; rotor.add(hub);
    for (var b = 0; b < 3; b++) {
      var pivot = new THREE.Group(); pivot.rotation.z = b * Math.PI * 2 / 3;
      var blade = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 10), bladeMat);
      blade.scale.set(0.058, 0.08, 0.008); blade.position.y = 0.088; blade.rotation.y = 0.45;
      pivot.add(blade); rotor.add(pivot);
    }
    head.add(rotor);
    g.add(base, stem, head);
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    g.scale.setScalar(1.55);
    g.userData = { rotor: rotor, speed: 0 };
    return g;
  }
  var fanL = makeFan(), fanR = makeFan();
  fanL.rotation.y = Math.PI / 2 - 0.62;
  fanR.rotation.y = -Math.PI / 2 + 0.62;
  scene.add(fanL, fanR);

  /* =====================================================================
     OFFICE DECOR: built per distance, static parts merged by material
     so each scene costs a couple dozen draw calls.
     ===================================================================== */
  function std(o) { return new THREE.MeshStandardMaterial(o); }
  function basic(o) { o.toneMapped = false; return new THREE.MeshBasicMaterial(o); }

  var fabricTex = canvasTex(128, 128, function (g, w, h) {
    g.fillStyle = '#80878d'; g.fillRect(0, 0, w, h);
    speckle(g, w, h, 3000, ['#757c82', '#8b9298', '#6e757b', '#959ca2'], 1);
  }, 3, 2);
  var woodTex = canvasTex(256, 128, function (g, w, h) {
    g.fillStyle = '#c99f5f'; g.fillRect(0, 0, w, h);
    for (var i = 0; i < 46; i++) {
      g.strokeStyle = Math.random() < 0.5 ? 'rgba(130,88,40,.22)' : 'rgba(232,196,138,.25)';
      g.lineWidth = 1 + Math.random() * 2;
      var y = Math.random() * h;
      g.beginPath(); g.moveTo(0, y);
      g.bezierCurveTo(w * 0.3, y + rnd(-4, 4), w * 0.6, y + rnd(-4, 4), w, y + rnd(-3, 3)); g.stroke();
    }
  });
  var codeTex = canvasTex(256, 512, function (g, w, h) {
    g.fillStyle = '#161b24'; g.fillRect(0, 0, w, h);
    var cols = ['#7aa2f7', '#9ece6a', '#e0af68', '#bb9af7', '#7dcfff', '#c0caf5', '#565f89'];
    for (var y = 10; y < h; y += 13) {
      var x = 14 + ((Math.random() * 4) | 0) * 14;
      var n = (Math.random() * 5) | 0;
      for (var k = 0; k < n; k++) { var ww = rnd(14, 60); g.fillStyle = pick(cols); g.fillRect(x, y, ww, 6); x += ww + 6; if (x > w - 20) break; }
    }
  });
  codeTex.wrapS = codeTex.wrapT = THREE.RepeatWrapping; codeTex.repeat.set(1, 0.5);
  var sheetTex = canvasTex(256, 160, function (g, w, h) {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#1f7a45'; g.fillRect(0, 0, w, 16);
    g.fillStyle = '#e8eef0'; g.fillRect(0, 16, 22, h); g.fillRect(0, 16, w, 12);
    g.strokeStyle = '#d5dbde'; g.lineWidth = 1;
    for (var y = 28; y < h; y += 11) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    for (var x = 22; x < w; x += 46) { g.beginPath(); g.moveTo(x, 16); g.lineTo(x, h); g.stroke(); }
    g.fillStyle = '#3d4449';
    for (y = 31; y < h; y += 11) for (x = 26; x < w - 30; x += 46) if (Math.random() < 0.8) g.fillRect(x + rnd(6, 14), y + 3, rnd(14, 26), 4);
    g.fillStyle = '#ffd84d'; g.fillRect(114, 72, 44, 10);
  });
  var dashTex = canvasTex(512, 256, function (g, w, h) {
    g.fillStyle = '#10161f'; g.fillRect(0, 0, w, h);
    for (var p = 0; p < 2; p++) {
      var ox = p * 256;
      g.fillStyle = '#1b2430'; g.fillRect(ox + 10, 10, 236, 70); g.fillRect(ox + 10, 90, 236, 156);
      g.fillStyle = '#e9edf2'; g.fillRect(ox + 20, 22, 60, 22); g.fillStyle = '#5fd39b'; g.fillRect(ox + 20, 52, 40, 10);
      g.fillStyle = '#e9edf2'; g.fillRect(ox + 130, 22, 70, 22); g.fillStyle = '#ff8f7e'; g.fillRect(ox + 130, 52, 34, 10);
      g.strokeStyle = '#4da3ff'; g.lineWidth = 4; g.beginPath();
      for (var i = 0; i <= 10; i++) { var xx = ox + 20 + i * 21.5, yy = 220 - 20 - i * 9 - Math.sin(i * 1.3 + p) * 18; if (i) g.lineTo(xx, yy); else g.moveTo(xx, yy); }
      g.stroke();
    }
  });
  dashTex.wrapS = THREE.RepeatWrapping; dashTex.repeat.set(0.5, 1);
  var clockTex = canvasTex(128, 128, function (g) {
    g.fillStyle = '#f7f6f1'; g.beginPath(); g.arc(64, 64, 63, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#22262a';
    for (var i = 0; i < 12; i++) {
      g.save(); g.translate(64, 64); g.rotate(i * Math.PI / 6);
      g.fillRect(-1.5, -58, 3, i % 3 === 0 ? 12 : 7); g.restore();
    }
  });
  // Wall calendar for the viewer's current month, with today circled
  function makeCalTex() {
    return canvasTex(256, 320, function (g, w, h) {
      var now = new Date(), y = now.getFullYear(), mo = now.getMonth(), today = now.getDate();
      var first = new Date(y, mo, 1).getDay(), days = new Date(y, mo + 1, 0).getDate();
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#c8372d'; g.fillRect(0, 0, w, 58);
      g.fillStyle = '#ffffff'; g.font = '900 30px ' + FONT_STACK; g.textAlign = 'left';
      g.fillText(now.toLocaleString('en-US', { month: 'long' }).toUpperCase(), 16, 40);
      g.font = '700 20px ' + FONT_STACK; g.textAlign = 'right'; g.fillText(String(y), w - 16, 40);
      var cw = (w - 16) / 7, x0 = 8 + cw / 2;
      g.textAlign = 'center'; g.fillStyle = '#8a9196'; g.font = '700 15px ' + FONT_STACK;
      ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d, i) { g.fillText(d, x0 + i * cw, 84); });
      g.font = '500 17px ' + FONT_STACK;
      for (var d = 1; d <= days; d++) {
        var cell = first + d - 1, cx = x0 + (cell % 7) * cw, cy = 116 + Math.floor(cell / 7) * 38;
        g.fillStyle = d < today ? '#b4babe' : '#2e3439';
        g.fillText(String(d), cx, cy);
        if (d < today) { g.strokeStyle = 'rgba(200,55,45,.45)'; g.lineWidth = 2; g.beginPath(); g.moveTo(cx - 9, cy - 14); g.lineTo(cx + 9, cy + 2); g.stroke(); }
        if (d === today) { g.strokeStyle = MARKER_BLUE; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy - 6, 15, 0, Math.PI * 2); g.stroke(); }
      }
    });
  }
  var brbTex = canvasTex(64, 40, function (g) {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 64, 40);
    g.fillStyle = '#0d1530'; g.font = '700 22px ' + FONT_STACK; g.textAlign = 'center'; g.fillText('brb', 32, 28);
  });

  var M = {
    fabric: std({ map: fabricTex, roughness: 1 }),
    trim: std({ color: 0x5d646a, roughness: 0.5, metalness: 0.3 }),
    wood: std({ map: woodTex, roughness: 0.55 }),
    deskDark: std({ color: 0x4a4f55, roughness: 0.7 }),
    black: std({ color: 0x1d2024, roughness: 0.55 }),
    seat: std({ color: 0x34383d, roughness: 0.9 }),
    metal: std({ color: 0x969da3, roughness: 0.45, metalness: 0.35 }),
    metalLight: std({ color: 0xa9b0b5, roughness: 0.4, metalness: 0.35 }),
    plastic: std({ color: 0xe2dfd8, roughness: 0.6 }),
    pot: std({ color: 0xc56a3d, roughness: 0.85 }),
    potWhite: std({ color: 0xeeebe4, roughness: 0.6 }),
    soil: std({ color: 0x3b2a1e, roughness: 1 }),
    leaf: std({ color: 0x3f7d3b, roughness: 0.7, flatShading: true, side: THREE.DoubleSide }),
    leafDark: std({ color: 0x2c6131, roughness: 0.7, flatShading: true, side: THREE.DoubleSide }),
    stem: std({ color: 0x5a4a32, roughness: 0.9 }),
    paper: std({ color: 0xf4f2ea, roughness: 0.9 }),
    white: std({ color: 0xf0eee8, roughness: 0.5 }),
    sofa: std({ color: 0x27415a, roughness: 0.95 }),
    sofaCush: std({ color: 0x31506c, roughness: 0.95 }),
    ochre: std({ color: 0xa8641f, roughness: 0.9 }),
    rug: std({ color: 0x5e4a3f, roughness: 1 }),
    water: std({ color: 0x8cc4ec, roughness: 0.1, transparent: true, opacity: 0.55 }),
    red: std({ color: 0xc8372d, roughness: 0.6 }),
    yellow: std({ color: 0xe9b93a, roughness: 0.6 }),
    shade: std({ color: 0x1d2024, roughness: 0.5, side: THREE.DoubleSide }),
    clockFace: std({ map: clockTex, roughness: 0.5 }),
    steel: steel
  };
  var BINDERS = [0x2d4f8e, 0xb8402f, 0x2f7a4a, 0xd9a531, 0x34383d, 0x7a4f9a, 0x2a7f8f].map(function (c) { return std({ color: c, roughness: 0.6 }); });
  var MUGS = [0xf0eee8, 0x2d4f8e, 0xc8372d, 0x2f7a4a].map(function (c) { return std({ color: c, roughness: 0.4 }); });
  var NOTES = [0xffd84d, 0xff9fb3, 0x9fe0c0, 0x9cc9ff].map(function (c) { return std({ color: c, roughness: 0.9, side: THREE.DoubleSide }); });
  var SCR = {
    code: basic({ map: codeTex }),
    sheet: basic({ map: sheetTex }),
    dash: basic({ map: dashTex }),
    saver: basic({ color: 0x0b1430 }),
    glow: basic({ color: 0xfff2d6 }),
    cab: basic({ color: 0xf6e8cc })
  };

  /* --- geometry merging --- */
  function mergeGeos(geos) {
    var n = 0; geos.forEach(function (g) { n += g.attributes.position.count; });
    var pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), uv = new Float32Array(n * 2), o = 0;
    geos.forEach(function (g) {
      pos.set(g.attributes.position.array, o * 3);
      nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      o += g.attributes.position.count;
    });
    var m = new THREE.BufferGeometry();
    m.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    m.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    m.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    m.computeBoundingSphere();
    return m;
  }
  function bake(root) {
    root.updateMatrixWorld(true);
    var buckets = {}, dyn = [];
    (function walk(o) {
      if (o !== root && o.userData.dyn) { dyn.push(o); return; }
      if (o.isMesh) {
        var g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
        g.applyMatrix4(o.matrixWorld);
        var k = o.material.uuid;
        if (!buckets[k]) buckets[k] = { mat: o.material, geos: [], cast: false };
        buckets[k].geos.push(g);
        if (o.castShadow) buckets[k].cast = true;
      }
      o.children.forEach(walk);
    })(root);
    var out = new THREE.Group();
    Object.keys(buckets).forEach(function (k) {
      var b = buckets[k];
      var m = new THREE.Mesh(mergeGeos(b.geos), b.mat);
      m.castShadow = b.cast; m.receiveShadow = true;
      out.add(m);
      b.geos.forEach(function (g) { g.dispose(); });
    });
    out.updateMatrixWorld(true);
    dyn.forEach(function (d) { out.attach(d); });
    return out;
  }
  function baked(fn) { var t = new THREE.Group(); fn(t); return bake(t); }

  /* --- primitives --- */
  function mk(geo, mat, x, y, z, parent, rx, ry, rz, noShadow) {
    var m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.set(rx || 0, ry || 0, rz || 0);
    m.castShadow = !noShadow; m.receiveShadow = true;
    parent.add(m); return m;
  }
  function bx(parent, mat, w, h, d, x, y, z, ry, noShadow) { return mk(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent, 0, ry || 0, 0, noShadow); }
  function cyl(parent, mat, rt, rb, h, x, y, z, seg) { return mk(new THREE.CylinderGeometry(rt, rb, h, seg || 16), mat, x, y, z, parent); }
  function plane(parent, mat, w, h, x, y, z, ry, rx) { return mk(new THREE.PlaneGeometry(w, h), mat, x, y, z, parent, rx || 0, ry || 0, 0, true); }

  // AABB collider for a box given in a group's local frame at (x, z) rotated by ry
  function addCol(L, x, z, ry, lx0, lx1, y0, y1, lz0, lz1) {
    var c = Math.cos(ry), s = Math.sin(ry), xs = [], zs = [];
    [[lx0, lz0], [lx1, lz0], [lx0, lz1], [lx1, lz1]].forEach(function (q) {
      xs.push(x + q[0] * c + q[1] * s); zs.push(z - q[0] * s + q[1] * c);
    });
    L.cols.push({ x0: Math.min.apply(0, xs), x1: Math.max.apply(0, xs), y0: y0, y1: y1, z0: Math.min.apply(0, zs), z1: Math.max.apply(0, zs) });
  }

  /* --- furniture --- */
  function partitionX(L, parent, x0, x1, z, h) { // runs along x
    var w = Math.abs(x1 - x0), cx = (x0 + x1) / 2;
    bx(parent, M.fabric, w, h, 0.06, cx, h / 2, z);
    bx(parent, M.trim, w + 0.02, 0.03, 0.075, cx, h + 0.015, z);
    addCol(L, cx, z, 0, -w / 2, w / 2, 0, h + 0.03, -0.04, 0.04);
  }
  function partitionZ(L, parent, x, z0, z1, h) { // runs along z
    var d = Math.abs(z1 - z0), cz = (z0 + z1) / 2;
    bx(parent, M.fabric, 0.06, h, d, x, h / 2, cz);
    bx(parent, M.trim, 0.075, 0.03, d + 0.02, x, h + 0.015, cz);
    addCol(L, x, cz, 0, -0.04, 0.04, 0, h + 0.03, -d / 2, d / 2);
  }

  function plant(L, parent, x, y, z, s, tall) {
    var pot = new THREE.Group(); pot.position.set(x, y, z); pot.scale.setScalar(s); parent.add(pot);
    cyl(pot, tall ? M.potWhite : M.pot, 0.09, 0.07, 0.16, 0, 0.08, 0, 18);
    mk(new THREE.CircleGeometry(0.084, 16), M.soil, 0, 0.155, 0, pot, -Math.PI / 2, 0, 0, true);
    var holder = new THREE.Group(); holder.userData.dyn = true; holder.position.set(x, y + 0.15 * s, z); holder.scale.setScalar(s);
    var sway = baked(function (t) {
      var leafGeo = new THREE.SphereGeometry(1, 6, 5);
      var n = tall ? 22 : 9, top = tall ? 0.85 : 0.16;
      if (tall) cyl(t, M.stem, 0.008, 0.012, top, 0, top / 2, 0, 6);
      for (var i = 0; i < n; i++) {
        var p = new THREE.Group(); p.rotation.y = i * 2.399 + rnd(-0.3, 0.3);
        p.position.y = tall ? rnd(0.15, top) : rnd(0, 0.05);
        var lf = mk(leafGeo, i % 2 ? M.leaf : M.leafDark, 0, 0.09, 0.05, p, rnd(0.5, 1.05), 0, 0);
        lf.scale.set(0.04, 0.12, 0.012);
        if (tall) lf.scale.multiplyScalar(1.5);
        t.add(p);
      }
    });
    holder.add(sway); parent.add(holder);
    var ph = Math.random() * 6;
    L.tick.push(function (dt, t) {
      sway.rotation.z = Math.sin(t * 0.8 + ph) * 0.035;
      sway.rotation.x = Math.sin(t * 0.55 + ph * 1.3) * 0.025;
    });
    addCol(L, x, z, 0, -0.09 * s, 0.09 * s, y, y + 0.16 * s, -0.09 * s, 0.09 * s);
  }

  function chair(L, parent, x, z, ry, swivel) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    var base = baked(function (t) {
      for (var i = 0; i < 5; i++) {
        var p = new THREE.Group(); p.rotation.y = i * Math.PI * 2 / 5; t.add(p);
        bx(p, M.black, 0.04, 0.035, 0.3, 0, 0.07, 0.14);
        mk(new THREE.SphereGeometry(0.03, 8, 6), M.black, 0, 0.03, 0.28, p);
      }
      cyl(t, M.metal, 0.022, 0.026, 0.34, 0, 0.25, 0, 10);
    });
    var top = baked(function (t) {
      bx(t, M.seat, 0.5, 0.08, 0.48, 0, 0.47, 0);
      var back = bx(t, M.seat, 0.46, 0.52, 0.07, 0, 0.82, 0.24);
      back.rotation.x = 0.12;
      bx(t, M.black, 0.04, 0.32, 0.04, 0, 0.62, 0.24);
      [-1, 1].forEach(function (s) {
        bx(t, M.black, 0.05, 0.035, 0.28, s * 0.27, 0.66, 0.02);
        bx(t, M.black, 0.03, 0.16, 0.03, s * 0.27, 0.57, 0.08);
      });
    });
    g.add(base, top);
    if (swivel) {
      g.userData.dyn = true;
      var ph = Math.random() * 6, amp = rnd(0.25, 0.45);
      L.tick.push(function (dt, t) { top.rotation.y = Math.sin(t * 0.45 + ph) * amp + Math.sin(t * 1.3 + ph) * 0.05; });
    }
    addCol(L, x, z, 0, -0.27, 0.27, 0, 0.5, -0.27, 0.27);
  }

  function cabinet(L, parent, x, z, ry, n) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    var w = 0.42, d = 0.58, h = n * 0.25 + 0.03;
    bx(g, M.metal, w, h, d, 0, h / 2, 0);
    for (var i = 0; i < n; i++) {
      var y = 0.03 + i * 0.25 + 0.12;
      bx(g, M.metalLight, w - 0.03, 0.23, 0.012, 0, y, d / 2 + 0.006);
      bx(g, M.black, 0.13, 0.02, 0.02, 0, y + 0.06, d / 2 + 0.02);
    }
    addCol(L, x, z, ry, -w / 2, w / 2, 0, h, -d / 2, d / 2);
    return h;
  }

  function binders(parent, x, y, z, along, count, len) { // along: 'x' or 'z'
    var step = len / count, o = -len / 2 + step / 2;
    for (var i = 0; i < count; i++) {
      var h = rnd(0.24, 0.31), th = rnd(0.035, 0.06);
      var mat = pick(BINDERS);
      if (along === 'z') bx(parent, mat, 0.24, h, th, x, y + h / 2, z + o + i * step, 0, true);
      else bx(parent, mat, th, h, 0.24, x + o + i * step, y + h / 2, z, 0, true);
    }
  }

  function wallClock(L, parent, x, y, z, ry, sc) {
    var g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry || 0; g.scale.setScalar(sc || 1); g.userData.dyn = true;
    cyl(g, M.white, 0.17, 0.17, 0.03, 0, 0, 0.015, 32).rotation.x = Math.PI / 2;
    mk(new THREE.CircleGeometry(0.16, 40), M.clockFace, 0, 0, 0.032, g, 0, 0, 0, true);
    mk(new THREE.TorusGeometry(0.17, 0.013, 8, 40), M.black, 0, 0, 0.03, g);
    function hand(len, w, mat, zz) {
      var p = new THREE.Group(); p.position.z = zz; g.add(p);
      bx(p, mat, w, len, 0.004, 0, len / 2 - 0.02, 0, 0, true); return p;
    }
    var hh = hand(0.09, 0.012, M.black, 0.04), mm = hand(0.135, 0.008, M.black, 0.045), ss = hand(0.15, 0.003, M.red, 0.05);
    parent.add(g);
    L.tick.push(function () {
      var d = new Date();
      var s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
      ss.rotation.z = -s / 60 * Math.PI * 2; mm.rotation.z = -m / 60 * Math.PI * 2; hh.rotation.z = -h / 12 * Math.PI * 2;
    });
  }

  // Desk with monitor. Local frame: sitter on +z side, monitor near -z edge facing +z.
  function deskUnit(L, parent, x, z, ry, o) {
    o = o || {};
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    var w = o.w || 1.5, d = 0.72, top = 0.74, mx = o.mx || 0;
    bx(g, M.wood, w, 0.035, d, 0, top - 0.0175, 0);
    bx(g, M.deskDark, 0.03, top - 0.035, d - 0.06, -w / 2 + 0.03, (top - 0.035) / 2, 0);
    bx(g, M.deskDark, 0.03, top - 0.035, d - 0.06, w / 2 - 0.03, (top - 0.035) / 2, 0);
    bx(g, M.deskDark, w - 0.06, 0.4, 0.02, 0, top - 0.25, -d / 2 + 0.04);
    // monitor
    bx(g, M.black, 0.22, 0.015, 0.16, mx, top + 0.0075, -0.2);
    bx(g, M.black, 0.035, 0.2, 0.03, mx, top + 0.1, -0.245);
    bx(g, M.black, 0.6, 0.37, 0.03, mx, top + 0.31, -0.22);
    var scrMat = SCR[o.screen || 'code'];
    plane(g, scrMat, 0.56, 0.33, mx, top + 0.31, -0.2035);
    if (o.screen === 'saver') screensaver(L, g, mx, top + 0.31, -0.201);
    bx(g, M.black, 0.42, 0.02, 0.14, mx, top + 0.01, 0.05);
    bx(g, M.black, 0.05, 0.022, 0.08, mx + 0.32, top + 0.011, 0.06);
    // clutter
    var side = Math.random() < 0.5 ? -1 : 1;
    var mug = cyl(g, pick(MUGS), 0.04, 0.036, 0.1, mx + side * 0.5, top + 0.05, 0.02, 14);
    mk(new THREE.TorusGeometry(0.025, 0.007, 6, 12), mug.material, mx + side * 0.5 + 0.045, top + 0.055, 0.02, g, 0, 0, 0);
    var pp = bx(g, M.paper, 0.21, 0.015, 0.29, mx - side * 0.5, top + 0.0075, 0.04, rnd(-0.3, 0.3));
    pp.castShadow = false;
    if (!o.plant) {
      cyl(g, M.black, 0.035, 0.032, 0.1, mx - side * 0.58, top + 0.05, -0.22, 12);
      for (var i = 0; i < 3; i++) { var pen = cyl(g, i === 1 ? M.red : M.yellow, 0.005, 0.005, 0.15, mx - side * 0.58 + rnd(-0.015, 0.015), top + 0.12, -0.22 + rnd(-0.015, 0.015), 6); pen.rotation.z = rnd(-0.2, 0.2); }
    }
    if (o.plant) plantLocal(L, g, mx + side * 0.62 * -1, top, -0.2, 0.9);
    addCol(L, x, z, ry, -w / 2, w / 2, 0, top, -d / 2, d / 2);
    addCol(L, x, z, ry, mx - 0.3, mx + 0.3, top, top + 0.5, -0.25, -0.19);
    return g;
  }
  // a plant inside a rotated local group: world pos computed for the collider
  function plantLocal(L, g, lx, ly, lz, s) {
    var pseudo = { cols: [], tick: L.tick };
    plant(pseudo, g, lx, ly, lz, s, false);
  }
  function screensaver(L, g, x, y, z) {
    var holder = new THREE.Group(); holder.position.set(x, y, z); holder.userData.dyn = true; g.add(holder);
    var mat = basic({ map: brbTex, color: 0x7fd3ff });
    var q = mk(new THREE.PlaneGeometry(0.1, 0.0625), mat, 0, 0, 0, holder, 0, 0, 0, true);
    var vx = 0.06, vy = 0.045, hx = 0.28 - 0.05, hy = 0.165 - 0.031;
    var cols = [0x7fd3ff, 0xffd84d, 0xff9fb3, 0x9fe0c0, 0xc6a8ff];
    L.tick.push(function (dt) {
      q.position.x += vx * dt; q.position.y += vy * dt;
      if (Math.abs(q.position.x) > hx) { vx = -vx; q.position.x = Math.sign(q.position.x) * hx; mat.color.setHex(pick(cols)); }
      if (Math.abs(q.position.y) > hy) { vy = -vy; q.position.y = Math.sign(q.position.y) * hy; mat.color.setHex(pick(cols)); }
    });
  }

  function newLevel() { return { root: new THREE.Group(), cols: [], tick: [] }; }
  function finish(L, staticGroup) {
    var b = bake(staticGroup);
    L.root.add(b);
    L.root.visible = false;
    scene.add(L.root);
    return L;
  }

  /* --- Desk: your own cubicle --- */
  function buildDesk() {
    var L = newLevel(), S = new THREE.Group();
    var bz = -LEVELS[0].dist, back = bz - BACK_GAP;
    var pz = bz - 1.07;                     // back partition plane
    partitionX(L, S, -2.45, 1.05, pz, 1.6);
    partitionZ(L, S, -2.45, 0.3, pz, 1.6);
    partitionZ(L, S, 1.05, pz, pz + 0.75, 1.6);
    // main desk against the back partition (bin sits just in front of it)
    deskUnit(L, S, -0.7, pz + 0.4, 0, { w: 3.4, mx: -0.75, screen: 'saver', plant: false });
    // L-return along the left partition
    var rx0 = -2.4, rx1 = -1.75, rz0 = pz + 0.76, rz1 = bz + 1.15;
    bx(S, M.wood, rx1 - rx0, 0.035, rz1 - rz0, (rx0 + rx1) / 2, 0.7225, (rz0 + rz1) / 2);
    addCol(L, (rx0 + rx1) / 2, (rz0 + rz1) / 2, 0, -(rx1 - rx0) / 2, (rx1 - rx0) / 2, 0, 0.74, -(rz1 - rz0) / 2, (rz1 - rz0) / 2);
    bx(S, M.deskDark, rx1 - rx0 - 0.06, 0.7, 0.03, (rx0 + rx1) / 2, 0.36, rz1 - 0.03);
    cabinet(L, S, -2.07, bz + 0.6, Math.PI / 2, 2);
    // desk lamp on the return
    var lamp = new THREE.Group(); lamp.position.set(-2.12, 0.74, bz + 0.85); S.add(lamp);
    cyl(lamp, M.black, 0.07, 0.08, 0.025, 0, 0.0125, 0, 18);
    var arm1 = bx(lamp, M.black, 0.02, 0.36, 0.02, 0.04, 0.18, 0); arm1.rotation.z = -0.25;
    var arm2 = bx(lamp, M.black, 0.02, 0.3, 0.02, 0.14, 0.38, 0); arm2.rotation.z = 1.1;
    var head = mk(new THREE.ConeGeometry(0.07, 0.12, 18, 1, true), M.shade, 0.27, 0.36, 0, lamp, 0, 0, 0.4);
    mk(new THREE.CircleGeometry(0.06, 16), SCR.glow, 0.29, 0.31, 0, lamp, Math.PI / 2 - 0.4, 0, 0, true).rotation.set(Math.PI / 2, 0, 0.4);
    // PC tower with blinking light
    bx(S, M.black, 0.2, 0.44, 0.46, 0.55, 0.22, pz + 0.32);
    addCol(L, 0.55, pz + 0.32, 0, -0.1, 0.1, 0, 0.44, -0.23, 0.23);
    var led = basic({ color: 0x3cff8a });
    plane(S, led, 0.012, 0.012, 0.5, 0.4, pz + 0.552);
    L.tick.push(function (dt, t) { led.color.setHex(Math.sin(t * 9) > 0.6 || Math.sin(t * 2.1) > 0.9 ? 0x3cff8a : 0x0b3a20); });
    // phone, stacked trays, plant on the desk
    bx(S, M.black, 0.2, 0.06, 0.18, 0.45, 0.77, pz + 0.3);
    var tray = new THREE.Group(); tray.position.set(-2.0, 0.74, pz + 0.3); S.add(tray);
    for (var i = 0; i < 3; i++) { bx(tray, M.black, 0.3, 0.01, 0.36, 0, 0.005 + i * 0.07, 0); bx(tray, M.paper, 0.26, 0.012, 0.3, 0, 0.012 + i * 0.07, 0, rnd(-0.08, 0.08)); }
    plant(L, S, 0.78, 0.74, pz + 0.22, 1.0, false);
    // overhead shelf with binders on the back partition
    var sx0 = -2.35, sx1 = -0.15, sy = 1.265, sd = 0.33, scz = pz + 0.03 + sd / 2;
    bx(S, M.black, sx1 - sx0, 0.025, sd, (sx0 + sx1) / 2, sy, scz);
    bx(S, M.black, sx1 - sx0, 0.025, sd, (sx0 + sx1) / 2, sy + 0.335, scz);
    bx(S, M.black, 0.025, 0.335, sd, sx0, sy + 0.1675, scz);
    bx(S, M.black, 0.025, 0.335, sd, sx1, sy + 0.1675, scz);
    binders(S, -2.15, sy + 0.0125, scz, 'x', 12, 1.0);
    for (i = 0; i < 4; i++) bx(S, M.paper, 0.3, 0.012, 0.24, -0.75, sy + 0.02 + i * 0.013, scz, rnd(-0.1, 0.1), true);
    // pinned notes and a calendar on the partition fabric
    var face = pz + 0.032;
    plane(S, std({ map: makeCalTex(), roughness: 0.8 }), 0.34, 0.425, 0.42, 1.25, face + 0.001);
    [[-0.1, 1.02, 0.08], [0.06, 1.1, -0.06], [0.8, 1.3, 0.12], [-1.55, 1.0, -0.04]].forEach(function (n, k) {
      mk(new THREE.PlaneGeometry(0.1, 0.1), NOTES[k % NOTES.length], n[0], n[1], face + 0.002 + k * 0.0004, S, 0, 0, n[2], true);
    });
    // chair turned away from the desk, slowly swivelling
    chair(L, S, 1.85, bz + 1.15, -2.2, true);
    // neighbour cubicles on the right
    partitionZ(L, S, 2.6, -0.4, back, 1.05);
    partitionX(L, S, 2.6, ROOM_W, bz - 0.3, 1.3);
    deskUnit(L, S, ROOM_W - 0.38, bz - 1.25, -Math.PI / 2, { w: 1.4, screen: 'sheet' });
    deskUnit(L, S, ROOM_W - 0.38, bz + 1.4, -Math.PI / 2, { w: 1.4, screen: 'code' });
    plant(L, S, 2.1, 0, back + 0.45, 1.9, true);
    wallClock(L, S, -1.3, 2.24, back + 0.02, 0, 1.4);
    return finish(L, S);
  }

  /* --- Office: open floor of cubicles --- */
  function buildOffice() {
    var L = newLevel(), S = new THREE.Group();
    var bz = -LEVELS[1].dist, back = bz - BACK_GAP;
    var z0 = 0.7, step = (z0 - back) / 3, aisle = 1.75;
    var screens = ['code', 'sheet', 'saver', 'dash', 'code', 'sheet'];
    [-1, 1].forEach(function (sx) {
      var wall = ROOM_W * sx;
      for (var c = 0; c < 3; c++) {
        var a = z0 - c * step, b = a - step, mid = (a + b) / 2;
        if (c > 0) partitionX(L, S, aisle * sx, wall, a, 1.2);
        partitionZ(L, S, aisle * sx, a, a - (step - 0.95), 0.8);
        var ry = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
        var cx = (aisle + ROOM_W) / 2 * sx;
        // desk against the far divider, monitor facing down the aisle
        deskUnit(L, S, cx + sx * 0.05, b + 0.4, 0, { w: 1.6, mx: sx * 0.2, screen: screens[(c + (sx > 0 ? 3 : 0)) % 6], plant: Math.random() < 0.55 });
        chair(L, S, cx + sx * 0.25 + rnd(-0.15, 0.15), b + 1.12 + rnd(-0.1, 0.15), rnd(-0.7, 0.7), c === 1 || (c === 2 && sx > 0));
        cabinet(L, S, wall - sx * 0.34, a - 0.45, ry, 3);
        // wall shelf with binders
        bx(S, M.black, 0.3, 0.025, 1.3, wall - sx * 0.16, 1.42, mid + 0.1);
        binders(S, wall - sx * 0.16, 1.4325, mid + 0.1, 'z', 9, 1.05);
      }
    });
    // back of the room: printer station, clock, tall plants
    var pr = new THREE.Group(); pr.position.set(-1.25, 0, back + 0.36); S.add(pr);
    bx(pr, M.metal, 0.75, 0.72, 0.6, 0, 0.36, 0);
    bx(pr, M.plastic, 0.55, 0.32, 0.45, 0, 0.88, 0);
    bx(pr, M.deskDark, 0.4, 0.05, 0.3, 0, 1.06, -0.03);
    bx(pr, M.deskDark, 0.4, 0.015, 0.04, 0, 0.82, 0.23);
    for (var r = 0; r < 4; r++) bx(pr, M.paper, 0.34, 0.012, 0.26, 0, 0.84 + r * 0.004, 0.3, 0, true);
    addCol(L, -1.25, back + 0.36, 0, -0.38, 0.38, 0, 1.06, -0.3, 0.3);
    var prLed = basic({ color: 0x3cff8a });
    plane(pr, prLed, 0.016, 0.016, 0.2, 1.0, 0.226);
    var sheet = new THREE.Group(); sheet.userData.dyn = true; sheet.position.set(-1.25, 0.86, back + 0.36 + 0.2); S.add(sheet);
    var sheetMesh = bx(sheet, M.paper, 0.3, 0.004, 0.22, 0, 0, 0, 0, true);
    L.tick.push(function (dt, t) {
      var cyc = (t % 8) / 8;
      prLed.color.setHex(cyc < 0.3 ? ((t * 6) % 1 < 0.5 ? 0xffb02e : 0x4a3008) : 0x3cff8a);
      var e = cyc < 0.3 ? cyc / 0.3 : 1;
      sheetMesh.position.z = -0.12 + e * 0.2;
      sheetMesh.visible = cyc < 0.9;
    });
    wallClock(L, S, -1.25, 2.35, back + 0.02, 0);
    plant(L, S, 1.4, 0, back + 0.4, 1.9, true);
    // one ceiling panel with a tired ballast
    var flick = basic({ color: 0xfff8ea });
    var fp = mk(new THREE.PlaneGeometry(1.2, 0.6), flick, 1.2, 3.085, -3.4, L.root, Math.PI / 2, 0, 0, true);
    fp.userData.dyn = true;
    var next = 3, until = 0;
    L.tick.push(function (dt, t) {
      if (t > next) { until = t + rnd(0.15, 0.6); next = t + rnd(3, 9); }
      var on = t > until || Math.random() < 0.45;
      flick.color.setHex(on ? 0xfff8ea : 0x8a8a84);
    });
    return finish(L, S);
  }

  /* --- Lobby: reception, waiting area, elevators --- */
  function makeCity() {
    var c = document.createElement('canvas'); c.width = 1024; c.height = 256;
    var g = c.getContext('2d');
    var grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#0d1531'); grad.addColorStop(0.65, '#26314f'); grad.addColorStop(1, '#4a4152');
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 256);
    var wins = [], x = 0;
    function draw(w) { g.fillStyle = w.on ? w.c : '#1c2333'; g.fillRect(w.x, w.y, 5, 6); }
    while (x < 1024) {
      var bw = rnd(50, 130), bh = rnd(70, 230);
      g.fillStyle = pick(['#141a29', '#171e2f', '#11172a']); g.fillRect(x, 256 - bh, bw, bh);
      for (var wy = 256 - bh + 8; wy < 248; wy += 12) for (var wx = x + 6; wx < x + bw - 8; wx += 10) {
        var w = { x: wx, y: wy, on: Math.random() < 0.33, c: Math.random() < 0.75 ? '#ffd98a' : '#bfe0ff' };
        wins.push(w); draw(w);
      }
      x += bw + rnd(2, 8);
    }
    var tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding;
    return { tex: tex, twinkle: function () { for (var i = 0; i < 8; i++) { var w = pick(wins); w.on = !w.on; draw(w); } tex.needsUpdate = true; } };
  }
  function signTex(lines) {
    return canvasTex(1024, 256, function (g, w, h) {
      g.clearRect(0, 0, w, h);
      g.fillStyle = '#1b1f23'; g.textAlign = 'center';
      g.font = '700 132px ' + FONT_STACK;
      g.fillText(lines[0], w / 2, 140);
      g.font = '500 44px ' + FONT_STACK;
      g.fillText(lines[1], w / 2, 218);
    });
  }
  function buildLobby() {
    var L = newLevel(), S = new THREE.Group();
    var bz = -LEVELS[2].dist, back = bz - BACK_GAP;
    // wood slat feature wall + sign
    for (var sx = -1.95; sx <= 1.96; sx += 0.13) bx(S, M.wood, 0.06, 2.9, 0.05, sx, 1.45, back + 0.025, 0, true);
    var sign = std({ map: signTex(['RECEPTION', 'Floor 3 · Visitors please check in']), transparent: true, alphaTest: 0.4, roughness: 0.6 });
    plane(S, sign, 2.3, 0.575, 0, 1.68, back + 0.06);
    // reception desk
    var rz = back + 0.9;
    bx(S, M.white, 2.8, 1.03, 0.5, 0, 0.515, rz + 0.12);
    bx(S, M.wood, 2.92, 0.05, 0.62, 0, 1.055, rz + 0.12);
    bx(S, M.wood, 2.8, 0.06, 0.012, 0, 0.18, rz + 0.376, 0, true);
    bx(S, M.deskDark, 2.6, 0.74, 0.32, 0, 0.37, rz - 0.3);
    addCol(L, 0, rz, 0, -1.46, 1.46, 0, 1.08, -0.46, 0.43);
    bx(S, M.black, 0.56, 0.36, 0.04, -0.55, 1.0, rz - 0.28);
    bx(S, M.black, 0.56, 0.36, 0.04, 0.55, 1.0, rz - 0.28);
    var bell = mk(new THREE.SphereGeometry(0.045, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), M.steel, 0.95, 1.09, rz + 0.3, S);
    cyl(S, M.black, 0.05, 0.05, 0.012, 0.95, 1.086, rz + 0.3, 16);
    bx(S, M.black, 0.24, 0.015, 0.17, 0.35, 1.088, rz + 0.3, 0.25);
    plant(L, S, -1.15, 1.08, rz + 0.2, 1.0, false);
    // pendant lights over the desk
    [-0.85, 0, 0.85].forEach(function (px) {
      cyl(S, M.black, 0.004, 0.004, 0.62, px, 2.79, rz + 0.1, 4);
      mk(new THREE.CylinderGeometry(0.06, 0.15, 0.2, 24, 1, true), M.shade, px, 2.38, rz + 0.1, S);
      mk(new THREE.CircleGeometry(0.145, 24), SCR.glow, px, 2.285, rz + 0.1, S, Math.PI / 2, 0, 0, true);
    });
    // TV on the back wall
    bx(S, M.black, 1.12, 0.66, 0.05, 2.7, 1.75, back + 0.03);
    var tv = basic({ map: dashTex.clone() }); tv.map.needsUpdate = true; tv.map.wrapS = THREE.RepeatWrapping; tv.map.repeat.set(0.5, 1);
    plane(S, tv, 1.04, 0.58, 2.7, 1.75, back + 0.056);
    L.tick.push(function (dt) { tv.map.offset.x = (tv.map.offset.x + dt * 0.02) % 1; });
    wallClock(L, S, -2.65, 2.25, back + 0.02, 0);
    // windows on the left wall with the city at night
    var city = makeCity();
    var cityMat = basic({ map: city.tex });
    plane(S, cityMat, 7.6, 1.75, -ROOM_W + 0.012, 1.75, -4.4, Math.PI / 2);
    for (var mz = -0.6; mz >= -8.2; mz -= 1.27) bx(S, M.black, 0.05, 1.85, 0.05, -ROOM_W + 0.03, 1.75, mz, 0, true);
    bx(S, M.black, 0.06, 0.05, 7.7, -ROOM_W + 0.03, 0.85, -4.4, 0, true);
    bx(S, M.black, 0.06, 0.05, 7.7, -ROOM_W + 0.03, 2.65, -4.4, 0, true);
    var tw = 0;
    L.tick.push(function (dt) { tw += dt; if (tw > 0.45) { tw = 0; city.twinkle(); } });
    // waiting area
    plane(S, M.rug, 1.9, 3.6, -2.55, 0.004, -4.2, 0, -Math.PI / 2);
    sofa(L, S, -3.05, -3.4, Math.PI / 2, 2.0, M.sofa, M.sofaCush);
    sofa(L, S, -2.95, -5.55, Math.PI / 2, 0.95, M.ochre, M.ochre);
    var ct = new THREE.Group(); ct.position.set(-2.15, 0, -3.4); S.add(ct);
    bx(ct, M.wood, 0.55, 0.04, 1.1, 0, 0.42, 0);
    [[-0.23, -0.5], [0.23, -0.5], [-0.23, 0.5], [0.23, 0.5]].forEach(function (l) { bx(ct, M.black, 0.03, 0.4, 0.03, l[0], 0.2, l[1]); });
    bx(ct, M.red, 0.22, 0.012, 0.3, 0, 0.446, -0.2, 0.3); bx(ct, MUGS[1], 0.22, 0.012, 0.3, 0.02, 0.458, -0.15, -0.2); bx(ct, M.paper, 0.22, 0.012, 0.3, 0, 0.446, 0.3, 0.1);
    addCol(L, -2.15, -3.4, 0, -0.28, 0.28, 0, 0.44, -0.55, 0.55);
    plant(L, S, -3.1, 0, -1.3, 2.3, true);
    plant(L, S, -3.1, 0, back + 0.5, 2.3, true);
    plant(L, S, 3.1, 0, -6.7, 2.1, true);
    // elevators on the right wall
    elevator(L, S, -2.5, 0);
    elevator(L, S, -4.7, 4.5);
    // water cooler with the odd bubble
    var wc = new THREE.Group(); wc.position.set(3.38, 0, -3.6); S.add(wc);
    bx(wc, M.white, 0.32, 0.95, 0.32, 0, 0.475, 0);
    cyl(wc, M.water, 0.13, 0.13, 0.42, 0, 1.18, 0, 20);
    cyl(wc, M.water, 0.05, 0.13, 0.08, 0, 0.99, 0, 20);
    bx(wc, M.red, 0.03, 0.04, 0.03, -0.17, 0.75, -0.05); bx(wc, MUGS[1], 0.03, 0.04, 0.03, -0.17, 0.75, 0.05);
    addCol(L, 3.38, -3.6, 0, -0.16, 0.16, 0, 1.4, -0.16, 0.16);
    var bub = mk(new THREE.SphereGeometry(0.018, 8, 6), M.water, 3.38, 1.0, -3.6, L.root, 0, 0, 0, true);
    bub.userData.dyn = true;
    L.tick.push(function (dt, t) { var c = (t % 5) / 1.4; bub.visible = c < 1; bub.position.y = 1.0 + c * 0.36; bub.position.x = 3.38 + Math.sin(c * 9) * 0.02; });
    return finish(L, S);
  }
  function sofa(L, parent, x, z, ry, len, mat, cush) {
    var g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; parent.add(g);
    bx(g, mat, len, 0.22, 0.82, 0, 0.2, 0);
    bx(g, mat, len, 0.5, 0.2, 0, 0.55, -0.31);
    bx(g, mat, 0.18, 0.34, 0.82, -len / 2 + 0.09, 0.46, 0);
    bx(g, mat, 0.18, 0.34, 0.82, len / 2 - 0.09, 0.46, 0);
    var n = len > 1.2 ? 2 : 1, cw = (len - 0.36) / n;
    for (var i = 0; i < n; i++) bx(g, cush, cw - 0.02, 0.12, 0.62, -len / 2 + 0.18 + cw / 2 + i * cw, 0.37, 0.08);
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (l) { bx(g, M.black, 0.04, 0.09, 0.04, l[0] * (len / 2 - 0.06), 0.045, l[1] * 0.35); });
    addCol(L, x, z, ry, -len / 2, len / 2, 0, 0.62, -0.41, 0.41);
  }
  function elevator(L, parent, z, phase) {
    var x = ROOM_W;
    bx(parent, M.steel, 0.08, 0.14, 1.36, x - 0.04, 2.27, z);
    bx(parent, M.steel, 0.08, 2.2, 0.08, x - 0.04, 1.1, z - 0.64);
    bx(parent, M.steel, 0.08, 2.2, 0.08, x - 0.04, 1.1, z + 0.64);
    plane(parent, SCR.cab, 1.2, 2.2, x - 0.008, 1.1, z, -Math.PI / 2);
    var doors = new THREE.Group(); doors.userData.dyn = true; doors.position.set(x - 0.045, 1.1, z); parent.add(doors);
    var dA = bx(doors, M.metalLight, 0.025, 2.2, 0.6, 0, 0, -0.3, 0, true);
    var dB = bx(doors, M.metalLight, 0.025, 2.2, 0.6, 0, 0, 0.3, 0, true);
    var ind = canvasTex(128, 48, function () {});
    var ig = ind.userData.ctx;
    var indMat = basic({ map: ind });
    plane(parent, indMat, 0.3, 0.11, x - 0.009, 2.5, z, -Math.PI / 2);
    var floorNo = 3 + Math.floor(rnd(-2, 6)), target = 3, lastStep = 0, openT = -1;
    function paint(dir) {
      ig.fillStyle = '#0a0d12'; ig.fillRect(0, 0, 128, 48);
      ig.fillStyle = '#ff6b3d'; ig.font = '700 34px ' + FONT_STACK; ig.textAlign = 'center';
      ig.fillText(String(floorNo), 76, 36);
      if (dir) { ig.beginPath(); var y0 = dir > 0 ? 34 : 14, y1 = dir > 0 ? 14 : 34; ig.moveTo(22, y0); ig.lineTo(40, y0); ig.lineTo(31, y1); ig.fill(); }
      ind.needsUpdate = true;
    }
    paint(0);
    var t0 = phase;
    L.tick.push(function (dt, t) {
      var lt = t + t0;
      if (openT < 0) {
        if (floorNo === 3 && lt - lastStep > 1.2 && target === 3) { openT = lt; }
        else if (lt - lastStep > 1.1) {
          if (floorNo === target) target = Math.random() < 0.5 ? 3 : 1 + Math.floor(rnd(0, 12));
          var dir = target > floorNo ? 1 : target < floorNo ? -1 : 0;
          floorNo += dir; lastStep = lt; paint(dir);
        }
      }
      var open = 0;
      if (openT >= 0) {
        var e = lt - openT;
        if (e < 1.0) open = e / 1.0; else if (e < 4.0) open = 1; else if (e < 5.0) open = 1 - (e - 4.0); else { openT = -1; lastStep = lt; target = 1 + Math.floor(rnd(0, 12)); }
      }
      var s = open * open * (3 - 2 * open);
      var k = Math.max(0.001, 1 - s);
      dA.scale.z = k; dA.position.z = -0.6 + 0.3 * k;
      dB.scale.z = k; dB.position.z = 0.6 - 0.3 * k;
    });
  }

  var DECOR = [null, null, null];
  var BUILDERS = [buildDesk, buildOffice, buildLobby];
  function decorFor(i) { if (!DECOR[i]) DECOR[i] = BUILDERS[i](); return DECOR[i]; }
  var decor = null;

  /* ---------- drifting dust shows the airflow ---------- */
  var MOTES = 80;
  var motePos = new Float32Array(MOTES * 3);
  var moteGeo = new THREE.BufferGeometry();
  moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
  var motes = new THREE.Points(moteGeo, new THREE.PointsMaterial({ map: dotTex, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false, color: 0xfff6e0 }));
  scene.add(motes);
  function seedMotes() {
    for (var i = 0; i < MOTES; i++) {
      motePos[i * 3] = (Math.random() * 2 - 1) * ROOM_W;
      motePos[i * 3 + 1] = 0.25 + Math.random() * 2.3;
      motePos[i * 3 + 2] = binZ - 1.2 + Math.random() * (-binZ + 1.4);
    }
    moteGeo.attributes.position.needsUpdate = true;
  }

  /* ---------- paper balls ---------- */
  var paperMat = new THREE.MeshStandardMaterial({ map: paperTex, roughness: 0.92, flatShading: true });
  var ballGeos = [];
  for (var gi = 0; gi < 8; gi++) {
    var geo = new THREE.IcosahedronGeometry(R, 1);
    var pos = geo.attributes.position, v3 = new THREE.Vector3(), seen = {};
    for (var vi = 0; vi < pos.count; vi++) {
      v3.fromBufferAttribute(pos, vi);
      var key = Math.round(v3.x * 1e4) + ',' + Math.round(v3.y * 1e4) + ',' + Math.round(v3.z * 1e4);
      var s = seen[key]; if (s === undefined) { s = seen[key] = 0.8 + Math.random() * 0.32; }
      v3.multiplyScalar(s); pos.setXYZ(vi, v3.x, v3.y, v3.z);
    }
    geo.computeVertexNormals();
    ballGeos.push(geo);
  }
  function newBallMesh() {
    var m = new THREE.Mesh(ballGeos[(Math.random() * ballGeos.length) | 0], paperMat);
    m.castShadow = true; m.receiveShadow = true;
    m.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    return m;
  }

  var balls = [];
  var ready = null;
  var current = null;

  function spawnReady() {
    var m = newBallMesh(); m.position.copy(START); m.scale.setScalar(0.001);
    scene.add(m); ready = { mesh: m, t: 0 };
  }
  function clearBalls() {
    balls.forEach(function (b) { scene.remove(b.mesh); });
    balls = []; current = null;
    if (ready) { scene.remove(ready.mesh); ready = null; }
  }

  /* ---------- audio (synthesized, starts on first touch) ---------- */
  var ac = null, master = null, noiseBuf = null;
  function initAudio() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    try {
      ac = new (window.AudioContext || window.webkitAudioContext)();
      master = ac.createGain(); master.gain.value = muted ? 0 : 0.8; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
      var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) { ac = null; }
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function noise(dur, type, f0, f1, q, vol, delay) {
    if (!ac || muted) return;
    var t = ac.currentTime + (delay || 0);
    var src = ac.createBufferSource(); src.buffer = noiseBuf;
    var f = ac.createBiquadFilter(); f.type = type; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.02, dur * 0.3));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
  }
  function tone(freq, dur, vol, type, delay) {
    if (!ac || muted) return;
    var t = ac.currentTime + (delay || 0);
    var o = ac.createOscillator(); o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    var g = ac.createGain(); g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  var sfx = {
    whoosh: function () { noise(0.34, 'bandpass', 500, 2600, 1.3, 0.32); noise(0.12, 'highpass', 3000, 2500, 0.7, 0.08); },
    rim: function (s) { var v = clamp(s / 3, 0.06, 0.5); tone(1260, 0.4, v * 0.45, 'triangle'); tone(1905, 0.28, v * 0.25); tone(3010, 0.16, v * 0.12); },
    mesh: function (s) { noise(0.09, 'highpass', 3200, 2200, 0.7, clamp(s / 4, 0.04, 0.3)); tone(330, 0.09, clamp(s / 8, 0.02, 0.1), 'triangle'); },
    floor: function (s) { noise(0.08, 'lowpass', 1500, 400, 0.8, clamp(s / 4, 0.03, 0.3)); },
    paper: function (s) { noise(0.06, 'bandpass', 2600, 1700, 1, clamp(s / 5, 0.02, 0.14)); },
    score: function () { tone(784, 0.2, 0.16); tone(1175, 0.36, 0.15, 'sine', 0.09); },
    miss: function () { tone(233, 0.24, 0.07, 'sine'); tone(196, 0.3, 0.06, 'sine', 0.1); }
  };

  /* ---------- HUD ---------- */
  var toast = $('toast'), toastMain = $('toastMain'), toastSub = $('toastSub');
  function showToast(main, sub, isMiss) {
    toastMain.textContent = main; toastSub.textContent = sub || '';
    toast.classList.remove('show', 'miss'); void toast.offsetWidth;
    if (isMiss) toast.classList.add('miss');
    toast.classList.add('show');
  }
  function renderScore(bump) {
    $('streak').textContent = streak;
    $('best').textContent = best[LEVELS[levelIdx].id] || 0;
    if (bump) { var n = $('note'); n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); }
  }
  function renderWind() {
    $('windVal').textContent = Math.abs(wind).toFixed(2);
    $('windArrow').classList.toggle('left', wind < 0);
    var frac = Math.abs(wind) / 5 * 50, bar = $('windBar');
    bar.style.width = frac + '%';
    bar.style.left = wind < 0 ? (50 - frac) + '%' : '50%';
  }
  function renderSound() {
    $('icoOn').toggleAttribute('hidden', muted); $('icoOff').toggleAttribute('hidden', !muted);
    $('soundBtn').setAttribute('aria-pressed', String(!muted));
    $('soundBtn').title = muted ? 'Sound is off. Tap to turn on' : 'Sound is on. Tap to mute';
    if (master) master.gain.value = muted ? 0 : 0.8;
  }
  $('soundBtn').addEventListener('click', function () { initAudio(); muted = !muted; store.set('ct-muted', muted); renderSound(); });

  function newWind() {
    var m = LEVELS[levelIdx].maxWind;
    wind = Math.round((Math.random() * 2 - 1) * m * 100) / 100;
    renderWind();
  }

  /* ---------- layout & level ---------- */
  function fanX() {
    var hHalf = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    var vis = Math.tan(hHalf) * (-binZ + CAM_POS.z);
    return clamp(vis * 0.62, 0.7, 1.35);
  }
  function placeLevel() {
    var L = LEVELS[levelIdx];
    binZ = -L.dist; backZ = binZ - BACK_GAP;
    bin.position.set(0, 0, binZ);
    backWall.position.set(0, 1.55, backZ);
    backTrim.position.set(0, 0.045, backZ + 0.01);
    var showBoard = levelIdx !== 2, by = levelIdx === 0 ? 2.2 : 1.55, bs = levelIdx === 0 ? 0.7 : 1;
    boardFrame.visible = board.visible = showBoard;
    boardFrame.scale.set(bs, bs, 1); board.scale.set(bs, bs, 1);
    boardFrame.position.set(0.5, by, backZ + 0.018);
    board.position.set(0.5, by, backZ + 0.037);
    var lobby = levelIdx === 2;
    floor.material = lobby ? tileMat : carpetMat;
    wallMat.color.setHex(lobby ? 0xf3ece0 : 0xffffff);
    var fx = fanX();
    fanL.position.set(-fx, 0, binZ + 0.15);
    fanR.position.set(fx, 0, binZ + 0.15);
    sun.position.set(-2.4, 6.5, binZ + 3.2);
    sun.target.position.set(0, 0, binZ + 1);
    camera.lookAt(0, levelIdx === 0 ? 0.74 : 0.5, binZ);
    decor = decorFor(levelIdx);
    DECOR.forEach(function (d) { if (d) d.root.visible = d === decor; });
    seedMotes();
  }
  function setLevel(i) {
    levelIdx = i; store.set('ct-level', i);
    root.querySelectorAll('.ct-levels button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.i === i)); });
    clearBalls(); streak = streaks[LEVELS[i].id] || 0; nextAt = 0;
    placeLevel(); newWind(); renderScore(false);
    spawnReady();
  }
  $('levels').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var i = +b.dataset.i; if (i !== levelIdx) setLevel(i);
    b.blur();
  });

  /* ---------- trail overlay ---------- */
  var trail = $('trail'), tctx = trail.getContext('2d'), tpts = [], trailDirty = false, tdpr = 1;
  function drawTrail(nowMs) {
    if (!trailDirty) return;
    tctx.clearRect(0, 0, trail.width, trail.height);
    var life = 320, alive = false;
    tctx.lineCap = 'round'; tctx.lineJoin = 'round';
    for (var i = 1; i < tpts.length; i++) {
      var a = 1 - (nowMs - tpts[i].t) / life;
      if (a <= 0) continue; alive = true;
      tctx.strokeStyle = 'rgba(255,248,230,' + (a * 0.7).toFixed(3) + ')';
      tctx.lineWidth = (3 + 7 * a) * tdpr;
      tctx.beginPath();
      tctx.moveTo(tpts[i - 1].x * tdpr, tpts[i - 1].y * tdpr);
      tctx.lineTo(tpts[i].x * tdpr, tpts[i].y * tdpr);
      tctx.stroke();
    }
    if (!alive && !drag) { tpts = []; trailDirty = false; tctx.clearRect(0, 0, trail.width, trail.height); }
  }

  /* ---------- resize ---------- */
  function resize() {
    var w = Math.max(1, root.clientWidth), h = Math.max(1, root.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    var v = 48;
    var minH = THREE.MathUtils.degToRad(27);
    var hHalf = Math.atan(Math.tan(THREE.MathUtils.degToRad(v / 2)) * camera.aspect);
    if (hHalf < minH) v = 2 * THREE.MathUtils.radToDeg(Math.atan(Math.tan(minH) / camera.aspect));
    camera.fov = Math.min(v, 82);
    camera.updateProjectionMatrix();
    tdpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    trail.width = Math.round(w * tdpr); trail.height = Math.round(h * tdpr);
    placeLevel();
  }


  /* ---------- input ---------- */
  var drag = null;
  canvas.addEventListener('pointerdown', function (e) {
    initAudio();
    if (!ready || ready.t < 0.18) return;
    var rc = root.getBoundingClientRect();
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, ox: rc.left, oy: rc.top };
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    tpts = [{ x: e.clientX - rc.left, y: e.clientY - rc.top, t: performance.now() }]; trailDirty = true;
  });
  canvas.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    tpts.push({ x: e.clientX - drag.ox, y: e.clientY - drag.oy, t: performance.now() });
    if (tpts.length > 60) tpts.shift();
  });
  function endDrag(e, cancelled) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    drag = null;
    if (cancelled || !ready) return;
    if (-dy < 28 || -dy < Math.abs(dx) * 0.35) return;     // needs an upward flick
    var angle = clamp(Math.atan2(dx, -dy), -1.0, 1.0);
    throwBall(angle);
  }
  canvas.addEventListener('pointerup', function (e) { endDrag(e, false); });
  canvas.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  var onKey = function (e) {
    if ((e.code === 'Space' || e.code === 'ArrowUp') && ready && ready.t > 0.18 && running && (e.target === document.body || e.target === root || e.target === canvas)) {
      e.preventDefault(); initAudio(); throwBall(0);
    }
  };
  window.addEventListener('keydown', onKey);

  function throwBall(angle) {
    var L = LEVELS[levelIdx], T = L.T;
    var m = ready.mesh; ready = null;
    m.scale.setScalar(1);
    var p = m.position.clone();
    var vz = (binZ - p.z) / T;
    var vy = (BIN_H + 0.02 - p.y + 0.5 * G * T * T) / T;
    var vx = Math.tan(angle) * Math.abs(vz) * AIM_GAIN;
    var b = {
      mesh: m, p: p, v: new THREE.Vector3(vx, vy, vz),
      w: new THREE.Vector3(-(7 + Math.random() * 5), (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 6),
      side: 'out', t: 0, rim: false, wall: false, floorHit: null, decorHit: null, scored: false, resolved: false,
      contact: false, lastSnd: 0
    };
    balls.push(b); current = b;
    while (balls.length > MAX_BALLS) { var old = balls.shift(); scene.remove(old.mesh); }
    sfx.whoosh();
    if (firstThrow) { firstThrow = false; $('hint').classList.add('gone'); }
  }

  /* ---------- physics ---------- */
  function impact(b, kind, speed) {
    if (speed < 0.35 || clock - b.lastSnd < 0.07) return;
    b.lastSnd = clock; sfx[kind](speed);
  }

  function collideBox(b, c) {
    var p = b.p, v = b.v;
    if (p.x < c.x0 - R || p.x > c.x1 + R || p.y < c.y0 - R || p.y > c.y1 + R || p.z < c.z0 - R || p.z > c.z1 + R) return;
    var cx = clamp(p.x, c.x0, c.x1), cy = clamp(p.y, c.y0, c.y1), cz = clamp(p.z, c.z0, c.z1);
    var dx = p.x - cx, dy = p.y - cy, dz = p.z - cz, d2 = dx * dx + dy * dy + dz * dz;
    if (d2 >= R * R) return;
    var nx, ny, nz;
    if (d2 < 1e-10) { nx = 0; ny = 1; nz = 0; p.y = c.y1 + R; }
    else {
      var d = Math.sqrt(d2); nx = dx / d; ny = dy / d; nz = dz / d;
      var push = R - d; p.x += nx * push; p.y += ny * push; p.z += nz * push;
    }
    var vn = v.x * nx + v.y * ny + v.z * nz;
    if (vn < 0) {
      var j = -(1 + 0.35) * vn;
      v.x += nx * j; v.y += ny * j; v.z += nz * j;
      v.multiplyScalar(0.9);
      impact(b, 'floor', -vn);
    }
    if (ny > 0.7) b.contact = true;
    b.wall = true;
    if (!b.decorHit) b.decorHit = { x: p.x, z: p.z - binZ, t: clock };
  }

  function stepBall(b, h) {
    var p = b.p, v = b.v;
    b.t += h;
    var insideBasket = b.side === 'in' && p.y < BIN_H;
    if (p.y > R + 0.004 && !insideBasket) v.x += wind * WIND_ACC * h;
    v.y -= G * h;
    p.x += v.x * h; p.y += v.y * h; p.z += v.z * h;

    var dx = p.x, dz = p.z - binZ;
    var rh = Math.sqrt(dx * dx + dz * dz) || 1e-6;
    var nx = dx / rh, nz = dz / rh;

    if (p.y >= BIN_H) b.side = rh < BIN_R ? 'in' : 'out';

    // rim: torus tube in the (radial, up) plane
    var rd = rh - BIN_R, ry = p.y - BIN_H;
    var dRim = Math.sqrt(rd * rd + ry * ry), minD = R + RIM_T;
    if (dRim < minD && dRim > 1e-6) {
      var ux = rd / dRim, uy = ry / dRim, push = minD - dRim;
      p.x += nx * ux * push; p.z += nz * ux * push; p.y += uy * push;
      var vr = v.x * nx + v.z * nz, vn = vr * ux + v.y * uy;
      if (vn < 0) {
        var j = -(1 + 0.42) * vn;
        v.x += nx * ux * j; v.z += nz * ux * j; v.y += uy * j;
        v.multiplyScalar(0.94);
        b.rim = true; impact(b, 'rim', -vn);
      }
    }

    // basket wall (tapered), from whichever side the ball is on
    if (p.y < BIN_H && p.y > -R) {
      var rw = rAt(p.y);
      var vr2 = v.x * nx + v.z * nz;
      if (b.side === 'in') {
        var lim = rw - R - 0.004;
        if (rh > lim) {
          var k = lim / rh; p.x = dx * k; p.z = binZ + dz * k;
          if (vr2 > 0) { v.x -= nx * vr2 * 1.3; v.z -= nz * vr2 * 1.3; impact(b, 'mesh', vr2); }
        }
        var floorIn = 0.008 + R;
        if (p.y < floorIn) {
          p.y = floorIn;
          if (v.y < 0) { impact(b, 'paper', -v.y); v.y = -v.y * 0.22; }
          b.contact = true;
        }
      } else {
        var lo = rw + R + 0.004;
        if (rh < lo) {
          var k2 = lo / rh; p.x = dx * k2; p.z = binZ + dz * k2;
          if (vr2 < 0) { v.x -= nx * vr2 * 1.3; v.z -= nz * vr2 * 1.3; impact(b, 'mesh', -vr2); }
        }
      }
    }

    // furniture
    if (decor) for (var ci = 0; ci < decor.cols.length; ci++) collideBox(b, decor.cols[ci]);

    // floor
    if (b.side !== 'in' || p.y > BIN_H) {
      if (p.y < R) {
        p.y = R;
        if (v.y < 0) {
          impact(b, 'floor', -v.y);
          v.y = -v.y * 0.32;
          v.x *= 0.78; v.z *= 0.78;
        }
        b.contact = true;
        if (!b.floorHit) b.floorHit = { x: p.x, z: p.z - binZ };
      }
    }

    // room walls
    if (p.z < backZ + R) { p.z = backZ + R; if (v.z < 0) { v.z = -v.z * 0.45; b.wall = true; impact(b, 'floor', -v.z * 2); } }
    if (p.x < -ROOM_W + R) { p.x = -ROOM_W + R; if (v.x < 0) { v.x = -v.x * 0.45; b.wall = true; } }
    if (p.x > ROOM_W - R) { p.x = ROOM_W - R; if (v.x > 0) { v.x = -v.x * 0.45; b.wall = true; } }
    if (p.z > 1.5) { p.z = 1.5; if (v.z > 0) v.z = 0; }
    if (p.y > 3.1 - R) { p.y = 3.1 - R; if (v.y > 0) v.y = -v.y * 0.3; }

    if (b.contact) {
      var f = Math.max(0, 1 - 2.6 * h);
      v.x *= f; v.z *= f;
      if (v.lengthSq() < 0.0016) v.multiplyScalar(0.5);
    }
  }

  function collideBalls() {
    var n = balls.length, d = new THREE.Vector3();
    for (var i = 0; i < n; i++) {
      var a = balls[i];
      for (var k = i + 1; k < n; k++) {
        var c = balls[k];
        d.subVectors(a.p, c.p);
        var dist2 = d.lengthSq();
        if (dist2 >= 4 * R * R || dist2 < 1e-10) continue;
        var dist = Math.sqrt(dist2); d.multiplyScalar(1 / dist);
        var ov = (2 * R - dist) * 0.5;
        a.p.addScaledVector(d, ov); c.p.addScaledVector(d, -ov);
        var rel = (a.v.x - c.v.x) * d.x + (a.v.y - c.v.y) * d.y + (a.v.z - c.v.z) * d.z;
        if (rel < 0) {
          var j = -(1 + 0.3) * rel * 0.5;
          a.v.addScaledVector(d, j); c.v.addScaledVector(d, -j);
          if (-rel > 0.6) impact(a, 'paper', -rel);
        }
      }
    }
  }

  /* ---------- results ---------- */
  function resolve(b, scored) {
    b.resolved = true;
    var L = LEVELS[levelIdx];
    if (scored) {
      streak++;
      var main = b.rim ? 'Off the rim' : b.wall ? 'Bank shot' : 'Swish';
      var sub = '';
      if (streak > (best[L.id] || 0)) { best[L.id] = streak; store.set('ct-best', best); if (streak > 1) sub = 'New best: ' + streak; }
      if (!sub && streak > 1) sub = streak + ' in a row';
      showToast(main, sub, false); sfx.score(); renderScore(true);
    } else {
      var main2 = 'Miss';
      var fh = b.floorHit || b.decorHit;
      if (b.rim) main2 = 'Rimmed out';
      else if (fh) {
        if (Math.abs(fh.x) > Math.abs(fh.z) * 0.8) main2 = fh.x < 0 ? 'Wide left' : 'Wide right';
        else main2 = fh.z > 0 ? 'Short' : 'Long';
      }
      var lost = streak;
      streak = 0;
      showToast(main2, lost > 1 ? 'Streak of ' + lost + ' ended' : '', true);
      sfx.miss(); renderScore(false);
    }
    streaks[L.id] = streak; store.set('ct-streak', streaks);
    nextAt = clock + 0.95;
  }

  /* ---------- loop ---------- */
  var q = new THREE.Quaternion(), axis = new THREE.Vector3();
  function easeOutBack(t) { var c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

  function update(dt, nowMs) {
    clock += dt;

    if (ready) {
      ready.t += dt;
      var s = easeOutBack(Math.min(1, ready.t / 0.35));
      ready.mesh.scale.setScalar(Math.max(0.001, s));
      ready.mesh.position.y = START.y + Math.sin(ready.t * 2.2) * 0.012;
      ready.mesh.rotation.y += dt * 0.5;
    }

    var steps = 6, h = dt / steps;
    for (var si = 0; si < steps; si++) {
      for (var i = 0; i < balls.length; i++) { balls[i].contact = false; stepBall(balls[i], h); }
      collideBalls();
    }

    for (var bi = 0; bi < balls.length; bi++) {
      var b = balls[bi];
      b.mesh.position.copy(b.p);
      if (b.contact) b.w.set(b.v.z / R, 0, -b.v.x / R);
      else b.w.multiplyScalar(Math.max(0, 1 - 0.4 * dt));
      var wl = b.w.length();
      if (wl > 1e-4) { axis.copy(b.w).multiplyScalar(1 / wl); q.setFromAxisAngle(axis, wl * dt); b.mesh.quaternion.premultiply(q); }
    }

    if (current && !current.resolved) {
      var c = current;
      if (c.side === 'in' && c.p.y < BIN_H * 0.72) { c.scored = true; resolve(c, true); }
      else if (c.floorHit || c.t > 4) resolve(c, false);
      else if (c.decorHit && clock - c.decorHit.t > 0.8 && c.side !== 'in') resolve(c, false);
    }
    if (nextAt && clock >= nextAt) { nextAt = 0; current = null; newWind(); spawnReady(); }

    // fans
    [fanL, fanR].forEach(function (fan, idx) {
      var active = idx === 0 ? wind > 0 : wind < 0;
      var target = active ? 4 + Math.abs(wind) * 7 : 0;
      fan.userData.speed += (target - fan.userData.speed) * Math.min(1, dt * 2.5);
      fan.userData.rotor.rotation.z += fan.userData.speed * dt;
    });

    // office life
    codeTex.offset.y = (codeTex.offset.y - dt * 0.035) % 1;
    if (decor) for (var ti = 0; ti < decor.tick.length; ti++) decor.tick[ti](dt, clock);

    // dust
    var arr = moteGeo.attributes.position.array;
    for (var m = 0; m < MOTES; m++) {
      var ix = m * 3;
      arr[ix] += (wind * 0.55 + Math.sin(clock * 0.7 + m) * 0.04) * dt;
      arr[ix + 1] += Math.sin(clock * 0.9 + m * 1.7) * 0.03 * dt;
      if (arr[ix] > ROOM_W) arr[ix] = -ROOM_W; else if (arr[ix] < -ROOM_W) arr[ix] = ROOM_W;
    }
    moteGeo.attributes.position.needsUpdate = true;

    drawTrail(nowMs);
  }

  var last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    var dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    if (dt <= 0) return;
    update(dt, now);
    renderer.render(scene, camera);
  }

  /* ---------- run loop: pauses when off screen or the tab is hidden ---------- */
  var rafId = 0, last = 0, inView = true;
  function frame(now) {
    rafId = requestAnimationFrame(frame);
    var dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    if (dt <= 0) return;
    update(dt, now);
    renderer.render(scene, camera);
  }
  function start() { if (running) return; running = true; last = performance.now(); rafId = requestAnimationFrame(frame); }
  function stop() { if (!running) return; running = false; cancelAnimationFrame(rafId); }
  function syncRun() {
    if (inView && !document.hidden) start(); else stop();
    if (ac) { if (running && ac.state === 'suspended') ac.resume(); else if (!running && ac.state === 'running') ac.suspend(); }
  }
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) { inView = es[0].isIntersecting; syncRun(); }) : null;
  var ro = ('ResizeObserver' in window) ? new ResizeObserver(function () { resize(); }) : null;
  if (!ro) window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', syncRun);

  /* ---------- boot (wait briefly for the site font so signage draws in it) ---------- */
  var booted = false;
  function boot() {
    if (booted) return; booted = true;
    renderSound();
    resize();
    setLevel(levelIdx);
    if (io) io.observe(root);
    if (ro) ro.observe(root);
    syncRun();
  }
  var fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([900, 700, 500].map(function (w) { return document.fonts.load(w + ' 40px "' + FAMILY + '"'); }))
    : Promise.resolve();
  fontsReady.then(boot, boot);
  setTimeout(boot, 1500);

  var api = {
    destroy: function () {
      stop();
      if (io) io.disconnect();
      if (ro) ro.disconnect(); else window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', syncRun);
      window.removeEventListener('keydown', onKey);
      if (ac) ac.close();
      renderer.dispose();
      root.innerHTML = '';
      root.classList.remove('ct-root');
      delete root.__crumpleToss;
    }
  };
  root.__crumpleToss = api;
  return api;
}

function autoMount() {
  var els = document.querySelectorAll('[data-crumple-toss]');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    mount(el, { font: el.getAttribute('data-font') || 'Satoshi', lockScroll: el.hasAttribute('data-lock-scroll') });
  }
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount);
  else autoMount();
}
