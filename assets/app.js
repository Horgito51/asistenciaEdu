// ── DATOS ──────────────────────────────────────────────
const ESTUDIANTES = [
  'Alicia Moreno','Bruno Salazar','Camila Torres','Diego Vega','Elena Ríos',
  'Felipe Gómez','Gabriela Pinto','Humberto Cruz','Isabela Navas','José Lara',
  'Karen Molina','Luis Paredes','Marta Solis','Nicolás Reyes','Olga Herrera',
  'Pablo Durán','Quena Flores','Roberto Ávila','Sara Mendoza','Tomás Jiménez'
];

const MATERIAS = [
  { id:'mat', nombre:'Matemáticas', color:'#3B82F6',
    actividades:[{id:'m1',nombre:'Tarea 1',tipo:'Tarea'},{id:'m2',nombre:'Quiz álgebra',tipo:'Quiz'},{id:'m3',nombre:'Examen parcial',tipo:'Examen'},{id:'m4',nombre:'Ejercicio clase',tipo:'Tarea'}]},
  { id:'len', nombre:'Lenguaje',    color:'#8B5CF6',
    actividades:[{id:'l1',nombre:'Lectura grupal',tipo:'Participación'},{id:'l2',nombre:'Redacción',tipo:'Tarea'},{id:'l3',nombre:'Dictado',tipo:'Quiz'}]},
  { id:'cie', nombre:'Ciencias',    color:'#10B981',
    actividades:[{id:'c1',nombre:'Lab. células',tipo:'Laboratorio'},{id:'c2',nombre:'Informe lab.',tipo:'Tarea'},{id:'c3',nombre:'Quiz ecosistemas',tipo:'Quiz'},{id:'c4',nombre:'Exposición',tipo:'Exposición'}]},
  { id:'his', nombre:'Historia',    color:'#F59E0B',
    actividades:[{id:'h1',nombre:'Línea de tiempo',tipo:'Tarea'},{id:'h2',nombre:'Examen cultura',tipo:'Examen'},{id:'h3',nombre:'Debate',tipo:'Participación'}]},
  { id:'ing', nombre:'Inglés',      color:'#EF4444',
    actividades:[{id:'i1',nombre:'Vocabulary test',tipo:'Quiz'},{id:'i2',nombre:'Reading comp.',tipo:'Examen'},{id:'i3',nombre:'Speaking',tipo:'Participación'},{id:'i4',nombre:'Writing task',tipo:'Tarea'}]},
];

// Genera notas aleatorias para demo
const notas = {};
ESTUDIANTES.forEach(est => {
  notas[est] = {};
  MATERIAS.forEach(m => m.actividades.forEach(a => {
    notas[est][a.id] = parseFloat((Math.random() * 4 + 6).toFixed(1));
  }));
});

// ── HELPERS ────────────────────────────────────────────
function getC(n) { return n>=9?'na':n>=7.5?'nb':n>=7?'nc':'nd'; }

function promEst(est) {
  let s=0, c=0;
  MATERIAS.forEach(m => m.actividades.forEach(a => { s += notas[est][a.id]; c++; }));
  return c ? parseFloat((s/c).toFixed(1)) : 0;
}

function promEstMat(est, mid) {
  const m = MATERIAS.find(x => x.id===mid);
  if (!m || !m.actividades.length) return 0;
  const s = m.actividades.reduce((a,b) => a + notas[est][b.id], 0);
  return parseFloat((s / m.actividades.length).toFixed(1));
}

function promActiv(id) {
  return parseFloat((ESTUDIANTES.reduce((s,e) => s + notas[e][id], 0) / ESTUDIANTES.length).toFixed(1));
}

function getMat() { return MATERIAS.find(m => m.id === matActiva); }

// ── ESTADO ─────────────────────────────────────────────
const asistencia = {};
ESTUDIANTES.forEach(e => asistencia[e] = null);

let matActiva = MATERIAS[0].id;
let actActiva = MATERIAS[0].actividades[0].id;
let perfilEst = null;

const incData = [
  { est:'Bruno Salazar', tipo:'Conducta disruptiva', sev:'medio', desc:'Interrumpió la clase en varias ocasiones.', fecha:'10 abr', canal:'Telegram' },
  { est:'Elena Ríos',    tipo:'Ausentismo reiterado', sev:'alto',  desc:'Tercera falta injustificada del mes.',     fecha:'08 abr', canal:'Telegram' },
];

// ── FECHA ──────────────────────────────────────────────
const hoy = new Date();
document.getElementById('fecha-hoy').textContent =
  hoy.toLocaleDateString('es-EC', { weekday:'short', day:'numeric', month:'short', year:'numeric' });

// ── NAVEGACIÓN ─────────────────────────────────────────
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab-main').forEach(t => t.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  const idx = { asistencia:0, notas:1, incidentes:2 }[id];
  document.querySelectorAll('.tab-main')[idx].classList.add('active');
}

// ── ASISTENCIA ─────────────────────────────────────────
function renderAsistencia() {
  document.getElementById('tabla-est').innerHTML = ESTUDIANTES.map((est, i) => {
    const s = asistencia[est];
    const badge = s
      ? `<span class="badge ${s.toLowerCase()}">${s==='P'?'Presente':s==='A'?'Ausente':'Tardanza'}</span>`
      : `<span style="color:var(--muted);font-size:12px;">Sin marcar</span>`;
    const btns = ['P','A','T'].map(x =>
      `<button class="att-btn ${x.toLowerCase()} ${s===x?'active':''}" onclick="marcar('${est}','${x}')">${x}</button>`
    ).join('');
    return `<tr onclick="abrirPerfil('${est}')">
      <td style="color:var(--muted);font-family:var(--mono);font-size:12px;">${String(i+1).padStart(2,'0')}</td>
      <td style="font-weight:500;">${est}</td>
      <td>${badge}</td>
      <td onclick="event.stopPropagation()"><div class="att-row">${btns}</div></td>
    </tr>`;
  }).join('');

  const v = Object.values(asistencia);
  document.getElementById('cnt-p').textContent = v.filter(x=>x==='P').length;
  document.getElementById('cnt-a').textContent = v.filter(x=>x==='A').length;
  document.getElementById('cnt-t').textContent = v.filter(x=>x==='T').length;
  document.getElementById('cnt-s').textContent = v.filter(x=>x===null).length;
}

function marcar(est, s)  { asistencia[est] = s; renderAsistencia(); }
function marcarTodos(s)  { ESTUDIANTES.forEach(e => asistencia[e] = s); renderAsistencia(); }
function limpiarMarcas() { ESTUDIANTES.forEach(e => asistencia[e] = null); renderAsistencia(); }

function enviarInspeccion() {
  const sin = ESTUDIANTES.filter(e => asistencia[e] === null);
  if (sin.length) { showToast('⚠ Aún hay ' + sin.length + ' sin marcar'); return; }
  showToast('✓ Asistencia enviada a Inspección');
}

// ── NOTAS ──────────────────────────────────────────────
function renderSidebar() {
  document.getElementById('mat-sidebar').innerHTML = MATERIAS.map(m => `
    <div class="mat-item ${m.id===matActiva?'active':''}" style="--mc:${m.color}" onclick="selMateria('${m.id}')">
      <span class="mat-dot" style="background:${m.color}"></span>
      <span class="mat-item-name">${m.nombre}</span>
      <span class="mat-item-count">${m.actividades.length}</span>
    </div>`).join('');
}

function renderChips() {
  const m = getMat();
  document.getElementById('act-chips').innerHTML = m.actividades.map(a => `
    <button class="act-chip ${a.id===actActiva?'active':''}" onclick="selActividad('${a.id}')">${a.nombre}</button>`
  ).join('');
}

function renderTablaNotas() {
  const m   = getMat();
  const act = m.actividades.find(a => a.id === actActiva);
  if (!act) return;

  const prom = promActiv(act.id);
  document.getElementById('notas-titulo').textContent     = m.nombre;
  document.getElementById('act-nombre-label').textContent = act.nombre;
  document.getElementById('act-tipo-label').textContent   = act.tipo;
  document.getElementById('act-prom-label').innerHTML     =
    `Promedio grupo: <span class="nota-pill ${getC(prom)}" style="font-size:11px;">${prom}</span>`;
  document.getElementById('n-acts').textContent = m.actividades.length;

  const proms = ESTUDIANTES.map(e => promEst(e));
  document.getElementById('n-prom').textContent = parseFloat((proms.reduce((a,b)=>a+b,0)/proms.length).toFixed(1));
  document.getElementById('n-apro').textContent = proms.filter(p=>p>=7).length;
  document.getElementById('n-repo').textContent = proms.filter(p=>p<7).length;

  document.getElementById('notas-body').innerHTML = ESTUDIANTES.map((est, i) => {
    const v = notas[est][act.id];
    return `<tr onclick="abrirPerfil('${est}')">
      <td style="color:var(--muted);font-family:var(--mono);font-size:12px;">${String(i+1).padStart(2,'0')}</td>
      <td style="font-weight:500;">${est}</td>
      <td onclick="event.stopPropagation()">
        <input type="number" class="nota-cell" min="0" max="10" step="0.1" value="${v}"
          onchange="notas['${est}']['${act.id}']=+this.value;renderTablaNotas();">
      </td>
      <td><span class="nota-pill ${getC(v)}">${v}</span></td>
      <td><button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();abrirPerfil('${est}')">Ver perfil</button></td>
    </tr>`;
  }).join('');
}

function selMateria(id) {
  matActiva = id;
  const m = getMat();
  if (m && m.actividades.length) actActiva = m.actividades[0].id;
  renderSidebar(); renderChips(); renderTablaNotas();
}

function selActividad(id) { actActiva = id; renderChips(); renderTablaNotas(); }

function agregarActividad() {
  const m      = getMat();
  const nombre = prompt('Nombre de la actividad:', 'Actividad ' + (m.actividades.length + 1));
  if (!nombre) return;
  const tipo = prompt('Tipo (Tarea / Quiz / Examen / Laboratorio / Exposición):', 'Tarea') || 'Tarea';
  const id   = matActiva + '_' + Date.now();
  m.actividades.push({ id, nombre, tipo });
  ESTUDIANTES.forEach(est => notas[est][id] = 7.0);
  actActiva = id;
  renderSidebar(); renderChips(); renderTablaNotas();
}

function abrirEnvioTodos() {
  showToast('✓ Boletines enviados a los ' + ESTUDIANTES.length + ' representantes por Telegram');
}

// ── PERFIL ─────────────────────────────────────────────
function abrirPerfil(est) {
  perfilEst = est;
  document.getElementById('modal-title').textContent = 'Perfil · ' + est;
  document.getElementById('p-nombre').textContent    = est;
  document.getElementById('p-avatar').textContent    =
    est.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  const pg = promEst(est);
  document.getElementById('p-prom-general').innerHTML =
    `<span class="nota-pill ${getC(pg)}">${pg}</span>`;

  document.getElementById('p-materias').innerHTML = MATERIAS.map(m => {
    const pm   = promEstMat(est, m.id);
    const acts = m.actividades.map(a => `
      <div class="mat-act-row">
        <span class="mat-act-name">${a.nombre}<span class="mat-act-tipo">${a.tipo}</span></span>
        <span class="nota-pill ${getC(notas[est][a.id])}" style="font-size:11px;">${notas[est][a.id]}</span>
      </div>`).join('');
    return `<div class="mat-block">
      <div class="mat-block-header">
        <span class="mat-dot" style="background:${m.color}"></span>
        <span class="mat-block-title">${m.nombre}</span>
        <span class="nota-pill ${getC(pm)}" style="font-size:11px;margin-left:auto;">${pm}</span>
      </div>${acts}
    </div>`;
  }).join('');

  abrirModal('modal-bg');
}

function enviarBoletinTg() {
  if (!perfilEst) return;
  cerrarModal('modal-bg');
  showToast('✓ Boletín de ' + perfilEst + ' enviado al representante por Telegram');
}

// ── INCIDENTES ─────────────────────────────────────────
function renderIncidentes() {
  const el = document.getElementById('inc-list');
  el.innerHTML = incData.length
    ? incData.map(inc => `
        <div class="incident-item ${inc.sev}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
            <span style="font-size:13px;font-weight:600;color:var(--text2);">${inc.est}</span>
            <span class="sev-badge ${inc.sev}">${inc.sev.charAt(0).toUpperCase()+inc.sev.slice(1)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
            <span style="font-size:12px;color:var(--text3);">${inc.tipo}</span>
            <span style="font-size:11px;color:var(--muted2);">${inc.fecha} · ${inc.canal}</span>
          </div>
          <div style="font-size:12px;color:var(--muted);">${inc.desc}</div>
        </div>`).join('')
    : '<div style="color:var(--muted);font-size:13px;text-align:center;padding:2rem;">Sin incidentes</div>';
}

function poblarSelectInc() {
  document.getElementById('inc-est').innerHTML =
    ESTUDIANTES.map(e => `<option>${e}</option>`).join('');
}

function guardarIncidente() {
  const est  = document.getElementById('inc-est').value;
  const sev  = document.getElementById('inc-sev').value;
  const tipo = document.getElementById('inc-tipo').value;
  const desc = document.getElementById('inc-desc').value.trim();
  if (!desc) { showToast('⚠ Escribe una descripción'); return; }
  const ms = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  incData.unshift({ est, tipo, sev, desc, fecha: hoy.getDate() + ' ' + ms[hoy.getMonth()], canal: 'Telegram' });
  renderIncidentes();
  document.getElementById('inc-desc').value = '';
  // Mostrar modal de registro antes del envío
  abrirModalBeta('incidente', est);
}

// ── MODALES ────────────────────────────────────────────
function abrirModal(id)  { document.getElementById(id).classList.add('open'); }
function cerrarModal(id) { document.getElementById(id).classList.remove('open'); }
function abrirPremium()  { abrirModal('premium-bg'); }

// Beta modal – contexto flexible
function abrirModalBeta(contexto, extra) {
  const tituloEl = document.getElementById('beta-context-msg');
  if (contexto === 'incidente') {
    tituloEl.textContent = `Registra tu cuenta para enviar el reporte de ${extra} por Telegram.`;
  } else if (contexto === 'boletin') {
    tituloEl.textContent = `Registra tu cuenta para enviar el boletín al representante.`;
  } else {
    tituloEl.textContent = 'Regístrate para acceder a todas las funciones de la beta.';
  }
  abrirModal('beta-bg');
}

function irAFormulario() {
  // Reemplaza esta URL con tu Google Form real
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf5h-o23tH19KsZ8o56ddWMcGdLQbbdAHMIbgRw4Bj3RpTYZg/viewform?usp=publish-editor';
  window.open(GOOGLE_FORM_URL, '_blank');
  cerrarModal('beta-bg');
  showToast('✓ Gracias por registrarte en la beta');
}

// ── TOAST ──────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── INIT ───────────────────────────────────────────────
renderAsistencia();
renderSidebar();
renderChips();
renderTablaNotas();
renderIncidentes();
poblarSelectInc();