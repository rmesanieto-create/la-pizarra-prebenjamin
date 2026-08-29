/* Escenas de campo específicas para los distintos formatos de tarea. */
(() => {
  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

  const P = (team, x, y, label = '') => ({ team, x, y, label })
  const B = (x, y) => ({ x, y })
  const C = (x, y, color = 'yellow') => ({ x, y, color })
  const G = (x, y, side = 'right', color = 'navy') => ({ x, y, side, color })
  const Gate = (x, y, direction = 'vertical', color = 'yellow', label = '') => ({ x, y, direction, color, label })
  const Z = (x, y, width, height, label = '', tone = 'blue') => ({ x, y, width, height, label, tone })
  const A = (d, tone = 'coral', label = '') => ({ d, tone, label })
  const L = (x, y, text, tone = 'navy') => ({ x, y, text, tone })
  const Line = (x1, y1, x2, y2, dashed = true) => ({ x1, y1, x2, y2, dashed })

  const ring = (team, cx, cy, radius, count, withBall = false) => {
    const players = []
    const balls = []
    for (let index = 0; index < count; index += 1) {
      const angle = (-Math.PI / 2) + (index * Math.PI * 2 / count)
      const x = Math.round(cx + Math.cos(angle) * radius)
      const y = Math.round(cy + Math.sin(angle) * radius)
      players.push(P(team, x, y, `${index + 1}`))
      if (withBall) balls.push(B(x + 9, y + 7))
    }
    return { players, balls }
  }

  const welcomeRing = ring('blue', 170, 118, 72, 8, true)

  const scenes = {
    circle: {
      pitch: 'area', ...welcomeRing,
      cones: [C(75, 45), C(265, 45), C(75, 191), C(265, 191)],
      arrows: [A('M170 46a72 72 0 0 1 69 52', 'blue'), A('M170 190a72 72 0 0 1-69-52', 'blue')],
      labels: [L(170, 121, 'Todos activos', 'muted')],
    },
    islands: {
      pitch: 'area',
      zones: [Z(36, 35, 78, 60, 'Isla 1', 'blue'), Z(226, 35, 78, 60, 'Isla 2', 'yellow'), Z(36, 141, 78, 60, 'Isla 3', 'coral'), Z(226, 141, 78, 60, 'Isla 4', 'green')],
      players: [P('blue', 54, 64, '1'), P('blue', 75, 72, '2'), P('blue', 96, 64, '3'), P('blue', 244, 64, '4'), P('blue', 265, 72, '5'), P('blue', 286, 64, '6'), P('blue', 54, 170, '7'), P('blue', 75, 178, '8'), P('blue', 96, 170, '9'), P('blue', 244, 170, '10'), P('blue', 265, 178, '11'), P('blue', 286, 170, '12')],
      balls: [B(62, 72), B(83, 80), B(104, 72), B(252, 72), B(273, 80), B(294, 72), B(62, 178), B(83, 186), B(104, 178), B(252, 178), B(273, 186), B(294, 178)],
      arrows: [A('M108 70C145 52 188 52 228 70', 'coral'), A('M232 164C194 188 150 188 110 166', 'coral')],
    },
    treasure: {
      pitch: 'area',
      zones: [Z(28, 36, 42, 164, 'Salida', 'blue'), Z(278, 36, 34, 164, 'Tesoros', 'yellow')],
      players: [P('blue', 48, 68, 'A1'), P('blue', 48, 103, 'A2'), P('blue', 48, 138, 'A3'), P('blue', 48, 173, 'A4'), P('coral', 168, 118, 'D')],
      balls: [B(58, 76), B(58, 111), B(58, 146), B(58, 181)],
      cones: [C(291, 56), C(299, 84), C(289, 112), C(299, 140), C(290, 169), C(301, 190)],
      arrows: [A('M64 69C118 54 122 85 156 97', 'blue'), A('M64 140C119 160 149 151 194 130', 'blue'), A('M201 126C233 121 253 112 282 106', 'coral')],
      labels: [L(166, 91, 'Guardián', 'coral')],
    },
    match: {
      pitch: 'full',
      goals: [G(18, 86, 'left'), G(18, 150, 'left'), G(322, 86, 'right'), G(322, 150, 'right')],
      players: [P('blue', 88, 76, '1'), P('blue', 92, 155, '2'), P('blue', 145, 118, '3'), P('coral', 195, 83, '1'), P('coral', 198, 154, '2'), P('coral', 252, 118, '3')],
      balls: [B(158, 120)],
      arrows: [A('M145 110C170 91 185 86 202 86', 'blue'), A('M151 124C182 145 210 151 248 128', 'blue')],
      labels: [L(56, 31, '3v3 · reinicio rápido', 'muted')],
    },
    gates: {
      pitch: 'area',
      gates: [Gate(88, 57, 'vertical', 'blue', '1'), Gate(171, 48, 'horizontal', 'yellow', '2'), Gate(255, 67, 'vertical', 'coral', '3'), Gate(93, 164, 'horizontal', 'coral', '4'), Gate(183, 177, 'vertical', 'blue', '5'), Gate(269, 157, 'horizontal', 'yellow', '6')],
      players: [P('blue', 56, 112, '1'), P('blue', 143, 108, '2'), P('blue', 228, 118, '3'), P('blue', 293, 110, '4')],
      balls: [B(65, 120), B(152, 116), B(237, 126), B(302, 118)],
      arrows: [A('M65 108C72 82 76 69 87 59', 'blue'), A('M153 105C164 81 171 70 171 55', 'blue'), A('M238 115C253 96 256 85 255 71', 'blue'), A('M294 118C284 139 277 149 270 154', 'blue')],
    },
    'four-goals': {
      pitch: 'full',
      goals: [G(18, 62, 'left'), G(18, 174, 'left'), G(322, 62, 'right'), G(322, 174, 'right')],
      players: [P('blue', 92, 76, '1'), P('blue', 96, 158, '2'), P('blue', 148, 118, '3'), P('coral', 192, 78, '1'), P('coral', 198, 158, '2'), P('coral', 252, 118, '3')],
      balls: [B(158, 122)],
      arrows: [A('M154 112C193 82 242 76 307 64', 'blue'), A('M155 126C196 155 250 168 307 174', 'blue')],
      labels: [L(267, 31, 'Dos metas para elegir', 'muted')],
    },
    duel: {
      pitch: 'area', zones: [Z(80, 42, 180, 152, '1v1 · 30 s', 'yellow')],
      players: [P('blue', 130, 118, 'A'), P('coral', 195, 118, 'D')], balls: [B(140, 126)],
      arrows: [A('M139 110C155 86 184 86 198 104', 'blue'), A('M187 127C170 150 144 151 129 134', 'coral')],
      labels: [L(168, 58, 'Proteger y escapar', 'muted')],
    },
    lanes: {
      pitch: 'area', lines: [Line(125, 28, 125, 208, false), Line(215, 28, 215, 208, false)],
      goals: [G(76, 28, 'top'), G(170, 28, 'top'), G(264, 28, 'top')],
      players: [P('blue', 77, 183, 'A'), P('coral', 77, 113, 'D'), P('blue', 170, 183, 'A'), P('coral', 170, 113, 'D'), P('blue', 263, 183, 'A'), P('coral', 263, 113, 'D')],
      balls: [B(87, 191), B(180, 191), B(273, 191)],
      arrows: [A('M78 174C55 143 59 119 74 102', 'blue'), A('M170 174C188 145 189 118 175 99', 'blue'), A('M263 174C241 144 244 116 258 98', 'blue')],
      labels: [L(76, 220, 'Pasillo 1'), L(170, 220, 'Pasillo 2'), L(264, 220, 'Pasillo 3')],
    },
    triangle: {
      pitch: 'area',
      players: [P('blue', 170, 48, '1'), P('blue', 78, 184, '2'), P('blue', 262, 184, '3')], balls: [B(180, 56)],
      arrows: [A('M165 59L87 173', 'blue'), A('M91 184L249 184', 'blue'), A('M258 173L179 59', 'blue')],
      cones: [C(170, 34), C(65, 198), C(275, 198)], labels: [L(170, 118, 'Pasa y ocupa', 'muted')],
    },
    'moving-goal': {
      pitch: 'full',
      players: [P('blue', 105, 80, '1'), P('blue', 112, 155, '2'), P('blue', 160, 118, '3'), P('coral', 205, 78, '1'), P('coral', 210, 158, '2'), P('coral', 254, 118, '3'), P('neutral', 302, 88, 'N1'), P('neutral', 302, 150, 'N2')],
      balls: [B(173, 122)], gates: [Gate(301, 119, 'horizontal', 'yellow', 'Meta móvil')],
      arrows: [A('M174 116C215 96 258 97 292 112', 'blue'), A('M300 82L300 55', 'yellow'), A('M300 155L300 184', 'yellow')],
    },
    'two-v-one': {
      pitch: 'area', goals: [G(310, 118, 'right')],
      players: [P('blue', 64, 82, 'A1'), P('blue', 64, 156, 'A2'), P('coral', 182, 118, 'D')], balls: [B(74, 90)],
      arrows: [A('M75 82C119 78 151 91 171 108', 'blue'), A('M76 151C130 140 143 127 171 120', 'blue'), A('M82 89C128 108 166 128 245 119', 'coral')],
      zones: [Z(275, 69, 30, 98, 'Meta', 'green')], labels: [L(111, 47, 'Dos caminos', 'muted')],
    },
    goals: {
      pitch: 'area',
      goals: [G(64, 40, 'top'), G(170, 40, 'top'), G(276, 40, 'top'), G(64, 196, 'bottom'), G(170, 196, 'bottom'), G(276, 196, 'bottom')],
      players: [P('blue', 75, 116, '1'), P('blue', 135, 145, '2'), P('blue', 204, 93, '3'), P('blue', 270, 142, '4')], balls: [B(85, 124), B(145, 153), B(214, 101), B(280, 150)],
      arrows: [A('M78 108C75 81 68 65 65 48', 'blue'), A('M138 136C151 102 163 75 168 48', 'blue'), A('M207 101C227 130 252 161 272 187', 'blue')],
    },
    'duel-goals': {
      pitch: 'area', goals: [G(26, 118, 'left'), G(314, 118, 'right')],
      players: [P('blue', 118, 118, 'A'), P('coral', 196, 118, 'D')], balls: [B(128, 126)],
      arrows: [A('M128 109C159 82 192 86 207 103', 'blue'), A('M128 128C170 156 221 151 295 126', 'coral')], labels: [L(170, 48, 'Ataca · roba · contraataca', 'muted')],
    },
    'run-pass': {
      pitch: 'area', goals: [G(300, 118, 'right')],
      players: [P('blue', 55, 78, 'A1'), P('blue', 55, 158, 'A2')], balls: [B(65, 86)],
      arrows: [A('M67 79C120 76 168 83 222 104', 'blue', 'Pase'), A('M57 148C106 132 147 116 211 108', 'coral', 'Carrera'), A('M221 106L286 116', 'blue', 'Remate')],
      labels: [L(96, 47, 'Líneas distintas', 'muted')],
    },
    'two-goals': {
      pitch: 'area', goals: [G(310, 78, 'right'), G(310, 158, 'right')],
      players: [P('blue', 85, 82, 'A1'), P('blue', 88, 154, 'A2'), P('coral', 184, 88, 'D1'), P('coral', 184, 150, 'D2')], balls: [B(96, 90)],
      arrows: [A('M96 82C134 77 157 78 174 84', 'blue'), A('M99 150C149 138 210 132 294 154', 'blue'), A('M108 87C174 112 236 99 294 82', 'coral')],
      labels: [L(260, 48, 'Elegir meta', 'muted')],
    },
    'defend-gate': {
      pitch: 'area', gates: [Gate(285, 118, 'horizontal', 'yellow', 'Puerta')],
      players: [P('blue', 70, 118, 'A'), P('coral', 190, 118, 'D')], balls: [B(80, 126)],
      arrows: [A('M80 110C126 93 160 95 181 108', 'blue'), A('M199 112C225 111 251 114 277 117', 'coral')],
      zones: [Z(260, 75, 48, 86, 'Proteger', 'yellow')], labels: [L(180, 54, 'Llegar · frenar · orientar', 'muted')],
    },
    rondo: {
      pitch: 'area', zones: [Z(70, 46, 200, 144, '3v1', 'blue')],
      players: [P('blue', 86, 62, '1'), P('blue', 254, 62, '2'), P('blue', 170, 174, '3'), P('coral', 170, 112, 'D')], balls: [B(96, 69)],
      gates: [Gate(283, 118, 'horizontal', 'yellow', 'Salida')], arrows: [A('M98 63L242 63', 'blue'), A('M247 72L178 164', 'blue'), A('M162 165L94 72', 'blue'), A('M182 113L274 118', 'coral')],
    },
    'safety-zone': {
      pitch: 'full', zones: [Z(22, 72, 42, 92, 'Seguridad', 'yellow'), Z(276, 72, 42, 92, 'Seguridad', 'yellow')],
      goals: [G(18, 118, 'left'), G(322, 118, 'right')],
      players: [P('blue', 88, 80, '1'), P('blue', 112, 156, '2'), P('blue', 153, 116, '3'), P('coral', 190, 82, '1'), P('coral', 220, 154, '2'), P('coral', 257, 116, '3')], balls: [B(164, 123)],
      arrows: [A('M164 113C192 97 220 99 247 110', 'blue'), A('M218 145C236 135 251 126 273 121', 'coral')],
    },
    'two-gates': {
      pitch: 'area', gates: [Gate(67, 118, 'horizontal', 'blue', 'Meta A'), Gate(273, 118, 'horizontal', 'coral', 'Meta B')],
      players: [P('blue', 158, 118, 'A'), P('coral', 190, 118, 'D')], balls: [B(168, 126)],
      arrows: [A('M158 108C133 78 93 86 74 109', 'blue'), A('M163 128C196 154 238 146 266 127', 'coral')], labels: [L(170, 53, 'Engaña y acelera', 'muted')],
    },
    joker: {
      pitch: 'area', zones: [Z(65, 42, 210, 152, '1v1 + comodín', 'blue')],
      players: [P('blue', 113, 118, 'A'), P('coral', 188, 118, 'D'), P('neutral', 262, 118, 'C')], balls: [B(123, 126)],
      arrows: [A('M124 112C161 91 194 94 250 111', 'blue'), A('M251 127C207 152 159 148 124 131', 'yellow')], labels: [L(260, 82, 'Comodín', 'yellow')],
    },
    'wide-zones': {
      pitch: 'full', zones: [Z(22, 24, 54, 188, 'Zona 1v1', 'yellow'), Z(264, 24, 54, 188, 'Zona 1v1', 'yellow')],
      goals: [G(18, 118, 'left'), G(322, 118, 'right')],
      players: [P('blue', 55, 85, '1'), P('blue', 132, 154, '2'), P('blue', 153, 91, '3'), P('coral', 286, 146, '1'), P('coral', 210, 82, '2'), P('coral', 194, 151, '3')], balls: [B(65, 93)],
      arrows: [A('M66 86C110 69 151 75 184 94', 'blue'), A('M199 146C236 160 261 158 278 149', 'coral')],
    },
    waves: {
      pitch: 'full', goals: [G(322, 118, 'right'), G(18, 118, 'left')],
      players: [P('blue', 62, 80, 'A1'), P('blue', 62, 154, 'A2'), P('coral', 178, 118, 'D'), P('coral', 288, 62, 'S1'), P('coral', 288, 174, 'S2')], balls: [B(72, 88), B(297, 70), B(297, 182)],
      arrows: [A('M73 80C119 76 147 90 168 108', 'blue'), A('M73 150C123 141 146 129 169 119', 'blue'), A('M181 126C219 146 254 146 306 126', 'coral')],
      labels: [L(282, 43, 'Siguiente ola', 'muted')],
    },
    window: {
      pitch: 'area',
      players: [P('blue', 75, 118, 'P'), P('blue', 266, 85, 'A'), P('coral', 170, 118, 'D')], balls: [B(85, 126)],
      gates: [Gate(207, 105, 'horizontal', 'yellow', 'Ventana')], arrows: [A('M85 116C126 92 165 91 199 102', 'blue'), A('M217 102L256 88', 'blue'), A('M257 96C239 130 222 148 194 165', 'coral')],
      labels: [L(259, 58, 'Apoyo se mueve', 'muted')],
    },
    'triangle-game': {
      pitch: 'area', goals: [G(30, 118, 'left'), G(310, 118, 'right')],
      players: [P('blue', 105, 82, '1'), P('blue', 105, 154, '2'), P('coral', 225, 82, '1'), P('coral', 225, 154, '2'), P('neutral', 170, 118, 'C')], balls: [B(116, 90)],
      arrows: [A('M116 84L163 112', 'blue'), A('M177 113L216 87', 'yellow'), A('M176 125L216 150', 'yellow')], labels: [L(170, 91, 'Comodín', 'yellow')],
    },
    'four-gates': {
      pitch: 'area', gates: [Gate(80, 45, 'vertical', 'blue', '1'), Gate(260, 45, 'vertical', 'yellow', '2'), Gate(80, 191, 'vertical', 'coral', '3'), Gate(260, 191, 'vertical', 'green', '4')],
      players: [P('blue', 150, 118, 'A'), P('coral', 191, 118, 'D')], balls: [B(160, 126)],
      arrows: [A('M150 107C123 78 101 60 84 50', 'blue'), A('M151 129C123 156 101 177 84 187', 'blue'), A('M194 108C221 80 242 61 256 50', 'coral'), A('M194 129C221 155 241 176 256 187', 'coral')],
    },
    'three-teams': {
      pitch: 'full', goals: [G(18, 118, 'left'), G(322, 118, 'right')],
      players: [P('blue', 103, 82, '1'), P('blue', 112, 155, '2'), P('blue', 151, 118, '3'), P('coral', 190, 82, '1'), P('coral', 218, 154, '2'), P('coral', 252, 118, '3'), P('neutral', 75, 30, 'E1'), P('neutral', 170, 30, 'E2'), P('neutral', 265, 30, 'E3')],
      balls: [B(163, 124), B(85, 37), B(180, 37), B(275, 37)], arrows: [A('M75 39C95 50 109 58 123 68', 'yellow'), A('M170 40L170 70', 'yellow'), A('M265 40C250 52 239 60 229 70', 'yellow')], labels: [L(170, 55, 'Equipo exterior entra', 'muted')],
    },
    'build-out': {
      pitch: 'half', goals: [G(30, 118, 'left')], zones: [Z(30, 52, 88, 132, 'Inicio', 'blue'), Z(118, 52, 88, 132, 'Progresión', 'yellow')],
      players: [P('blue', 53, 118, 'P'), P('blue', 98, 78, '1'), P('blue', 98, 158, '2'), P('blue', 168, 118, '3'), P('coral', 145, 82, 'D1'), P('coral', 145, 154, 'D2')], balls: [B(63, 126)],
      gates: [Gate(245, 118, 'horizontal', 'green', 'Salida')], arrows: [A('M64 116L91 83', 'blue'), A('M108 82C127 91 143 102 159 112', 'blue'), A('M178 118L236 118', 'coral')], labels: [L(80, 43, 'Abrir el campo', 'muted')],
    },
    restart: {
      pitch: 'full', goals: [G(18, 118, 'left'), G(322, 118, 'right')],
      players: [P('blue', 75, 45, 'S'), P('blue', 108, 92, '1'), P('blue', 118, 160, '2'), P('coral', 176, 86, '1'), P('coral', 184, 154, '2'), P('coral', 237, 116, '3')], balls: [B(75, 33)],
      arrows: [A('M82 45C98 55 108 67 112 82', 'blue'), A('M83 46C115 62 143 73 166 83', 'coral'), A('M118 96C143 111 162 126 178 145', 'blue')], labels: [L(103, 27, 'Saque de banda', 'muted')],
    },
    corner: {
      pitch: 'half', goals: [G(310, 118, 'right')],
      players: [P('blue', 302, 205, 'S'), P('blue', 242, 102, '1'), P('blue', 260, 146, '2'), P('coral', 275, 91, 'D1'), P('coral', 286, 134, 'D2')], balls: [B(310, 212)],
      arrows: [A('M302 198C286 167 268 139 250 111', 'blue'), A('M247 96C228 79 210 71 190 70', 'coral'), A('M260 138C242 130 228 124 212 118', 'blue')], zones: [Z(226, 66, 78, 104, 'Zona de remate', 'yellow')],
    },
    diamond: {
      pitch: 'area',
      players: [P('blue', 170, 45, '1'), P('blue', 82, 118, '2'), P('blue', 170, 191, '3'), P('blue', 258, 118, '4')], balls: [B(180, 53)],
      arrows: [A('M165 56L91 110', 'blue'), A('M92 126L162 181', 'blue'), A('M178 181L248 126', 'blue'), A('M249 110L179 55', 'blue')], labels: [L(170, 118, 'Pasa y cambia de vértice', 'muted')],
    },
    'end-zone': {
      pitch: 'area', zones: [Z(25, 32, 44, 172, 'Zona final', 'coral'), Z(271, 32, 44, 172, 'Zona final', 'blue')],
      players: [P('blue', 96, 78, '1'), P('blue', 108, 156, '2'), P('blue', 157, 118, '3'), P('coral', 190, 80, '1'), P('coral', 222, 154, '2'), P('coral', 247, 118, '3')], balls: [B(168, 124)],
      arrows: [A('M169 115C199 100 224 99 262 113', 'blue'), A('M158 128C127 146 99 154 72 158', 'coral')],
    },
    stations: {
      pitch: 'area', lines: [Line(125, 30, 125, 205, false), Line(215, 30, 215, 205, false)],
      zones: [Z(30, 38, 85, 158, '1 · Conducir', 'blue'), Z(128, 38, 84, 158, '2 · Pasar', 'yellow'), Z(225, 38, 85, 158, '3 · Finalizar', 'coral')],
      players: [P('blue', 73, 126, '1'), P('blue', 150, 100, '2'), P('blue', 191, 146, '3'), P('blue', 255, 132, '4')], balls: [B(83, 134), B(160, 108), B(201, 154), B(265, 140)],
      gates: [Gate(73, 72, 'horizontal', 'blue'), Gate(170, 72, 'vertical', 'yellow')], goals: [G(273, 60, 'top')], arrows: [A('M73 118L73 79', 'blue'), A('M159 104L184 137', 'yellow'), A('M258 122L270 70', 'coral')],
    },
    lab: {
      pitch: 'area',
      zones: [Z(34, 36, 82, 70, 'Giro', 'blue'), Z(129, 36, 82, 70, 'Pase', 'yellow'), Z(224, 36, 82, 70, '1v1', 'coral'), Z(82, 132, 82, 70, 'Tiro', 'green'), Z(177, 132, 82, 70, 'Reto libre', 'blue')],
      players: [P('blue', 75, 72, '1'), P('blue', 151, 73, '2'), P('blue', 190, 73, '3'), P('blue', 246, 72, 'A'), P('coral', 284, 72, 'D'), P('blue', 108, 165, '4'), P('blue', 218, 165, '5')],
      balls: [B(84, 80), B(161, 81), B(255, 80), B(118, 173), B(228, 173)],
    },
    festival: {
      pitch: 'area', lines: [Line(170, 25, 170, 211, false), Line(24, 118, 316, 118, false)],
      zones: [Z(30, 32, 132, 78, 'Campo 1 · 2v2', 'blue'), Z(178, 32, 132, 78, 'Campo 2 · 3v3', 'yellow'), Z(30, 126, 132, 78, 'Campo 3 · 1v1', 'coral'), Z(178, 126, 132, 78, 'Campo 4 · reto', 'green')],
      players: [P('blue', 65, 70, '1'), P('blue', 102, 82, '2'), P('coral', 130, 65, '1'), P('blue', 203, 70, '1'), P('coral', 258, 78, '1'), P('blue', 70, 165, 'A'), P('coral', 127, 165, 'D'), P('blue', 210, 163, '1'), P('blue', 270, 166, '2')],
      balls: [B(112, 79), B(229, 80), B(80, 173), B(245, 171)], labels: [L(170, 228, 'Rotación cada 4 minutos', 'muted')],
    },
    zones: {
      pitch: 'area', zones: [Z(30, 34, 78, 62, 'Zona A', 'blue'), Z(232, 34, 78, 62, 'Zona B', 'yellow'), Z(30, 140, 78, 62, 'Zona C', 'coral'), Z(232, 140, 78, 62, 'Zona D', 'green')],
      players: [P('blue', 150, 92, '1'), P('blue', 188, 145, '2'), P('coral', 151, 157, 'D')], balls: [B(160, 100)], arrows: [A('M160 88C128 66 111 62 100 62', 'blue'), A('M194 146C218 160 232 170 246 176', 'coral')],
    },
  }

  const aliases = {
    'two-goals': 'two-goals', 'two-gates': 'two-gates', 'four-gates': 'four-gates', 'four-goals': 'four-goals',
  }

  const tone = (name) => ({
    blue: '#2262dc', coral: '#ff5148', yellow: '#f4bf20', green: '#28a971', navy: '#071d49', muted: '#6d7890',
  }[name] || '#071d49')

  const renderPitch = (kind = 'area') => {
    const middle = kind === 'full' ? '<path d="M170 18v200"/><circle cx="170" cy="118" r="26"/><circle cx="170" cy="118" r="2" class="field-fill"/>' : ''
    const boxes = kind === 'full' ? '<path d="M18 72h36v92H18M322 72h-36v92h36"/><path d="M18 92h17v52H18M322 92h-17v52h17"/>' : ''
    const half = kind === 'half' ? '<path d="M170 18v200"/><path d="M322 72h-42v92h42"/><path d="M322 92h-20v52h20"/>' : ''
    return `<g class="field-grass"><rect x="18" y="18" width="304" height="200" rx="6"/>${[0, 1, 2, 3, 4, 5].map(index => `<rect x="${18 + index * 50.7}" y="18" width="50.7" height="200" class="grass-stripe ${index % 2 ? 'is-alt' : ''}"/>`).join('')}</g><g class="field-markings"><rect x="18" y="18" width="304" height="200" rx="6"/>${middle}${boxes}${half}</g>`
  }

  const renderZone = (item) => `<g class="diagram-zone zone-${esc(item.tone)}"><rect x="${item.x}" y="${item.y}" width="${item.width}" height="${item.height}" rx="7"/><text x="${item.x + item.width / 2}" y="${item.y + 15}" text-anchor="middle">${esc(item.label)}</text></g>`
  const renderLine = (item) => `<line class="diagram-boundary ${item.dashed ? 'is-dashed' : ''}" x1="${item.x1}" y1="${item.y1}" x2="${item.x2}" y2="${item.y2}"/>`
  const renderArrow = (item) => `<g class="diagram-route route-${esc(item.tone)}"><path d="${item.d}" marker-end="url(#arrow-${esc(item.tone)})"/>${item.label ? `<text x="170" y="234" text-anchor="middle">${esc(item.label)}</text>` : ''}</g>`
  const renderCone = (item) => `<path class="diagram-cone cone-${esc(item.color)}" d="M${item.x} ${item.y - 7}l-6 14h12z"/>`
  const renderGate = (item) => {
    const horizontal = item.direction === 'horizontal'
    const points = horizontal
      ? `${renderCone(C(item.x - 13, item.y, item.color))}${renderCone(C(item.x + 13, item.y, item.color))}`
      : `${renderCone(C(item.x, item.y - 13, item.color))}${renderCone(C(item.x, item.y + 13, item.color))}`
    return `<g class="diagram-gate">${points}${item.label ? `<text x="${item.x}" y="${item.y - (horizontal ? 12 : 22)}" text-anchor="middle">${esc(item.label)}</text>` : ''}</g>`
  }
  const renderGoal = (item) => {
    const vertical = item.side === 'left' || item.side === 'right'
    const width = vertical ? 10 : 38
    const height = vertical ? 38 : 10
    const x = item.x - width / 2
    const y = item.y - height / 2
    return `<g class="diagram-goal goal-${esc(item.color)}"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="2"/><path d="M${x + 2} ${y + 2}l${width - 4} ${height - 4}M${x + width - 2} ${y + 2}l-${width - 4} ${height - 4}"/></g>`
  }
  const renderPlayer = (item) => `<g class="diagram-player player-${esc(item.team)}" transform="translate(${item.x} ${item.y})"><circle r="10"/><circle r="13" class="player-halo"/><text text-anchor="middle" y="3.5">${esc(item.label)}</text></g>`
  const renderBall = (item) => `<g class="diagram-ball" transform="translate(${item.x} ${item.y})"><circle r="4.5"/><path d="m-2-1 2-2 2 2-1 2h-2z"/></g>`
  const renderLabel = (item) => `<text class="diagram-label label-${esc(item.tone)}" x="${item.x}" y="${item.y}" text-anchor="middle">${esc(item.text)}</text>`

  window.renderPitchDiagram = (activity) => {
    const key = aliases[activity.diagram] || activity.diagram
    const scene = scenes[key] || scenes.match
    return `<svg class="pitch-diagram diagram-${esc(key)}" viewBox="0 0 340 246" role="img" aria-label="Montaje de ${esc(activity.title)}">
      <defs>
        ${['blue', 'coral', 'yellow', 'green', 'navy'].map(name => `<marker id="arrow-${name}" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7z" fill="${tone(name)}"/></marker>`).join('')}
      </defs>
      ${renderPitch(scene.pitch)}
      ${(scene.zones || []).map(renderZone).join('')}
      ${(scene.lines || []).map(renderLine).join('')}
      ${(scene.arrows || []).map(renderArrow).join('')}
      ${(scene.goals || []).map(renderGoal).join('')}
      ${(scene.gates || []).map(renderGate).join('')}
      ${(scene.cones || []).map(renderCone).join('')}
      ${(scene.players || []).map(renderPlayer).join('')}
      ${(scene.balls || []).map(renderBall).join('')}
      ${(scene.labels || []).map(renderLabel).join('')}
    </svg>`
  }
})()
