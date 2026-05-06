import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const SECRET = "0217";

const flowerData = {
  rose: {
    title: "Сарнай",
    latin: "Rosa",
    summary:
      "Сарнай нь хайр, хүндлэл, чин сэтгэлийн хамгийн танигдсан бэлгэдэл. Олон давхар дэлбээ нь хүний доторх нандин мэдрэмжийг алгуурхан дэлгэж байгаа мэт харагддаг.",
    facts: [
      ["Бэлгэдэл", "Улаан сарнай нь гүн хайр, үнэнч сэтгэл, зүрхний дулааныг илэрхийлдэг."],
      ["Танин мэдэхүй", "Сарнай дэлхий даяар хэдэн мянган сорттой бөгөөд үнэр, өнгө, дэлбээний хэлбэрээрээ ялгардаг."],
      ["Арчилгаа", "Сэрүүн усанд хийж, ишийг нь ташуу тайрвал ус илүү сайн шингээж удаан сэргэг байдаг."]
    ]
  },
  tulip: {
    title: "Алтанзул",
    latin: "Tulipa",
    summary:
      "Алтанзул нь хаврын эхлэл, шинэхэн итгэл, энгийн мөртлөө эрхэм гоо сайхныг санагдуулдаг. Аяган хэлбэртэй дэлбээ нь гэрэл цуглуулж байгаа мэт зөөлөн төрхтэй.",
    facts: [
      ["Бэлгэдэл", "Алтанзул нь цэвэр хайр, шинэ эхлэл, тайван баяр хөөрийг илтгэдэг."],
      ["Танин мэдэхүй", "Алтанзулын булцуу өвлийг давж хавар цэцэглэдэг тул тэсвэр, хүлээлтийн бэлгэдэл болдог."],
      ["Арчилгаа", "Нарны шууд хурц гэрлээс хамгаалж, усыг нь бага багаар шинэчилбэл иш нь шулуун хэвээр хадгалагдана."]
    ]
  },
  lily: {
    title: "Сараана",
    latin: "Lilium",
    summary:
      "Сараана нь цэвэр ариун байдал, эрхэмсэг зан, гэрэлтсэн сэтгэлийг илэрхийлдэг. Од мэт дэлгэгдсэн дэлбээ нь тайван боловч анхаарал татам сүртэй.",
    facts: [
      ["Бэлгэдэл", "Цагаан сараана нь үнэнч, ариун, сэтгэлийн гэрэлтэй холбоотой гэж үздэг."],
      ["Танин мэдэхүй", "Сараана хүчтэй үнэртэй, том дэлбээтэй тул ёслол, баярын чимэглэлд өргөн хэрэглэгддэг."],
      ["Арчилгаа", "Тоосыг нь хувцсанд хүргэхгүй авч, ишийг цэвэр усанд байлгавал дэлбээ нь удаан дэлгэрнэ."]
    ]
  }
};

const moods = {
  dawn: {
    bg: 0x1c1018,
    fog: 0x2d151f,
    key: 0xff7898,
    rim: 0xf7c977,
    accent: "#ff7898",
    accent2: "#f7c977"
  },
  velvet: {
    bg: 0x130b0d,
    fog: 0x3b1018,
    key: 0xff436d,
    rim: 0x62c18f,
    accent: "#ff436d",
    accent2: "#72d6a5"
  },
  pearl: {
    bg: 0x171418,
    fog: 0x29222e,
    key: 0xfff0df,
    rim: 0xaedbc9,
    accent: "#fff0df",
    accent2: "#aedbc9"
  },
  gold: {
    bg: 0x17120b,
    fog: 0x2d2410,
    key: 0xf4a261,
    rim: 0x8ed0a6,
    accent: "#f4a261",
    accent2: "#f7d774"
  }
};

const flowerThemes = {
  rose: "velvet",
  tulip: "gold",
  lily: "pearl"
};

const dom = {
  gate: document.getElementById("gate"),
  garden: document.getElementById("garden"),
  form: document.getElementById("passwordForm"),
  password: document.getElementById("passwordInput"),
  error: document.getElementById("passwordError"),
  canvas: document.getElementById("flowerCanvas"),
  title: document.getElementById("flowerTitle"),
  infoPanel: document.getElementById("infoPanel"),
  infoClose: document.getElementById("infoCloseBtn"),
  infoCategory: document.getElementById("infoCategory"),
  infoTitle: document.getElementById("infoTitle"),
  infoSummary: document.getElementById("infoSummary"),
  flowerFacts: document.getElementById("flowerFacts"),
  tabs: [...document.querySelectorAll(".flower-tab")],
  moodButtons: [...document.querySelectorAll(".mood-swatch")],
  autoRotate: document.getElementById("autoRotateBtn"),
  qrToggle: document.getElementById("qrToggleBtn"),
  qrPanel: document.getElementById("qrPanel"),
  qrClose: document.getElementById("qrCloseBtn"),
  qrCode: document.getElementById("qrCode"),
  qrUrl: document.getElementById("qrUrl"),
  copyLink: document.getElementById("copyLinkBtn"),
  downloadQr: document.getElementById("downloadQrBtn"),
  qrStatus: document.getElementById("qrStatus")
};

let renderer;
let scene;
let camera;
let controls;
let root;
let activeFlower;
let keyLight;
let rimLight;
let sparkleField;
let currentFlower = "rose";
let currentMood = "dawn";
let autoRotate = true;
let lastTime = 0;
let canvasTapStart = null;

const mobileInfoMedia = window.matchMedia("(max-width: 760px)");

initGate();
initThree();
setMood("dawn");
showFlower("rose");
setupEvents();
syncInfoPanelMode();
prepareQr();
animate();

function initGate() {
  dom.password.focus();

  dom.form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (dom.password.value.trim() === SECRET) {
      dom.error.textContent = "";
      dom.gate.classList.add("is-open");
      dom.garden.classList.remove("is-locked");
      setTimeout(() => controls?.update(), 120);
      return;
    }

    dom.error.textContent = "Нууц үг таарахгүй байна.";
    dom.password.select();
  });
}

function initThree() {
  renderer = new THREE.WebGLRenderer({
    canvas: dom.canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(moods.dawn.fog, 0.035);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 2.35, 7.2);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.minDistance = 4.2;
  controls.maxDistance = 10;
  controls.target.set(0, 1.7, 0);

  root = new THREE.Group();
  scene.add(root);

  const hemi = new THREE.HemisphereLight(0xfff2e8, 0x173a2a, 1.5);
  scene.add(hemi);

  keyLight = new THREE.PointLight(moods.dawn.key, 75, 12, 1.6);
  keyLight.position.set(-3.2, 4.1, 3.2);
  scene.add(keyLight);

  rimLight = new THREE.DirectionalLight(moods.dawn.rim, 2.2);
  rimLight.position.set(4.5, 5.2, -3.8);
  scene.add(rimLight);

  root.add(createSoilBase());

  sparkleField = createSparkles();
  scene.add(sparkleField);

  window.addEventListener("resize", resize);
}

function setupEvents() {
  dom.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      showFlower(tab.dataset.flower);
      if (isMobileInfoMode()) closeInfoPanel();
    });
  });

  dom.moodButtons.forEach((button) => {
    button.addEventListener("click", () => setMood(button.dataset.mood));
  });

  dom.autoRotate.addEventListener("click", () => {
    autoRotate = !autoRotate;
    controls.autoRotate = autoRotate;
    dom.autoRotate.setAttribute("aria-pressed", String(autoRotate));
  });

  dom.qrToggle.addEventListener("click", () => toggleQr(true));
  dom.qrClose.addEventListener("click", () => toggleQr(false));
  dom.infoClose.addEventListener("click", closeInfoPanel);
  dom.canvas.addEventListener("pointerdown", handleCanvasPointerDown);
  dom.canvas.addEventListener("pointerup", handleCanvasPointerUp);
  dom.canvas.addEventListener("pointercancel", () => {
    canvasTapStart = null;
  });
  if (mobileInfoMedia.addEventListener) {
    mobileInfoMedia.addEventListener("change", syncInfoPanelMode);
  } else {
    mobileInfoMedia.addListener(syncInfoPanelMode);
  }
  dom.qrUrl.addEventListener("input", () => generateQr(dom.qrUrl.value));
  dom.copyLink.addEventListener("click", copyQrLink);
  dom.downloadQr.addEventListener("click", downloadQr);
}

function showFlower(type) {
  currentFlower = type;
  setMood(flowerThemes[type] ?? "dawn");

  if (activeFlower) {
    root.remove(activeFlower);
    disposeObject(activeFlower);
  }

  activeFlower = buildFlower(type);
  root.add(activeFlower);

  dom.tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.flower === type);
  });

  renderInfo(type);
}

function renderInfo(type) {
  const data = flowerData[type];
  dom.title.textContent = data.title;
  dom.infoCategory.textContent = data.latin;
  dom.infoTitle.textContent = data.title;
  dom.infoSummary.textContent = data.summary;
  dom.flowerFacts.textContent = "";

  data.facts.forEach(([term, detail]) => {
    const wrapper = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = detail;
    wrapper.append(dt, dd);
    dom.flowerFacts.append(wrapper);
  });
}

function isMobileInfoMode() {
  return mobileInfoMedia.matches;
}

function openInfoPanel() {
  dom.garden.classList.add("is-info-open");
}

function closeInfoPanel() {
  dom.garden.classList.remove("is-info-open");
}

function syncInfoPanelMode() {
  if (isMobileInfoMode()) {
    closeInfoPanel();
    return;
  }

  openInfoPanel();
}

function handleCanvasPointerDown(event) {
  if (!isMobileInfoMode() || dom.garden.classList.contains("is-qr-open")) return;
  canvasTapStart = {
    x: event.clientX,
    y: event.clientY,
    time: performance.now()
  };
}

function handleCanvasPointerUp(event) {
  if (!canvasTapStart || !isMobileInfoMode() || dom.garden.classList.contains("is-qr-open")) {
    canvasTapStart = null;
    return;
  }

  const distance = Math.hypot(event.clientX - canvasTapStart.x, event.clientY - canvasTapStart.y);
  const elapsed = performance.now() - canvasTapStart.time;
  canvasTapStart = null;

  if (distance < 10 && elapsed < 700) {
    openInfoPanel();
  }
}

function setMood(name) {
  currentMood = name;
  const mood = moods[name];
  scene.background = new THREE.Color(mood.bg);
  scene.fog.color.setHex(mood.fog);
  keyLight.color.setHex(mood.key);
  rimLight.color.setHex(mood.rim);
  document.documentElement.style.setProperty("--accent", mood.accent);
  document.documentElement.style.setProperty("--accent-2", mood.accent2);
  dom.moodButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mood === name);
  });
}

function buildFlower(type) {
  if (type === "tulip") return buildTulip();
  if (type === "lily") return buildLily();
  return buildRose();
}

function createSoilBase() {
  const group = new THREE.Group();

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(2.25, 96),
    new THREE.MeshBasicMaterial({
      color: 0x050202,
      transparent: true,
      opacity: 0.34
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.68;
  shadow.scale.set(1.15, 0.72, 1);
  group.add(shadow);

  const soilBlock = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 0.58, 1.85, 6, 2, 6),
    new THREE.MeshPhysicalMaterial({
      color: 0x4a2b1e,
      roughness: 0.92,
      clearcoat: 0.05
    })
  );
  soilBlock.position.y = -0.36;
  soilBlock.rotation.y = THREE.MathUtils.degToRad(-4);
  group.add(soilBlock);

  const topSoil = new THREE.Mesh(
    new THREE.CylinderGeometry(1.28, 1.34, 0.18, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x2b1711,
      roughness: 0.96,
      clearcoat: 0.02
    })
  );
  topSoil.scale.z = 0.72;
  topSoil.position.y = -0.04;
  group.add(topSoil);

  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 64, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x352018,
      roughness: 0.95,
      clearcoat: 0.04
    })
  );
  mound.scale.set(1.05, 0.18, 0.68);
  mound.position.y = 0.03;
  group.add(mound);

  const rootMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc7965f,
    roughness: 0.78,
    clearcoat: 0.08
  });

  for (let i = 0; i < 11; i += 1) {
    const spread = (i - 5) / 5;
    const frontZ = 0.98 + Math.abs(spread) * 0.03;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.02 * Math.sin(i), -0.04, 0.52),
      new THREE.Vector3(spread * 0.2, -0.22 - Math.random() * 0.08, frontZ),
      new THREE.Vector3(spread * (0.55 + Math.random() * 0.3), -0.5 - Math.random() * 0.12, frontZ + 0.05)
    ]);
    const root = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 18, 0.015 + Math.random() * 0.006, 8, false),
      rootMaterial
    );
    group.add(root);
  }

  const pebbleMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6b4330,
    roughness: 0.88
  });

  for (let i = 0; i < 34; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 1.05;
    const pebble = new THREE.Mesh(
      new THREE.SphereGeometry(0.025 + Math.random() * 0.026, 10, 8),
      pebbleMaterial
    );
    pebble.position.set(Math.cos(angle) * radius, 0.09 + Math.random() * 0.025, Math.sin(angle) * radius * 0.62);
    pebble.scale.y = 0.45 + Math.random() * 0.35;
    group.add(pebble);
  }

  return group;
}

function buildRose() {
  const group = new THREE.Group();
  const stemHeight = 2.48;
  group.add(makeStem(stemHeight, 0x3f8d66, 0.055));
  group.add(makeLeaf(-0.48, 1.0, -36, 0.76, 0x4fa572));
  group.add(makeLeaf(0.44, 1.34, 32, 0.66, 0x6cb889));
  group.add(makeLeaf(-0.34, 1.72, -26, 0.54, 0x3f8d66));

  const bloom = new THREE.Group();
  bloom.position.y = stemHeight - 0.02;
  bloom.rotation.z = THREE.MathUtils.degToRad(-2);
  group.add(bloom);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 36, 20),
    petalMaterial(0xb81735, 0.95)
  );
  core.position.y = 0.18;
  core.scale.set(0.92, 1.05, 0.92);
  bloom.add(core);
  addCenterCluster(bloom, 0x8c1027, 0xf6b15e, 0.46, 0.105);

  const rings = [
    { count: 7, width: 0.16, height: 0.58, radius: 0.02, y: -0.1, tilt: -14, color: 0xb70f2c, curl: 0.13 },
    { count: 10, width: 0.22, height: 0.68, radius: 0.07, y: -0.15, tilt: -6, color: 0xd82342, curl: 0.15 },
    { count: 13, width: 0.29, height: 0.78, radius: 0.13, y: -0.2, tilt: 4, color: 0xef4560, curl: 0.18 },
    { count: 15, width: 0.34, height: 0.84, radius: 0.2, y: -0.26, tilt: 14, color: 0xff768a, curl: 0.2 }
  ];

  rings.forEach((ring, ringIndex) => {
    addPetalRing(bloom, {
      ...ring,
      angleOffset: ringIndex * 0.22,
      twist: ringIndex < 2 ? 8 : 4,
      sheen: 0.95 - ringIndex * 0.04
    });
  });

  addSepals(bloom, 8, 0.2, -0.3, 0x438b5c);
  return group;
}

function buildTulip() {
  const group = new THREE.Group();
  const stemHeight = 2.42;
  group.add(makeStem(stemHeight, 0x4a9c6a, 0.052));
  group.add(makeLeaf(-0.52, 0.88, -42, 0.95, 0x5ab779));
  group.add(makeLeaf(0.5, 1.18, 38, 0.86, 0x78c98e));
  group.add(makeLeaf(-0.34, 1.6, -30, 0.66, 0x3e8e62));

  const bloom = new THREE.Group();
  bloom.position.y = stemHeight - 0.1;
  bloom.rotation.z = THREE.MathUtils.degToRad(2);
  group.add(bloom);

  addPetalRing(bloom, {
    count: 6,
    width: 0.36,
    height: 1.08,
    radius: 0.16,
    y: -0.28,
    tilt: 13,
    color: 0xff8357,
    curl: 0.18,
    angleOffset: 0.12,
    twist: 5,
    sheen: 0.9
  });

  addPetalRing(bloom, {
    count: 3,
    width: 0.3,
    height: 0.96,
    radius: 0.06,
    y: -0.18,
    tilt: 5,
    color: 0xffc16f,
    curl: 0.12,
    angleOffset: 0.72,
    twist: 2,
    sheen: 0.96
  });

  const heart = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 30, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x492f21,
      roughness: 0.6,
      metalness: 0,
      clearcoat: 0.2
    })
  );
  heart.position.y = 0.22;
  heart.scale.set(0.9, 0.5, 0.9);
  bloom.add(heart);
  addSepals(bloom, 6, 0.18, -0.34, 0x4c9964);
  return group;
}

function buildLily() {
  const group = new THREE.Group();
  const stemHeight = 2.18;
  group.add(makeStem(stemHeight, 0x4a8d62, 0.046));
  group.add(makeLeaf(-0.42, 0.96, -34, 0.72, 0x5fa66f));
  group.add(makeLeaf(0.36, 1.34, 32, 0.64, 0x80bd86));

  const bloom = new THREE.Group();
  bloom.position.y = stemHeight;
  bloom.rotation.z = THREE.MathUtils.degToRad(-7);
  group.add(bloom);

  const petalGeo = createPetalGeometry(0.36, 1.2, 42, 0.26);
  for (let i = 0; i < 6; i += 1) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / 6) * Math.PI * 2;
    pivot.position.y = -0.16;
    const petal = new THREE.Mesh(petalGeo, petalMaterial(i % 2 ? 0xfff2ec : 0xffd9df, 0.98));
    petal.position.z = 0.06;
    petal.rotation.x = THREE.MathUtils.degToRad(58);
    petal.rotation.z = THREE.MathUtils.degToRad(i % 2 ? 8 : -8);
    pivot.add(petal);
    bloom.add(pivot);
    addLilySpots(petal, i);
  }

  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    const filament = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.018, 0.7, 10),
      new THREE.MeshPhysicalMaterial({ color: 0xf7d2c0, roughness: 0.5 })
    );
    filament.position.set(Math.sin(angle) * 0.08, 0.34, Math.cos(angle) * 0.08);
    filament.rotation.z = Math.sin(angle) * 0.28;
    filament.rotation.x = Math.cos(angle) * 0.28;
    bloom.add(filament);

    const anther = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.035, 0.12, 8, 16),
      new THREE.MeshPhysicalMaterial({ color: 0xd28f2f, roughness: 0.45, clearcoat: 0.4 })
    );
    anther.position.set(Math.sin(angle) * 0.18, 0.7, Math.cos(angle) * 0.18);
    anther.rotation.z = angle;
    bloom.add(anther);
  }

  addSepals(bloom, 6, 0.16, -0.26, 0x57966a);
  return group;
}

function addPetalRing(group, config) {
  const geometry = createPetalGeometry(config.width, config.height, 42, config.curl);
  const material = petalMaterial(config.color, config.sheen ?? 0.9);

  for (let i = 0; i < config.count; i += 1) {
    const angle = (i / config.count) * Math.PI * 2 + (config.angleOffset ?? 0);
    const pivot = new THREE.Group();
    pivot.rotation.y = angle;
    pivot.position.y = config.y;

    const petal = new THREE.Mesh(geometry, material);
    petal.position.z = config.radius;
    petal.rotation.x = THREE.MathUtils.degToRad(config.tilt);
    petal.rotation.z = THREE.MathUtils.degToRad(Math.sin(i * 1.7) * (config.twist ?? 0));
    pivot.add(petal);
    group.add(pivot);
  }
}

function addSepals(group, count, radius, y, color) {
  const geometry = createPetalGeometry(0.08, 0.42, 20, 0.06);
  const material = new THREE.MeshPhysicalMaterial({
    color,
    side: THREE.DoubleSide,
    roughness: 0.58,
    clearcoat: 0.22,
    sheen: 0.45
  });

  for (let i = 0; i < count; i += 1) {
    const pivot = new THREE.Group();
    pivot.rotation.y = (i / count) * Math.PI * 2;
    pivot.position.y = y;
    const sepal = new THREE.Mesh(geometry, material);
    sepal.position.z = radius;
    sepal.rotation.x = THREE.MathUtils.degToRad(104);
    pivot.add(sepal);
    group.add(pivot);
  }
}

function addCenterCluster(group, coreColor, pollenColor, y, radius) {
  const center = new THREE.Group();
  center.position.set(0, y, 0.05);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 16),
    new THREE.MeshPhysicalMaterial({
      color: coreColor,
      roughness: 0.48,
      clearcoat: 0.35
    })
  );
  core.scale.y = 0.82;
  center.add(core);

  const pollenMaterial = new THREE.MeshPhysicalMaterial({
    color: pollenColor,
    roughness: 0.42,
    clearcoat: 0.2
  });

  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.22, 10, 8), pollenMaterial);
    bead.position.set(Math.cos(angle) * radius * 0.9, radius * 0.35, Math.sin(angle) * radius * 0.9);
    center.add(bead);
  }

  group.add(center);
}

function makeStem(height, color, radius) {
  const stem = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 1.18, height, 32),
    new THREE.MeshPhysicalMaterial({
      color,
      roughness: 0.48,
      clearcoat: 0.28,
      sheen: 0.35
    })
  );
  stem.position.y = height / 2;
  stem.rotation.z = THREE.MathUtils.degToRad(2.5);
  return stem;
}

function makeLeaf(side, y, angle, size, color) {
  const leaf = new THREE.Mesh(
    createPetalGeometry(0.34 * size, 1.05 * size, 32, 0.08),
    new THREE.MeshPhysicalMaterial({
      color,
      side: THREE.DoubleSide,
      roughness: 0.52,
      clearcoat: 0.25,
      sheen: 0.6
    })
  );
  leaf.position.set(side * 0.2, y, 0);
  leaf.rotation.z = THREE.MathUtils.degToRad(angle);
  leaf.rotation.x = THREE.MathUtils.degToRad(72);
  leaf.rotation.y = side < 0 ? -0.52 : 0.52;
  return leaf;
}

function createPetalGeometry(width, height, segments, curl) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(width * 0.54, height * 0.14, width * 0.62, height * 0.7, 0, height);
  shape.bezierCurveTo(-width * 0.62, height * 0.7, -width * 0.54, height * 0.14, 0, 0);

  const geometry = new THREE.ShapeGeometry(shape, segments);
  const positions = geometry.attributes.position;

  for (let i = 0; i < positions.count; i += 1) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const t = THREE.MathUtils.clamp(y / height, 0, 1);
    const side = Math.abs(x) / Math.max(width * 0.62, 0.001);
    const cup = Math.sin(t * Math.PI) * curl * (0.55 + side * 0.5);
    const tipCurl = t * t * curl * 0.65;
    positions.setZ(i, cup + tipCurl);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function petalMaterial(color, sheen) {
  return new THREE.MeshPhysicalMaterial({
    color,
    side: THREE.DoubleSide,
    roughness: 0.46,
    metalness: 0,
    clearcoat: 0.62,
    clearcoatRoughness: 0.38,
    sheen,
    sheenRoughness: 0.72,
    emissive: new THREE.Color(color).multiplyScalar(0.04)
  });
}

function addDew(group, count, color, opacity) {
  const material = new THREE.MeshPhysicalMaterial({
    color,
    transparent: true,
    opacity,
    roughness: 0.05,
    metalness: 0,
    transmission: 0.35,
    clearcoat: 1
  });

  for (let i = 0; i < count; i += 1) {
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.014 + Math.random() * 0.018, 12, 8), material);
    const radius = 0.16 + Math.random() * 0.58;
    const angle = Math.random() * Math.PI * 2;
    bead.position.set(Math.cos(angle) * radius, 0.12 + Math.random() * 0.68, Math.sin(angle) * radius);
    group.add(bead);
  }
}

function addLilySpots(petal, seed) {
  const spotMaterial = new THREE.MeshBasicMaterial({
    color: 0xa64b5e,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });

  for (let i = 0; i < 7; i += 1) {
    const spot = new THREE.Mesh(new THREE.CircleGeometry(0.018 + Math.random() * 0.012, 12), spotMaterial);
    spot.position.x = (Math.random() - 0.5) * 0.18;
    spot.position.y = 0.28 + Math.random() * 0.45;
    spot.position.z = 0.012 + seed * 0.0002;
    petal.add(spot);
  }
}

function createSparkles() {
  const count = 220;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const colorA = new THREE.Color(0xffd9cd);
  const colorB = new THREE.Color(0x8ed0a6);

  for (let i = 0; i < count; i += 1) {
    const radius = 3 + Math.random() * 5;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.random() * 5.2 - 0.5;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 1.5;
    const mixed = colorA.clone().lerp(colorB, Math.random());
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false
    })
  );
}

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function animate(time = 0) {
  const delta = (time - lastTime) / 1000;
  lastTime = time;

  if (activeFlower) {
    activeFlower.rotation.y += delta * 0.08;
  }

  if (sparkleField) {
    sparkleField.rotation.y += delta * 0.018;
    sparkleField.position.y = Math.sin(time * 0.0006) * 0.08;
  }

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function disposeObject(object) {
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((material) => material.dispose());
      } else {
        child.material.dispose();
      }
    }
  });
}

function prepareQr() {
  const cleanUrl = new URL(window.location.href);
  cleanUrl.hash = "";
  dom.qrUrl.value = cleanUrl.href;

  const tryGenerate = () => {
    if (window.QRCode) {
      generateQr(dom.qrUrl.value);
      return;
    }
    setTimeout(tryGenerate, 120);
  };

  tryGenerate();
}

function toggleQr(open) {
  dom.qrPanel.hidden = !open;
  dom.garden.classList.toggle("is-qr-open", open);
  dom.qrToggle.setAttribute("aria-expanded", String(open));
  if (open) generateQr(dom.qrUrl.value);
}

function generateQr(value) {
  const link = value.trim();
  if (!link) {
    dom.qrStatus.textContent = "Холбоос хоосон байна.";
    return;
  }

  if (!window.QRCode) {
    dom.qrStatus.textContent = "QR сан ачаалж байна.";
    return;
  }

  dom.qrCode.textContent = "";

  try {
    if (window.QRCode.toCanvas) {
      const canvas = document.createElement("canvas");
      dom.qrCode.append(canvas);
      window.QRCode.toCanvas(
        canvas,
        link,
        {
          width: 224,
          margin: 2,
          color: {
            dark: "#25131c",
            light: "#fff8f4"
          }
        },
        (error) => {
          dom.qrStatus.textContent = error ? "QR үүсгэж чадсангүй." : "QR бэлэн.";
        }
      );
      return;
    }

    new window.QRCode(dom.qrCode, {
      text: link,
      width: 224,
      height: 224,
      colorDark: "#25131c",
      colorLight: "#fff8f4",
      correctLevel: window.QRCode.CorrectLevel.M
    });
    dom.qrStatus.textContent = "QR бэлэн.";
  } catch {
    dom.qrStatus.textContent = "QR үүсгэж чадсангүй.";
  }
}

async function copyQrLink() {
  const value = dom.qrUrl.value.trim();
  try {
    await navigator.clipboard.writeText(value);
    dom.qrStatus.textContent = "Холбоос хуулагдлаа.";
  } catch {
    dom.qrUrl.select();
    dom.qrStatus.textContent = "Холбоосыг сонголоо.";
  }
}

function downloadQr() {
  generateQr(dom.qrUrl.value);
  const image = dom.qrCode.querySelector("canvas, img");
  if (!image) {
    dom.qrStatus.textContent = "QR хараахан бэлэн биш байна.";
    return;
  }

  const link = document.createElement("a");
  link.download = "nuuts-tsetserleg-qr.png";
  link.href = image instanceof HTMLCanvasElement ? image.toDataURL("image/png") : image.src;
  link.click();
  dom.qrStatus.textContent = "QR зураг бэлэн.";
}
