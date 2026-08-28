(() => {
  const plan = window.TRAINING_PLAN
  const STORAGE_KEY = 'la-pizarra-prebenjamin:v1'
  const statusOrder = ['pending', 'emerging', 'frequent']

  const defaultState = {
    version: 1,
    weekIndex: 0,
    completed: {},
    activityDone: {},
    notes: {},
    observations: {},
    players: [],
    attendance: {},
  }

  const loadState = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      return { ...defaultState, ...saved }
    } catch {
      return { ...defaultState }
    }
  }

  let state = loadState()
  let openExercise = 0
  let notesOpen = false
  let toastTimer

  const saveState = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
  const sid = (weekIndex, sessionIndex) => `w${weekIndex}-s${sessionIndex}`
  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')

  const iconPaths = {
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    chart: '<path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M2 20h20"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"/><path d="M4 19.5V6.5M8 8h8M8 12h6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    ball: '<circle cx="12" cy="12" r="9"/><path d="m9.5 10 2.5-2 2.5 2-.9 3h-3.2zM12 8V3M9.5 10 5 8M10.4 13l-3 4M13.6 13l3 4M14.5 10 19 8"/>',
    note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    print: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    person: '<circle cx="12" cy="5" r="2.5"/><path d="M8 22l1-7-3-3 3-5h6l3 4M13 22l-1-7 4-2 3 4"/>',
    external: '<path d="M14 3h7v7M10 14 21 3M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  }

  const icon = (name, size = 20, className = '') => `<svg class="icon ${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.ball}</svg>`

  const route = () => {
    const raw = location.hash.replace('#', '') || 'week'
    const [view, a, b] = raw.split('/')
    return { view, week: Number(a), session: Number(b) }
  }

  const startOfWeek = (weekIndex) => {
    const date = new Date(plan.baseDate)
    date.setDate(date.getDate() + weekIndex * 7)
    return date
  }

  const dateRange = (weekIndex) => {
    const start = startOfWeek(weekIndex)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    const f = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' })
    return `${f.format(start).replace('.', '')} — ${f.format(end).replace('.', '')}`
  }

  const sessionDate = (weekIndex, sessionIndex) => {
    const date = startOfWeek(weekIndex)
    date.setDate(date.getDate() + (sessionIndex === 0 ? 2 : 4))
    return new Intl.DateTimeFormat('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }).format(date).replaceAll('.', '')
  }

  const brandMark = () => `
    <svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M24 3 42 13v22L24 45 6 35V13z" fill="white" stroke="currentColor" stroke-width="2.2"/>
      <circle cx="24" cy="17" r="5" fill="#ff4d3d" stroke="currentColor" stroke-width="1.8"/>
      <path d="M9 28c5-4 9 4 15 0s10 4 15 0M9 34c5-4 9 4 15 0s10 4 15 0" fill="none" stroke="#185adb" stroke-width="2.3"/>
      <path d="M16 9 24 3l8 6" fill="none" stroke="currentColor" stroke-width="2"/>
    </svg>`

  const navItems = [
    ['week', 'Semana', 'calendar'],
    ['progress', 'Progreso', 'chart'],
    ['team', 'Equipo', 'users'],
    ['library', 'Biblioteca', 'book'],
  ]

  const appHeader = (active) => `
    <header class="app-header">
      <a class="brand" href="#week" aria-label="La Pizarra, inicio">
        ${brandMark()}<span>La Pizarra</span>
      </a>
      <nav class="desktop-nav" aria-label="Navegación principal">
        ${navItems.map(([id, label, glyph]) => `<a href="#${id}" class="nav-link ${active === id || (active === 'session' && id === 'week') ? 'is-active' : ''}">${icon(glyph, 19)}<span>${label}</span></a>`).join('')}
      </nav>
      <div class="coach-control" title="Datos guardados solo en este dispositivo"><span>JC</span>${icon('shield', 15)}</div>
    </header>`

  const mobileNav = (active) => `<nav class="mobile-nav" aria-label="Navegación móvil">${navItems.map(([id, label, glyph]) => `<a href="#${id}" class="${active === id || (active === 'session' && id === 'week') ? 'is-active' : ''}">${icon(glyph, 20)}<span>${label}</span></a>`).join('')}</nav>`

  const tag = (label, index = 0) => `<span class="session-tag tag-${index % 3}"><i></i>${escapeHTML(label)}</span>`

  const progressRow = (label, value, glyph, key) => `
    <div class="focus-row">
      <div class="focus-icon focus-${key}">${icon(glyph, 22)}</div>
      <div class="focus-content">
        <div class="focus-heading"><strong>${label}</strong><span>${value}%</span></div>
        <div class="progress-track"><span style="width:${value}%"></span></div>
      </div>
    </div>`

  const sessionRow = (weekIndex, sessionIndex, session) => {
    const id = sid(weekIndex, sessionIndex)
    const done = Boolean(state.completed[id])
    return `
      <article class="session-row ${sessionIndex === 0 ? 'accent-coral' : 'accent-blue'} ${done ? 'is-complete' : ''}">
        <div class="session-number">0${sessionIndex + 1}</div>
        <div class="mini-tactic" aria-hidden="true">
          <span class="tactic-dot a"></span><span class="tactic-dot b"></span><span class="tactic-x">×</span><i></i>
        </div>
        <div class="session-summary">
          <div class="session-title-line"><h2>Día ${session.day} · ${escapeHTML(session.title)}</h2>${done ? `<span class="done-label">${icon('check', 14)} Realizada</span>` : ''}</div>
          <p>${escapeHTML(session.objective)}</p>
          <div class="session-meta">
            <span>${icon('clock', 17)} ${session.duration} min</span>
            <span>${icon('users', 17)} ${session.players} jugadores</span>
            <span>${escapeHTML(sessionDate(weekIndex, sessionIndex))}</span>
          </div>
          <div class="session-tags">${session.tags.map(tag).join('')}</div>
        </div>
        <div class="session-actions">
          <a class="button primary ${sessionIndex === 1 ? 'blue' : ''}" href="#session/${weekIndex}/${sessionIndex}">Abrir sesión ${icon('arrowRight', 18)}</a>
          <a class="button secondary" href="#progress">Ver progreso ${icon('chart', 17)}</a>
        </div>
      </article>`
  }

  const dashboard = () => {
    const weekIndex = clamp(state.weekIndex, 0, plan.weeks.length - 1)
    const week = plan.weeks[weekIndex]
    const previewIndex = week.sessions.findIndex((_, index) => !state.completed[sid(weekIndex, index)])
    const sessionIndex = previewIndex < 0 ? 0 : previewIndex
    const current = week.sessions[sessionIndex]
    const currentId = sid(weekIndex, sessionIndex)
    return `
      <div class="dashboard-grid">
        <section class="week-main">
          <div class="week-hero">
            <button class="square-button" data-action="previous-week" ${weekIndex === 0 ? 'disabled' : ''} aria-label="Semana anterior">${icon('chevronLeft', 25)}</button>
            <div class="week-title-wrap">
              <div class="week-title-topline">
                <h1>Semana ${weekIndex + 1} · ${escapeHTML(week.title)}</h1>
                <select class="week-select" data-action="select-week" aria-label="Ir a otra semana">
                  ${plan.weeks.map((item, index) => `<option value="${index}" ${index === weekIndex ? 'selected' : ''}>${index + 1} · ${escapeHTML(item.title)}</option>`).join('')}
                </select>
              </div>
              <div class="red-stroke" aria-hidden="true"></div>
              <p class="date-range">${escapeHTML(dateRange(weekIndex))}</p>
              <div class="team-line">${icon('users', 20)} <span>${escapeHTML(plan.team)}</span><i></i><span>${escapeHTML(week.block)}</span></div>
            </div>
            <button class="square-button" data-action="next-week" ${weekIndex === plan.weeks.length - 1 ? 'disabled' : ''} aria-label="Semana siguiente">${icon('chevronRight', 25)}</button>
          </div>
          <p class="week-intent"><strong>Intención:</strong> ${escapeHTML(week.intent)}</p>
          <div class="session-list">
            ${week.sessions.map((session, index) => sessionRow(weekIndex, index, session)).join('')}
          </div>
          <section class="today-panel">
            <div class="today-heading">
              <div><h2>La sesión de hoy</h2><p>Día ${current.day} · ${escapeHTML(current.title)} <span>·</span> ${current.duration} min</p></div>
              <a class="button secondary" href="#session/${weekIndex}/${sessionIndex}">${icon('note', 17)} Ver ficha completa</a>
            </div>
            <div class="phase-timeline">
              ${current.activities.map((activity, index) => `<div class="phase"><span class="phase-index">${index + 1}</span><div><strong>${escapeHTML(activity.phase)}</strong><b>${activity.minutes} min</b><p>${escapeHTML(activity.title)}</p></div></div>`).join('')}
            </div>
            <div class="quick-note">
              <label for="quick-note">Nota rápida de esta sesión</label>
              <div><input id="quick-note" value="${escapeHTML(state.notes[currentId] || '')}" placeholder="Algo que quieras recordar al llegar al campo…" maxlength="500"><button class="square-button small" data-action="save-quick-note" data-week="${weekIndex}" data-session="${sessionIndex}" aria-label="Guardar nota">${icon('plus', 20)}</button></div>
              <small>Se guarda solo en este dispositivo.</small>
            </div>
          </section>
        </section>
        <aside class="focus-rail">
          <div class="focus-title"><div><h2>Foco del bloque</h2><p>${escapeHTML(week.block)}</p></div>${icon('info', 20)}</div>
          <div class="focus-line" aria-hidden="true"></div>
          ${progressRow('Técnico', week.focus.technical, 'ball', 'technical')}
          ${progressRow('Táctico', week.focus.tactical, 'eye', 'tactical')}
          ${progressRow('Motor', week.focus.motor, 'person', 'motor')}
          ${progressRow('Persona', week.focus.person, 'shield', 'person')}
          <div class="observe-box">
            <span>Esta semana observa</span>
            <ul>${week.observables.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
          </div>
          <a class="focus-link" href="#progress">Registrar progreso ${icon('arrowRight', 19)}</a>
        </aside>
      </div>`
  }

  const pitchDiagram = (type) => {
    const special = {
      islands: '<circle cx="72" cy="78" r="30"/><circle cx="188" cy="78" r="30"/><circle cx="72" cy="172" r="30"/><circle cx="188" cy="172" r="30"/>',
      'four-goals': '<path d="M35 45h-20v35M225 45h20v35M35 205h-20v-35M225 205h20v-35"/>',
      lanes: '<path d="M95 25v200M165 25v200"/>',
      'two-v-one': '<path d="M45 125h170"/><path d="m205 116 10 9-10 9"/>',
      gates: '<path d="M65 70h28M167 70h28M65 180h28M167 180h28"/>',
      triangle: '<path d="m130 55-65 130h130z"/>',
      zones: '<rect x="48" y="52" width="45" height="35"/><rect x="167" y="52" width="45" height="35"/><rect x="48" y="163" width="45" height="35"/><rect x="167" y="163" width="45" height="35"/>',
    }
    return `
      <svg class="pitch-diagram diagram-${escapeHTML(type)}" viewBox="0 0 260 250" role="img" aria-label="Esquema orientativo de organización">
        <rect x="12" y="12" width="236" height="226" rx="4" class="pitch-border"/>
        <path d="M130 12v226" class="pitch-line"/><circle cx="130" cy="125" r="24" class="pitch-line"/>
        <g class="pitch-special">${special[type] || '<path d="M52 62c42 10 46 44 78 63s58 13 82 58"/><path d="m201 174 11 9-14 5"/>'}</g>
        <g class="cones"><path d="m47 45-6 16h12z"/><path d="m213 45-6 16h12z"/><path d="m47 205-6-16h12z"/><path d="m213 205-6-16h12z"/></g>
        <g class="players"><circle cx="78" cy="112" r="8"/><circle cx="105" cy="165" r="8"/><circle cx="182" cy="138" r="8"/></g>
        <g class="opponents"><circle cx="150" cy="82" r="8"/><circle cx="158" cy="180" r="8"/></g>
        <circle class="ball-dot" cx="91" cy="118" r="4"/>
      </svg>`
  }

  const activityDetail = (activity, index, isDone) => `
    <article class="activity-expanded">
      <div class="activity-visual">
        ${pitchDiagram(activity.diagram)}
        <p>Esquema orientativo · adapta distancias al grupo</p>
      </div>
      <div class="activity-info">
        <dl>
          <div><dt>Tiempo</dt><dd>${activity.minutes} min</dd></div>
          <div><dt>Organización</dt><dd>${escapeHTML(activity.setup)}</dd></div>
          <div><dt>Cómo se juega</dt><dd>${escapeHTML(activity.how)}</dd></div>
          <div><dt>Consignas</dt><dd><ul>${activity.cues.map(cue => `<li>${escapeHTML(cue)}</li>`).join('')}</ul></dd></div>
          <div><dt>Material</dt><dd>${escapeHTML(activity.material)}</dd></div>
          <div><dt>Objetivo</dt><dd>${escapeHTML(activity.objective)}</dd></div>
          <div><dt>Adaptaciones</dt><dd><span><b>Más fácil:</b> ${escapeHTML(activity.easier)}</span><span><b>Más reto:</b> ${escapeHTML(activity.harder)}</span></dd></div>
          <div class="coach-watch"><dt>${icon('eye', 17)} Mira esto</dt><dd>${escapeHTML(activity.watchFor)}</dd></div>
        </dl>
        <button class="button ${isDone ? 'success' : 'secondary'} activity-complete" data-action="complete-activity" data-index="${index}">${isDone ? `${icon('check', 17)} Hecho` : `${icon('check', 17)} Marcar bloque hecho`}</button>
      </div>
    </article>`

  const attendanceMarkup = (weekIndex, sessionIndex) => {
    const id = sid(weekIndex, sessionIndex)
    if (!state.players.length) {
      return `<div class="empty-attendance"><p>Aún no has añadido la plantilla.</p><a href="#team">Configurar equipo ${icon('arrowRight', 16)}</a></div>`
    }
    const present = state.attendance[id] || {}
    return `<div class="attendance-list">${state.players.map(player => `<button data-action="toggle-attendance" data-player="${player.id}" class="attendance-chip ${present[player.id] ? 'is-present' : ''}"><span>${escapeHTML(player.name)}</span>${present[player.id] ? icon('check', 15) : ''}</button>`).join('')}</div>`
  }

  const sessionView = (weekIndex, sessionIndex) => {
    weekIndex = clamp(Number.isFinite(weekIndex) ? weekIndex : state.weekIndex, 0, plan.weeks.length - 1)
    sessionIndex = clamp(Number.isFinite(sessionIndex) ? sessionIndex : 0, 0, 1)
    const week = plan.weeks[weekIndex]
    const session = week.sessions[sessionIndex]
    const id = sid(weekIndex, sessionIndex)
    const activityStates = state.activityDone[id] || []
    openExercise = clamp(openExercise, 0, session.activities.length - 1)
    const note = state.notes[id] || ''
    return `
      <div class="session-page" data-week="${weekIndex}" data-session="${sessionIndex}">
        <aside class="session-timeline-rail">
          <a class="back-button" href="#week">${icon('arrowLeft', 17)} Volver a la semana</a>
          <p>Día ${session.day} · ${escapeHTML(session.title)}</p>
          <ol>
            ${session.activities.map((activity, index) => `<li class="${openExercise === index ? 'is-active' : ''} ${activityStates[index] ? 'is-done' : ''}"><button data-action="open-activity" data-index="${index}"><span>${activityStates[index] ? icon('check', 15) : index + 1}</span><div><b>${activity.minutes} min</b><p>${escapeHTML(activity.title)}</p></div></button></li>`).join('')}
          </ol>
        </aside>
        <main class="session-content">
          <div class="mobile-back"><a href="#week">${icon('arrowLeft', 16)} Volver a la semana</a></div>
          <header class="session-heading">
            <div>
              <p class="session-week-label">Semana ${weekIndex + 1} · ${escapeHTML(week.title)}</p>
              <h1>Día ${session.day} · ${escapeHTML(session.title)}</h1>
              <p class="session-objective">Objetivo: ${escapeHTML(session.objective)}</p>
              <div class="session-heading-meta"><span>${icon('clock', 17)} ${session.duration} min</span><span>${icon('users', 17)} ${session.players} jugadores</span><span>${escapeHTML(sessionDate(weekIndex, sessionIndex))}</span></div>
            </div>
            <div class="session-heading-actions">
              <button class="button ${state.completed[id] ? 'success' : 'coral-outline'}" data-action="complete-session">${icon('check', 18)} ${state.completed[id] ? 'Sesión realizada' : 'Marcar realizada'}</button>
              <button class="button secondary" data-action="toggle-notes">${icon('note', 18)} Añadir nota</button>
              <button class="icon-button" data-action="print-session" aria-label="Imprimir sesión">${icon('print', 19)}</button>
            </div>
          </header>
          <div class="session-tags detail-tags">${session.tags.map(tag).join('')}<span class="life-value">Valor · ${escapeHTML(session.lifeSkill)}</span></div>
          <div class="mobile-phase-strip">
            ${session.activities.map((activity, index) => `<button class="${openExercise === index ? 'is-active' : ''}" data-action="open-activity" data-index="${index}"><span>${index + 1}</span><small>${activity.minutes} min</small></button>`).join('')}
          </div>
          <section class="plan-section">
            <div class="section-heading"><h2>Plan de la sesión</h2><p>60 minutos · 4 momentos · explicación breve, juego largo</p></div>
            <div class="activity-stack">
              ${session.activities.map((activity, index) => `
                <div class="activity-item ${openExercise === index ? 'is-open' : ''} ${activityStates[index] ? 'is-done' : ''}">
                  <button class="activity-trigger" data-action="open-activity" data-index="${index}" aria-expanded="${openExercise === index}">
                    <span class="activity-index">${activityStates[index] ? icon('check', 16) : index + 1}</span>
                    <div><b>${escapeHTML(activity.phase)}</b><strong>${escapeHTML(activity.title)}</strong></div>
                    <span class="activity-time">${activity.minutes} min</span>${icon('chevronDown', 18)}
                  </button>
                  ${activityDetail(activity, index, activityStates[index])}
                </div>`).join('')}
            </div>
          </section>
          <section class="checkout-box">
            <div class="checkout-star">✦</div><div><h2>¿Qué hemos descubierto hoy?</h2><p>${escapeHTML(session.question)}</p><small>Círculo final de 2 minutos. Escucha dos o tres voces; no busques una respuesta “correcta”.</small></div>
          </section>
        </main>
        <aside class="notes-rail ${notesOpen ? 'is-open' : ''}" aria-label="Notas y asistencia">
          <div class="notes-title"><h2>Notas del entrenador</h2><button data-action="toggle-notes" aria-label="Cerrar notas">×</button></div>
          <label for="session-note">Algo concreto que viste</label>
          <textarea id="session-note" maxlength="1000" placeholder="Ej.: el campo ancho ayudó; la próxima vez haré las islas más grandes…">${escapeHTML(note)}</textarea>
          <div class="counter"><span>${note.length}</span>/1000</div>
          <button class="button primary full" data-action="save-session-note">${icon('check', 18)} Guardar nota</button>
          <div class="attendance-section">
            <div><h3>Asistencia</h3><span>${state.players.length ? `${Object.values(state.attendance[id] || {}).filter(Boolean).length}/${state.players.length}` : 'Opcional'}</span></div>
            ${attendanceMarkup(weekIndex, sessionIndex)}
          </div>
          <div class="local-note">${icon('shield', 17)} <span>Notas y nombres permanecen en este navegador.</span></div>
        </aside>
        <button class="mobile-note-button" data-action="toggle-notes">${icon('note', 18)} ${note ? 'Editar nota' : 'Añadir nota'}</button>
      </div>`
  }

  const observationStatus = (weekIndex, observationIndex) => state.observations[`w${weekIndex}-o${observationIndex}`] || 'pending'
  const statusLabel = { pending: 'Aún no observado', emerging: 'A veces', frequent: 'Frecuente' }

  const progressView = () => {
    const blocks = [...new Set(plan.weeks.map(week => week.block))]
    return `
      <div class="content-page progress-page">
        <header class="page-intro">
          <div><h1>Progreso que se puede ver</h1><p>No son notas ni rankings. Registra tendencias del grupo y usa la evidencia para adaptar el siguiente juego.</p></div>
          <div class="legend"><span><i class="pending"></i>Sin observar</span><span><i class="emerging"></i>A veces</span><span><i class="frequent"></i>Frecuente</span></div>
        </header>
        <section class="cycle-map" aria-label="Mapa del ciclo">
          ${blocks.map((block, blockIndex) => {
            const items = plan.weeks.map((week, index) => ({ week, index })).filter(item => item.week.block === block)
            return `<div class="cycle-block block-${blockIndex}"><div class="block-header"><span>Bloque ${blockIndex + 1}</span><h2>${escapeHTML(block)}</h2></div><div class="block-weeks">${items.map(({ week, index }) => `<button data-action="progress-week" data-week="${index}"><b>${index + 1}</b><span>${escapeHTML(week.title)}</span></button>`).join('')}</div></div>`
          }).join('')}
        </section>
        <section class="observation-board">
          <div class="board-heading"><div><h2>Indicadores semanales</h2><p>Pulsa cada indicador para cambiar entre “a veces” y “frecuente”. Registra solo lo que hayas visto jugando.</p></div><span>${Object.values(state.observations).filter(value => value !== 'pending').length} observaciones</span></div>
          <div class="observation-list">
            ${plan.weeks.map((week, weekIndex) => `<article class="observation-week" id="progress-week-${weekIndex}"><div class="obs-week-label"><b>${String(weekIndex + 1).padStart(2, '0')}</b><div><span>${escapeHTML(week.block)}</span><h3>${escapeHTML(week.title)}</h3></div></div><div class="obs-items">${week.observables.map((item, observationIndex) => { const status = observationStatus(weekIndex, observationIndex); return `<button class="obs-button is-${status}" data-action="cycle-observation" data-week="${weekIndex}" data-observation="${observationIndex}"><i></i><span>${escapeHTML(item)}</span><b>${statusLabel[status]}</b></button>` }).join('')}</div></article>`).join('')}
          </div>
        </section>
        <section class="progress-principle"><div>${icon('target', 28)}</div><blockquote>“Lo importante no es que salga a la primera, sino que cada vez perciban más, decidan mejor y sigan queriendo jugar.”</blockquote><p>Usa tus notas para cambiar una sola restricción: espacio, rivales, metas o tiempo. Después vuelve a observar.</p></section>
      </div>`
  }

  const teamView = () => `
    <div class="content-page team-page">
      <header class="page-intro">
        <div><h1>El equipo, sin etiquetas</h1><p>Una lista práctica para asistencia y nombres. Los datos se guardan únicamente en este navegador.</p></div>
        <div class="privacy-stamp">${icon('shield', 21)} Datos locales</div>
      </header>
      <div class="team-layout">
        <section class="roster-section">
          <div class="roster-heading"><div><h2>Plantilla</h2><p>${state.players.length} jugadores · puedes editar cualquier nombre</p></div></div>
          <form class="add-player-form" id="add-player-form">
            <label for="new-player">Añadir jugador</label>
            <div><input id="new-player" name="player" maxlength="40" placeholder="Nombre o iniciales" autocomplete="off"><button class="button primary" type="submit">${icon('plus', 18)} Añadir</button></div>
          </form>
          <div class="player-list">
            ${state.players.length ? state.players.map((player, index) => `<div class="player-row"><span class="player-number">${String(index + 1).padStart(2, '0')}</span><input value="${escapeHTML(player.name)}" data-action="rename-player" data-player="${player.id}" aria-label="Nombre del jugador ${index + 1}" maxlength="40"><button class="icon-button danger" data-action="delete-player" data-player="${player.id}" aria-label="Eliminar ${escapeHTML(player.name)}">${icon('trash', 18)}</button></div>`).join('') : `<div class="empty-team"><div>${icon('users', 38)}</div><h3>Empieza por los nombres</h3><p>Puedes usar solo nombre o iniciales. Después aparecerán en la asistencia de cada sesión.</p></div>`}
          </div>
        </section>
        <aside class="team-values">
          <h2>Acuerdos del equipo</h2>
          <ol><li><span>1</span><p><b>Todos juegan.</b> Reparte oportunidades, posiciones y retos.</p></li><li><span>2</span><p><b>El error ayuda.</b> Preguntamos antes de corregir.</p></li><li><span>3</span><p><b>Competimos cuidando.</b> Sin empujones, burlas ni castigos.</p></li><li><span>4</span><p><b>El balón vuelve rápido.</b> Más juego, menos espera.</p></li></ol>
        </aside>
      </div>
    </div>`

  const libraryView = () => `
    <div class="content-page library-page">
      <header class="page-intro">
        <div><h1>Una metodología, no una colección</h1><p>El ciclo conecta cada semana con la anterior. Técnica, táctica, movimiento y persona progresan dentro del mismo juego.</p></div>
        <a class="button secondary" href="#week">Ir a la semana 1 ${icon('arrowRight', 18)}</a>
      </header>
      <section class="method-section">
        <div class="section-kicker"><span>01</span><h2>Principios de diseño</h2></div>
        <div class="method-list">${plan.methodology.map((item, index) => `<article><span>${String(index + 1).padStart(2, '0')}</span><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.text)}</p></div></article>`).join('')}</div>
      </section>
      <section class="session-formula">
        <div class="formula-copy"><span>02</span><h2>La forma de cada sesión</h2><p>La estructura es estable para dar seguridad; los problemas y restricciones evolucionan.</p></div>
        <div class="formula-line"><div><b>8</b><span>min</span><p>Bienvenida activa</p></div><i></i><div><b>12</b><span>min</span><p>Exploración</p></div><i></i><div><b>20</b><span>min</span><p>Reto guiado</p></div><i></i><div><b>20</b><span>min</span><p>Partido libre</p></div></div>
      </section>
      <section class="safety-section">
        <div class="section-kicker"><span>03</span><h2>Antes de pisar el campo</h2></div>
        <div class="safety-layout"><div class="safety-shield">${icon('shield', 48)}<h3>Seguro, visible, inclusivo</h3><p>La protección del menor va antes que cualquier objetivo futbolístico.</p></div><ul>${plan.safety.map(item => `<li>${icon('check', 18)}<span>${escapeHTML(item)}</span></li>`).join('')}</ul></div>
      </section>
      <section class="sources-section">
        <div class="section-kicker"><span>04</span><h2>Fuentes del enfoque</h2></div>
        <div class="sources-list">${plan.sources.map(source => `<a href="${escapeHTML(source.url)}" target="_blank" rel="noreferrer"><div><h3>${escapeHTML(source.label)}</h3><p>${escapeHTML(source.note)}</p></div>${icon('external', 19)}</a>`).join('')}</div>
      </section>
    </div>`

  const render = () => {
    const currentRoute = route()
    const active = currentRoute.view === 'session' ? 'session' : navItems.some(([id]) => id === currentRoute.view) ? currentRoute.view : 'week'
    if (active === 'week') state.weekIndex = clamp(state.weekIndex, 0, plan.weeks.length - 1)
    let content
    if (active === 'session') content = sessionView(currentRoute.week, currentRoute.session)
    else if (active === 'progress') content = progressView()
    else if (active === 'team') content = teamView()
    else if (active === 'library') content = libraryView()
    else content = dashboard()

    document.getElementById('app').innerHTML = `${appHeader(active)}<div class="app-body view-${active}">${content}</div>${mobileNav(active)}<div id="toast" class="toast" role="status" aria-live="polite"></div>`
    document.body.classList.toggle('notes-open', notesOpen && active === 'session')
    if (active !== 'session') notesOpen = false
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const showToast = (message) => {
    const toast = document.getElementById('toast')
    if (!toast) return
    toast.innerHTML = `${icon('check', 17)} ${escapeHTML(message)}`
    toast.classList.add('is-visible')
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400)
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]')
    if (!target) return
    const action = target.dataset.action
    const currentRoute = route()
    if (action === 'previous-week' || action === 'next-week') {
      state.weekIndex = clamp(state.weekIndex + (action === 'next-week' ? 1 : -1), 0, plan.weeks.length - 1)
      saveState(); render()
    }
    if (action === 'save-quick-note') {
      const id = sid(Number(target.dataset.week), Number(target.dataset.session))
      state.notes[id] = document.getElementById('quick-note').value.trim()
      saveState(); showToast('Nota guardada')
    }
    if (action === 'open-activity') {
      openExercise = Number(target.dataset.index)
      render()
    }
    if (action === 'complete-activity') {
      const id = sid(currentRoute.week, currentRoute.session)
      const done = [...(state.activityDone[id] || [])]
      done[Number(target.dataset.index)] = !done[Number(target.dataset.index)]
      state.activityDone[id] = done
      saveState(); render(); showToast(done[Number(target.dataset.index)] ? 'Bloque marcado' : 'Bloque reabierto')
    }
    if (action === 'complete-session') {
      const id = sid(currentRoute.week, currentRoute.session)
      state.completed[id] = !state.completed[id]
      saveState(); render(); showToast(state.completed[id] ? 'Sesión marcada como realizada' : 'Sesión reabierta')
    }
    if (action === 'toggle-notes') {
      notesOpen = !notesOpen
      render()
      if (notesOpen) setTimeout(() => document.getElementById('session-note')?.focus(), 20)
    }
    if (action === 'save-session-note') {
      const id = sid(currentRoute.week, currentRoute.session)
      state.notes[id] = document.getElementById('session-note').value.trim()
      saveState(); render(); showToast('Nota guardada correctamente')
    }
    if (action === 'toggle-attendance') {
      const id = sid(currentRoute.week, currentRoute.session)
      state.attendance[id] ||= {}
      state.attendance[id][target.dataset.player] = !state.attendance[id][target.dataset.player]
      saveState(); render()
    }
    if (action === 'print-session') window.print()
    if (action === 'cycle-observation') {
      const key = `w${target.dataset.week}-o${target.dataset.observation}`
      const current = state.observations[key] || 'pending'
      state.observations[key] = statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length]
      saveState(); render(); showToast(`Indicador: ${statusLabel[state.observations[key]]}`)
    }
    if (action === 'progress-week') {
      const index = Number(target.dataset.week)
      document.getElementById(`progress-week-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    if (action === 'delete-player') {
      state.players = state.players.filter(player => player.id !== target.dataset.player)
      saveState(); render(); showToast('Jugador eliminado del dispositivo')
    }
  })

  document.addEventListener('change', (event) => {
    const target = event.target
    if (target.dataset.action === 'select-week') {
      state.weekIndex = clamp(Number(target.value), 0, plan.weeks.length - 1)
      saveState(); render()
    }
    if (target.dataset.action === 'rename-player') {
      const player = state.players.find(item => item.id === target.dataset.player)
      if (player && target.value.trim()) player.name = target.value.trim()
      saveState(); render(); showToast('Nombre actualizado')
    }
  })

  document.addEventListener('input', (event) => {
    if (event.target.id === 'session-note') {
      const counter = document.querySelector('.counter span')
      if (counter) counter.textContent = event.target.value.length
    }
  })

  document.addEventListener('submit', (event) => {
    if (event.target.id !== 'add-player-form') return
    event.preventDefault()
    const input = event.target.elements.player
    const name = input.value.trim()
    if (!name) return input.focus()
    state.players.push({ id: `p-${Date.now().toString(36)}`, name })
    saveState(); render(); showToast(`${name} añadido al equipo`)
  })

  window.addEventListener('hashchange', () => { openExercise = 0; notesOpen = false; render() })
  render()
})()
