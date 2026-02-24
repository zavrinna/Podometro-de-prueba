// ─────────────────────────────────────────────
// REGISTRAR SERVICE WORKER
// ─────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('✅ SW registrado:', reg.scope))
      .catch(err => console.warn('SW error:', err));
  });
}

// ─────────────────────────────────────────────
// PROMPT DE INSTALACIÓN PWA
// ─────────────────────────────────────────────
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('install-banner').classList.add('show');
});

function installApp() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  deferredPrompt.userChoice.then(() => {
    deferredPrompt = null;
    closeBanner();
  });
}

function closeBanner() {
  document.getElementById('install-banner').classList.remove('show');
}

// ─────────────────────────────────────────────
// SI YA TIENE PERFIL, IR DIRECTO A LA APP
// ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('podometro_profile');
  if (saved) {
    // Aquí redirigirías a app.html cuando la tengamos
    // window.location.href = 'app.html';
    console.log('Perfil encontrado:', JSON.parse(saved));
  }
});

// ─────────────────────────────────────────────
// LÓGICA DEL ONBOARDING
// ─────────────────────────────────────────────
const STRIDE_DEFAULTS = { male: 78, female: 70 };
const STRIDE_FORMULA  = { male: (h) => +(h * 0.415).toFixed(1), female: (h) => +(h * 0.413).toFixed(1) };

const profile = { sex: null, height: null, stepLength: null, method: null };
let heightToggleOn = false;

function selectSex(sex) {
  profile.sex = sex;
  document.getElementById('btn-male').classList.toggle('selected', sex === 'male');
  document.getElementById('btn-female').classList.toggle('selected', sex === 'female');
  document.getElementById('error-sex').classList.remove('show');
}

function goToHeight() {
  if (!profile.sex) { document.getElementById('error-sex').classList.add('show'); return; }
  showStep('step-height');
  updateStridePreview(null);
}

function toggleHeight() {
  heightToggleOn = !heightToggleOn;
  document.getElementById('toggle-sw').classList.toggle('on', heightToggleOn);
  document.getElementById('height-input-wrap').classList.toggle('visible', heightToggleOn);
  if (!heightToggleOn) {
    profile.height = null;
    updateStridePreview(null);
    document.getElementById('error-height').classList.remove('show');
  } else {
    const val = document.getElementById('height-slider').value;
    document.getElementById('height-field').value = val;
    updateStridePreview(+val);
  }
}

function onHeightInput(val) {
  document.getElementById('height-slider').value = val;
  document.getElementById('error-height').classList.remove('show');
  if (val && +val >= 100 && +val <= 220) updateStridePreview(+val);
  else updateStridePreview(null);
}

function syncSlider(val) {
  document.getElementById('height-field').value = val;
  updateStridePreview(+val);
}

function updateStridePreview(height) {
  const preview = document.getElementById('stride-preview');
  const valueEl = document.getElementById('stride-value');
  if (!profile.sex) { preview.classList.remove('show'); return; }
  const stride = (height && height >= 100 && height <= 220)
    ? STRIDE_FORMULA[profile.sex](height)
    : STRIDE_DEFAULTS[profile.sex];
  valueEl.innerHTML = `${stride} <span>cm</span>`;
  preview.classList.add('show');
}

function goToConfirm() {
  if (heightToggleOn) {
    const val = +document.getElementById('height-field').value;
    if (!val || val < 100 || val > 220) {
      document.getElementById('error-height').classList.add('show');
      return;
    }
    profile.height = val;
  } else {
    profile.height = null;
  }
  profile.stepLength = profile.height
    ? STRIDE_FORMULA[profile.sex](profile.height)
    : STRIDE_DEFAULTS[profile.sex];
  profile.method = profile.height ? 'custom' : 'standard';

  document.getElementById('summary-sex').textContent    = profile.sex === 'male' ? 'Masculino ♂️' : 'Femenino ♀️';
  document.getElementById('summary-height').textContent = profile.height ? `${profile.height} cm` : 'No especificada';
  document.getElementById('summary-stride').textContent = `${profile.stepLength} cm`;
  document.getElementById('summary-method').textContent = profile.method === 'custom' ? 'Personalizado 🎯' : 'Promedio estándar 📊';

  showStep('step-confirm');
}

function saveAndStart() {
  const data = {
    sex: profile.sex,
    height: profile.height,
    stepLength: profile.stepLength,
    stepLengthM: +(profile.stepLength / 100).toFixed(4),
    method: profile.method,
    setupDate: new Date().toISOString()
  };
  localStorage.setItem('podometro_profile', JSON.stringify(data));
  window.location.href = 'app.html';
}

function showStep(id) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}