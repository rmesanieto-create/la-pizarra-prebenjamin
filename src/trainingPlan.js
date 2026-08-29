/* Plan de 12 semanas. Los juegos se describen de forma declarativa para que la
   interfaz pueda presentar el mismo contenido en escritorio, móvil e impresión. */
(() => {
  const sentenceSteps = (text) => (text.match(/[^.!?]+[.!?]?/g) || [text])
    .map(sentence => sentence.trim())
    .filter(Boolean)

  const rotationGuide = (activity) => {
    const context = `${activity.title} ${activity.setup} ${activity.how}`.toLowerCase()
    if (activity.phase === 'Bienvenida activa') return 'Todos participan a la vez. Entre rondas, cambia la dirección de desplazamiento o el punto de inicio; si trabajan por parejas, conserva la pareja y alterna únicamente quién propone la acción.'
    if (/1v1|duelo|pareja|parejas/.test(context)) return 'Cambia atacante y defensor después de cada acción. Tras dos repeticiones, cambia también de pareja o de pasillo para ofrecer un problema nuevo.'
    if (/2v1|dos contra uno|tríos|trio/.test(context)) return 'Mantén grupos de tres: cada niño realiza dos acciones en cada rol antes de rotar. Evita que el mismo jugador defienda siempre.'
    if (/2v2|3v3|4v4|partido|equipos/.test(context)) return 'Juega series de 3–4 minutos. Entre series, cambia rivales, sentido de ataque o comodín y deja 30–40 segundos para beber y responder una pregunta.'
    if (/estaciones|circuito|festival/.test(context)) return 'Organiza una rotación visible y siempre en el mismo sentido. Cambia de estación cada 3–4 minutos, antes de que baje la atención.'
    if (/rondo|comodín/.test(context)) return 'Rota el rol interior o de comodín por tiempo, no solo cuando hay error, para que todos vivan todas las funciones.'
    return 'Mantén a todos activos y cambia punto de inicio, dirección o compañero cada 2–3 minutos para evitar esperas y repeticiones mecánicas.'
  }

  const restartGuide = (activity) => {
    const context = `${activity.phase} ${activity.title} ${activity.how}`.toLowerCase()
    if (/partido|3v3|2v2|4v4/.test(context)) return 'Coloca 4–6 balones junto al entrenador o detrás de las metas. Si el balón sale, introduce otro en menos de 8 segundos sin corregir durante la acción.'
    if (/1v1|duelo|pasillo/.test(context)) return 'Limita cada acción a 15–20 segundos. Si no hay solución, termina con una señal clara, devuelve un balón nuevo y cambia los roles.'
    if (/2v1|dos contra uno|ola/.test(context)) return 'Deja un balón preparado en cada salida. La siguiente acción comienza cuando los tres jugadores anteriores han abandonado el espacio por fuera.'
    return 'Reinicia con una señal breve y un balón preparado. Las explicaciones van entre rondas y no deben superar 20–30 segundos.'
  }

  const safetyGuide = (activity) => {
    const context = `${activity.title} ${activity.setup} ${activity.how} ${activity.material}`.toLowerCase()
    if (/1v1|duelo|roba|defensor|guardián/.test(context)) return 'Prohíbe entradas al suelo, cargas y tirones. Empareja por confianza y detén la tarea si el contacto deja de ser controlado.'
    if (/portería|porterías|meta|remate|tiro/.test(context)) return 'Marca una entrada y una salida diferentes, deja espacio detrás de las metas y recoge balones siempre por fuera del campo.'
    if (/pica|puerta móvil/.test(context)) return 'Usa picas blandas o conos planos y evita que ningún niño corra sosteniendo material rígido cerca de la cara.'
    return 'Comprueba que las zonas no se cruzan, retira material suelto y aprovecha una pausa entre rondas para ofrecer agua sin cortar una acción.'
  }

  const enrichActivity = (activity) => {
    const phaseStart = {
      'Bienvenida activa': 'Presenta la historia y demuestra una sola acción durante 20–30 segundos. Después, todos empiezan a la vez con su balón.',
      Exploración: 'Muestra los límites del espacio y deja una primera ronda libre para que los niños descubran soluciones antes de añadir consignas.',
      'Reto guiado': 'Demuestra quién inicia, dónde termina la acción y cómo se puntúa. Haz una repetición de prueba a velocidad baja.',
      'Partido libre': 'Aclara únicamente dirección de ataque, reinicio y normas de seguridad. Deja jugar la primera serie sin interrupciones.',
    }[activity.phase] || 'Muestra el espacio, el inicio y el final de la acción con una demostración breve.'

    return {
      ...activity,
      steps: [phaseStart, ...sentenceSteps(activity.how), rotationGuide(activity)],
      restart: restartGuide(activity),
      safety: safetyGuide(activity),
      coachIntervention: `Observa primero durante 60–90 segundos. Después usa una sola consigna (${activity.cues[0].toLowerCase()}) y vuelve a dejar jugar. Evita dar la solución antes de que el niño perciba el problema.`,
      success: `Señal de progreso: ${activity.watchFor} Observa las dos últimas rondas y anota si lo muestra la mayoría, solo algunos o todavía necesita ayuda.`,
    }
  }

  const A = (title, minutes, phase, setup, how, cues, material, objective, easier, harder, watchFor, diagram = 'free') => enrichActivity({
    title, minutes, phase, setup, how, cues, material, objective, easier, harder, watchFor, diagram,
  })

  const welcome = (title, story, movement, lifeSkill, question) => A(
    title, 8, 'Bienvenida activa',
    'Grupo en círculo, cada niño con balón y una zona segura de 18 × 18 m. Explica la misión en menos de 30 segundos.',
    `${story} Al oír la señal, todos se desplazan con balón y prueban ${movement}. Tres rondas de 60–75 s con una pregunta breve entre rondas. Nadie queda eliminado.`,
    ['Cabeza arriba cuando sea posible', 'Balón cerca, muchos contactos', `Valor del día: ${lifeSkill}`],
    '1 balón por niño · 12 conos',
    `Activar cuerpo y atención mientras aparece ${lifeSkill.toLowerCase()} desde el primer minuto.`,
    'Permite llevar el balón con las manos durante la primera ronda.',
    'Reduce el espacio o pide usar el pie menos hábil.',
    question,
    'circle',
  )

  const match = (rule, objective, question, format = '3v3') => A(
    `Partido ${format} · jugar y descubrir`, 20, 'Partido libre',
    `Campos de 22 × 15 m, equipos de ${format.split('v')[0]}, sin portero fijo y con balones alrededor para reanudar rápido. Cambios cada 3–4 min.`,
    `Juego real con pocas interrupciones. ${rule} El entrenador observa, anima y usa una sola pregunta en las pausas; no dirige cada acción.`,
    ['Todos atacan y todos defienden', 'Reanudar en menos de 8 segundos', 'Celebrar intentos y buenas decisiones'],
    '4 miniporterías · petos · 6 balones · conos',
    objective,
    'Campo más ancho, superioridad 3v2 o gol en dos porterías grandes.',
    'Campo algo menor o gol doble tras cumplir el reto, sin limitar toques.',
    question,
    'match',
  )

  const S = (day, title, objective, tags, lifeSkill, outcome, question, activities) => ({
    day, title, objective, tags, lifeSkill, outcome, question, duration: 60, players: 12, activities,
  })

  const weeks = [
    {
      title: 'Descubrir el balón', block: 'Yo, el balón y la confianza', color: 'coral',
      intent: 'Crear seguridad, gusto por jugar y primeras decisiones con el balón.',
      observables: ['Conduce sin chocar la mayor parte del tiempo', 'Mira al frente antes de cambiar de dirección', 'Se atreve a probar sin miedo al error'],
      focus: { technical: 60, tactical: 35, motor: 55, person: 75 },
      sessions: [
        S(1, 'Mi balón y yo', 'Conducir con intención y ganar confianza', ['Conducción', 'Percepción', 'Confianza'], 'Confianza', 'Mantiene su balón cerca y cambia de ruta cuando aparece alguien.', '¿Qué te ayudó a no chocar?', [
          welcome('Círculo y misión', 'Cada balón es una mascota que quiere explorar.', 'parar con la planta, arrancar y girar', 'Confianza', '¿Puedes enseñar un giro inventado?'),
          A('Islas con balón', 12, 'Exploración', 'Crea 4 islas de 5 × 5 m con conos; 2–3 niños y un balón por niño en cada una.', 'Conducen dentro de su isla. A la señal viajan a una isla de otro color sin perder el balón. Cambia la señal: voz, color levantado o gesto.', ['Contactos suaves', 'Buscar hueco antes de salir', 'Frenar con planta'], '1 balón por niño · 20 conos de 4 colores', 'Orientarse, frenar y acelerar en un entorno cambiante.', 'Islas grandes y desplazamiento andando.', 'Una isla desaparece o viaje solo con el pie menos usado.', 'Observa si miran antes de salir; evita premiar solo la velocidad.', 'islands'),
          A('Guardianes del tesoro', 20, 'Reto guiado', 'Dos campos de 15 × 12 m. 4 atacantes con balón, 1 guardián sin balón y 8 conos-tesoro al fondo.', 'Cada atacante intenta conducir, tocar un tesoro con el pie y volver. El guardián roba limpiamente; si lo logra, cambia rol con quien perdió el balón. Rondas de 90 s.', ['Cambiar de dirección si el camino se cierra', 'Usar el cuerpo entre balón y rival', 'El guardián roba el balón, no empuja'], '1 balón por atacante · 16 conos · petos', 'Resolver cuándo avanzar, girar o proteger en una oposición suave.', 'El guardián camina o hay una zona segura.', 'Dos guardianes o tesoros más separados.', 'Mantén duelos cortos y celebra escapar, no solo puntuar.', 'treasure'),
          match('Cada gol vale uno; después de marcar, el equipo que recibió saca de inmediato.', 'Transferir conducción, percepción y confianza al juego real.', '¿Cuándo era mejor avanzar y cuándo girar?'),
        ]),
        S(2, 'Mirar, decidir, jugar', 'Levantar la mirada y elegir una salida libre', ['Percepción', 'Giro', 'Autonomía'], 'Autonomía', 'Identifica una puerta libre y cambia su decisión cuando se ocupa.', '¿Cómo encontraste una puerta libre?', [
          welcome('Semáforo viajero', 'El campo es una ciudad: verde viaja, amarillo va despacio y rojo detiene el balón.', 'acelerar, desacelerar y cambiar de sentido', 'Autonomía', '¿Qué señal te costó más ver?'),
          A('Puertas de colores', 12, 'Exploración', 'Distribuye 10 puertas de conos por una zona de 20 × 18 m; cada niño con balón.', 'Atraviesan puertas libres. Al mostrar un color deben buscar una puerta de ese color; cada paso cuenta solo si no hay choque. Pídeles inventar una forma de atravesarla.', ['Mirar antes de arrancar', 'Atacar el espacio libre', 'Salir de la puerta acelerando'], '1 balón por niño · 20 conos de colores', 'Relacionar información visual con una acción de conducción.', 'Cualquier puerta vale y el entrenador señala una cercana.', 'No repetir puerta o cruzarla tras un cambio de pie.', 'No hagas filas: todos activos en el mismo espacio.', 'gates'),
          A('Cuatro metas', 20, 'Reto guiado', 'Dos campos de 18 × 15 m, 3v3, con una miniportería en cada esquina.', 'Cada equipo puede marcar en dos metas del lado contrario. Tras cada gol o salida, entra balón nuevo del entrenador. Juega series de 3 min y cambia rivales.', ['Separarse para abrir caminos', 'Mirar ambas metas antes de conducir', 'Si una meta se cierra, buscar la otra'], '8 miniporterías · petos · 8 balones · conos', 'Percibir alternativas y cambiar el plan sin instrucciones del adulto.', 'Añade un comodín con el equipo atacante.', 'Gol doble si cambian de una meta a la otra.', 'Pregunta durante la pausa; deja que el juego enseñe.', 'four-goals'),
          match('Se mantienen cuatro metas: dos para atacar. No hay obligación de pasar.', 'Elegir entre conducir, pasar o cambiar de dirección.', '¿Qué viste justo antes de elegir?'),
        ]),
      ],
    },
    {
      title: 'Frenar, girar, proteger', block: 'Yo, el balón y la confianza', color: 'coral',
      intent: 'Controlar el cuerpo y el balón al cambiar de velocidad o proteger.',
      observables: ['Frena sin pisar a otros ni caerse', 'Usa al menos dos giros distintos', 'Coloca el cuerpo entre rival y balón'],
      focus: { technical: 68, tactical: 42, motor: 65, person: 70 },
      sessions: [
        S(1, 'Frenos y giros', 'Decelerar y salir en una dirección nueva', ['Control', 'Equilibrio', 'Creatividad'], 'Creatividad', 'Frena dentro de una zona y elige un giro que le da espacio.', '¿Qué giro te dejó listo para salir?', [
          welcome('Estatuas con balón', 'Al parar la música imaginaria, balón y cuerpo se convierten en estatua.', 'parar con planta, interior y exterior', 'Creatividad', '¿Cuántas estatuas distintas puedes crear?'),
          A('Garajes y carreteras', 12, 'Exploración', 'Seis garajes de conos en el perímetro de un espacio 20 × 16 m; todos con balón.', 'Conducen por carreteras imaginarias. A la señal entran a un garaje, frenan, giran y salen por otro lado. Dos niños como máximo por garaje.', ['Pasos cortos al llegar', 'Pie de apoyo flexionado', 'Mirar la salida antes de girar'], '1 balón por niño · 24 conos', 'Coordinar frenada, equilibrio y primer contacto de salida.', 'Garajes amplios y sin límite de ocupación.', 'Añade un perseguidor suave o garajes de color indicado.', 'Evita correcciones biomecánicas largas: demuestra y deja probar.', 'gates'),
          A('Atrapa-colas', 20, 'Reto guiado', 'Parejas en cuadrados 9 × 9 m. Cada atacante con balón y un peto-cola en la cintura; defensor sin balón.', 'Durante 30 s el atacante protege balón y cola. El defensor suma si roba el balón o la cola sin contacto corporal. Cambian roles y descansan explicando qué funcionó.', ['Perfil lateral', 'Balón en el pie lejano', 'Girar lejos de la presión'], '1 balón y 2 petos por pareja · conos', 'Descubrir protección y cambios de dirección ante presión real.', 'Defensor solo intenta coger la cola.', 'Cuadrado menor o defensor puede puntuar de dos maneras.', 'Vigila tirones; la cola debe salir con facilidad.', 'duel'),
          match('Gol doble si quien marca realizó un cambio de dirección antes, siempre que surja de forma natural.', 'Usar freno, giro y protección al servicio del juego.', '¿Qué hiciste cuando el camino quedó cerrado?'),
        ]),
        S(2, 'Mi escudo invisible', 'Proteger sin esconderse y volver a avanzar', ['Protección', '1v1', 'Respeto'], 'Respeto', 'Protege el balón sin usar brazos ni empujar y reconoce el buen duelo.', '¿Cómo puedes ser fuerte sin hacer daño?', [
          welcome('Burbujas personales', 'Cada jugador viaja dentro de una burbuja invisible que no debe chocar.', 'cambiar ritmo y cubrir el balón al cruzarse', 'Respeto', '¿Cómo cuidaste tu burbuja y la de los demás?'),
          A('Roba y vuelve', 12, 'Exploración', 'Parejas, un balón, dos casas de 2 × 2 m separadas 7 m.', 'Uno lleva el balón de su casa a la otra; el compañero acompaña y trata de tocar el balón con el pie. Si toca, cambian de inmediato. Series de 40 s.', ['Cuerpo entre rival y balón', 'Brazo equilibrador, nunca empuja', 'Acelerar después del giro'], '1 balón por pareja · 16 conos', 'Sentir la distancia de protección con oposición controlada.', 'Defensor acompaña sin robar en la primera ronda.', 'Trayecto con dos puertas laterales para decidir.', 'Empareja por confianza y cambia parejas sin señalar niveles.', 'duel'),
          A('Castillos 1v1', 20, 'Reto guiado', 'Cuatro pasillos de 12 × 7 m, miniportería o dos conos en cada fondo. Parejas con balones al lado.', 'El entrenador pasa al atacante, que intenta cruzar la línea con balón. Si el defensor roba, ataca la meta contraria. Duelo máximo 20 s; luego nueva pareja.', ['Primer contacto hacia espacio', 'Proteger cuando no se puede avanzar', 'Cambio inmediato al recuperar'], '8 miniporterías o 16 conos · 8 balones · petos', 'Integrar ataque, protección y transición en duelos breves.', 'Pasillo más ancho o atacante inicia con ventaja.', 'Pasillo algo más estrecho o servicio lateral.', 'Muchos reinicios; evita colas de más de dos.', 'lanes'),
          match('Sin regla extra. Reconoce públicamente un duelo limpio y una buena recuperación.', 'Competir con valentía y respeto usando el cuerpo de forma segura.', '¿Qué duelo fue divertido para los dos?'),
        ]),
      ],
    },
    {
      title: 'Pasar y volver a jugar', block: 'Yo, el balón y la confianza', color: 'coral',
      intent: 'Descubrir el pase como una elección útil y moverse después.',
      observables: ['Ajusta fuerza y dirección en pases cortos', 'Se ofrece de nuevo tras pasar', 'Nombra o mira a quien quiere pasar'],
      focus: { technical: 72, tactical: 55, motor: 55, person: 78 },
      sessions: [
        S(1, 'El pase encuentra amigos', 'Pasar a un compañero visible y moverse', ['Pase', 'Apoyo', 'Comunicación'], 'Comunicación', 'Pasa con intención y crea una nueva línea después.', '¿Dónde puedes ir después de pasar?', [
          welcome('Saluda con el balón', 'Para saludar, envía tu balón a los pies de un compañero y ocupa otro lugar.', 'pase corto y recepción con planta', 'Comunicación', '¿Cómo avisaste de que estabas preparado?'),
          A('Triángulos viajeros', 12, 'Exploración', 'Grupos de tres en triángulos de 5–7 m, un balón por grupo y una puerta libre al lado.', 'Pasan y siguen su pase para ocupar el vértice siguiente. Cada 45 s el grupo mueve un cono y crea un triángulo nuevo. Después pueden elegir a quién pasar.', ['Pie de apoyo apunta al destino', 'Recibir de lado si puede', 'Pasar y moverse'], '1 balón por trío · 16 conos', 'Regular pase corto y entender que el juego continúa tras soltar el balón.', 'Parar el balón antes de pasar y distancias cortas.', 'Dos balones por grupo o pase atravesando una puerta.', 'No busques una técnica idéntica; busca intención y éxito creciente.', 'triangle'),
          A('Puerta que se mueve', 20, 'Reto guiado', 'Dos campos 16 × 14 m, 3v3. Cada equipo ataca una puerta formada por dos compañeros neutrales con picas blandas o conos en las manos.', 'Se marca pasando el balón por la puerta móvil a un compañero. Los neutrales caminan por la línea de fondo y cambian cada 2 min.', ['Abrir ángulo de pase', 'Mirar receptor y defensor', 'Moverse tras pasar'], '2 balones · 12 conos · petos', 'Elegir momento, dirección y fuerza del pase en un juego representativo.', 'Puerta muy ancha o comodín interior.', 'Puerta más estrecha o gol doble tras pase y devolución.', 'Usa conos en suelo si las picas no son seguras.', 'moving-goal'),
          match('Gol doble si en la jugada alguien pasa y vuelve a recibir; nunca es obligatorio.', 'Transferir pase y apoyo sin convertir el juego en una secuencia rígida.', '¿Qué movimiento ayudó a tu compañero?'),
        ]),
        S(2, 'Dos contra uno: ayudar', 'Reconocer y usar una ventaja 2v1', ['Pase', '2v1', 'Empatía'], 'Empatía', 'Se separa del portador y ofrece una opción útil.', '¿Cómo hiciste más fácil la jugada a tu compañero?', [
          welcome('Espejos por parejas', 'Uno inventa un viaje con balón y el compañero lo acompaña como su reflejo.', 'conducir, frenar y sincronizarse', 'Empatía', '¿Qué necesitabas mirar para ir juntos?'),
          A('Ríos en pareja', 12, 'Exploración', 'Parejas con un balón atraviesan una zona con 6 ríos marcados por puertas de conos.', 'Para cruzar un río, el balón debe pasar por la puerta y el compañero recibir al otro lado. Eligen su ruta y cambian de rol continuamente.', ['Separarse antes del pase', 'Acompañar el pase', 'Recibir hacia el siguiente río'], '1 balón por pareja · 24 conos', 'Coordinar pase, desplazamiento y orientación en cooperación.', 'Ríos anchos y sin oposición.', 'Un guardián que bloquea un río sin robar.', 'Evita filas: varias rutas activas.', 'gates'),
          A('Ola 2v1', 20, 'Reto guiado', 'Dos pasillos 14 × 9 m con meta en cada fondo. Dos atacantes salen contra un defensor; si roba, cruza conduciendo la salida.', 'Cada acción dura máximo 15 s. El atacante sin balón decide abrirse o acercarse. Rotación natural: defensor descansa, atacantes pasan a defender/salir.', ['Portador: atraer o avanzar', 'Compañero: no esconderse detrás del defensor', 'Celebrar pase y también buena conducción'], '4 miniporterías · petos · 8 balones · conos', 'Resolver una superioridad simple sin imponer el pase.', 'Defensor parte dos metros atrás.', 'Defensor más cerca o meta menor.', 'Pregunta por opciones; no grites “pasa”.', 'two-v-one'),
          match('Durante una serie, un comodín juega con quien tiene balón; después se retira.', 'Percibir y aprovechar ayuda sin perder iniciativa individual.', '¿Cuándo ayudó más pasar y cuándo conducir?'),
        ]),
      ],
    },
    {
      title: 'Hacernos grandes', block: 'Jugar con otros y con el espacio', color: 'blue',
      intent: 'Entender anchura y distancia de apoyo mediante juegos con varias metas.',
      observables: ['Evita juntarse alrededor del balón', 'Ocupa una zona libre al atacar', 'Vuelve a acercarse cuando un compañero necesita ayuda'],
      focus: { technical: 58, tactical: 72, motor: 60, person: 72 },
      sessions: [
        S(1, 'Abrir el campo', 'Separarse para crear caminos de avance', ['Anchura', 'Conducción', 'Cooperación'], 'Cooperación', 'Al menos dos jugadores ocupan zonas distintas cuando el equipo ataca.', '¿Qué cambia cuando os separáis?', [
          welcome('La red elástica', 'El equipo es una red: puede estirarse sin romperse.', 'separarse, acercarse y mantener visión mutua', 'Cooperación', '¿Hasta dónde puedes ir sin perder a tu equipo de vista?'),
          A('Casas ocupadas', 12, 'Exploración', 'Zona 20 × 18 m con 8 casas de aro o conos; 4 grupos de tres y un balón por grupo.', 'El trío pasa o conduce y debe ocupar tres casas diferentes. A la señal cambia de tres casas sin perder el balón. Nadie puede quedarse siempre en la misma.', ['Una casa por jugador', 'Ver balón y compañeros', 'Cambiar juntos, no correr por correr'], '4 balones · 8 aros o 24 conos', 'Representar anchura y reajuste de forma concreta.', 'Sin balón en la primera ronda.', 'Un guardián ocupa una casa y obliga a adaptar.', 'Aros siempre planos y separados para evitar tropiezos.', 'zones'),
          A('Tres calles', 20, 'Reto guiado', 'Campo 22 × 18 m dividido visualmente en tres calles, 3v3 y dos metas.', 'Juego normal. Gol doble si el equipo ocupaba al menos dos calles en el instante del remate. No es obligatorio permanecer en una calle.', ['Abrirse cuando tenemos balón', 'Acercarse si el portador está aislado', 'Cambiar de calle con la jugada'], '4 miniporterías · petos · conos planos · balones', 'Usar anchura como solución, no como posición fija.', 'Calles anchas y comodín atacante.', 'Gol doble solo si ocupan las tres calles.', 'No pares para recolocar niños; congela una sola vez si aporta claridad.', 'lanes'),
          match('Campo ancho. Durante una pausa pregunta dónde había más espacio.', 'Aplicar ocupación racional del espacio en juego libre.', '¿Dónde apareció el camino más grande?'),
        ]),
        S(2, 'Lejos para acercarnos', 'Regular la distancia de ayuda al portador', ['Apoyo', 'Distancia', 'Amistad'], 'Amistad', 'Se coloca visible y a una distancia que permite recibir.', '¿Cómo sabes si estás demasiado cerca o lejos?', [
          welcome('Planetas y satélites', 'En parejas, un planeta con balón y un satélite que mantiene una distancia útil.', 'acompañar cambios de ritmo y dirección', 'Amistad', '¿Cómo ayudó tu satélite sin tocar el balón?'),
          A('Rombos vivos', 12, 'Exploración', 'Grupos de cuatro, un balón y rombo de 8 × 6 m.', 'Tres fuera y uno libre dentro. El balón viaja y, tras pasar, el jugador puede cambiar de vértice. El del centro busca siempre una ventana visible, sin defensor.', ['Cuerpo orientado', 'No esconderse en la misma línea', 'Ajustar distancia tras cada pase'], '1 balón por cuarteto · 16 conos', 'Percibir líneas de pase y distancias de apoyo sin oposición.', 'Sin jugador interior y pases libres.', 'Un defensor sombra que solo intercepta lento.', 'Series cortas; cambia el rol interior con frecuencia.', 'diamond'),
          A('Rescate 3v2', 20, 'Reto guiado', 'Dos campos 18 × 14 m. Tres atacantes intentan llevar el balón a zona final ante dos defensores.', 'Punto si un jugador recibe o conduce controlado dentro de la zona final. Si los defensores roban, atacan la zona opuesta. Reinicio rápido.', ['Dar anchura y una ayuda cercana', 'No correr todos hacia la meta', 'Tras pérdida, defender juntos'], '2 balones · petos · 16 conos', 'Coordinar apoyos a distintas distancias en superioridad.', 'Defensores salen tarde o zona final más profunda.', '3v3 o zona final más estrecha.', 'Rota defensores para evitar etiquetas.', 'end-zone'),
          match('Gol normal; bonificación verbal cuando un jugador se mueve para ayudar aunque no reciba.', 'Valorar el movimiento útil y la amistad futbolística.', '¿Qué ayuda no aparece en el marcador?'),
        ]),
      ],
    },
    {
      title: 'Atacar la meta', block: 'Jugar con otros y con el espacio', color: 'blue',
      intent: 'Orientar acciones hacia portería y finalizar con variedad.',
      observables: ['Reconoce cuándo el camino a meta está abierto', 'Ajusta el último contacto antes de tirar', 'Sigue la jugada después del remate'],
      focus: { technical: 75, tactical: 65, motor: 68, person: 68 },
      sessions: [
        S(1, 'Conducir para marcar', 'Atacar espacio libre y preparar el remate', ['Finalización', 'Conducción', 'Valentía'], 'Valentía', 'Acerca el balón antes de tirar y prueba con ambos pies.', '¿Qué contacto te preparó mejor el tiro?', [
          welcome('Despierta porterías', 'Las miniporterías duermen hasta que un balón pasa suave y controlado.', 'conducir y finalizar desde distancias variadas', 'Valentía', '¿Desde dónde te atreviste a probar?'),
          A('Circuito sin filas', 12, 'Exploración', 'Seis miniporterías repartidas y zonas de salida alrededor; todos con balón.', 'Cada niño busca una portería libre, conduce, marca y sale hacia otra. Cambia el reto: pie distinto, giro antes de tirar o tiro después de acelerar.', ['Mirar si la meta está libre', 'Último contacto más corto', 'Recoger balón sin cruzarse'], '1 balón por niño · 6 miniporterías · conos', 'Repetir conducción y remate con autonomía y muchas oportunidades.', 'Metas anchas y tiro cercano.', 'Defensor sombra que protege dos metas.', 'Organiza sentido de salida para evitar choques.', 'goals'),
          A('Cazagoles 1v1', 20, 'Reto guiado', 'Cuatro campos 12 × 8 m, una meta en cada fondo y parejas.', 'El atacante elige una de dos posiciones de inicio; defensor sale a la vez. Si hay tiro o robo, ambos pueden jugar hasta gol o salida. Máximo 20 s.', ['Primer contacto hacia meta si está libre', 'Engaño si el defensor cierra', 'Seguir después del tiro'], '8 miniporterías · petos · 8 balones', 'Conectar percepción, conducción y remate bajo oposición.', 'Atacante con dos metros de ventaja.', 'Defensor decide desde qué lado sale.', 'Cambia roles cada acción y equilibra desafíos.', 'duel-goals'),
          match('Las porterías son algo más grandes y hay balones de reposición para favorecer muchos remates.', 'Buscar portería con intención sin convertir el juego en “tirar desde cualquier sitio”.', '¿Qué viste antes de tirar?'),
        ]),
        S(2, 'Pasar para marcar', 'Crear una ocasión con un compañero', ['Pase', 'Remate', 'Generosidad'], 'Generosidad', 'Reconoce un compañero mejor colocado y también asume el tiro cuando procede.', '¿Cuándo regalar el balón creó una ocasión mejor?', [
          welcome('Asistencias secretas', 'Cada pareja intenta ayudar al otro a marcar en una meta distinta.', 'pase, recepción y remate', 'Generosidad', '¿Qué pase fue fácil de recibir?'),
          A('Pase y remate en movimiento', 12, 'Exploración', 'Parejas, cuatro corredores amplios con meta al final y balones suficientes.', 'Ambos avanzan pasándose sin patrón fijo. Antes de una línea, uno decide pasar y el otro finaliza. Vuelven por fuera intercambiando papeles.', ['Correr en líneas distintas', 'Pase delante del compañero', 'Remate tras control si lo necesita'], '1 balón por pareja · 4 miniporterías · conos', 'Coordinar avance, último pase y finalización sin colas largas.', 'Sin límite de línea y meta grande.', 'Un defensor perseguidor sale dos segundos tarde.', 'Máximo dos parejas por corredor.', 'run-pass'),
          A('Dos metas, una elección', 20, 'Reto guiado', 'Campos 18 × 14 m, 2v2 con dos metas separadas en el fondo atacante.', 'Los atacantes eligen meta. Si pasan a un compañero y este marca, ambos celebran una “asistencia”; conducir y marcar también vale igual.', ['Fijar a un rival antes de pasar', 'Compañero visible hacia la otra meta', 'Finalizar si nadie sale'], '8 miniporterías · petos · balones', 'Elegir entre pase y acción individual según rivales y espacio.', 'Añade comodín ofensivo.', 'Metas más pequeñas o defensor recupera y contraataca.', 'No obligues a dar un número de pases.', 'two-goals'),
          match('Gol normal. Al final, cada niño reconoce una ayuda de un compañero.', 'Integrar pase, remate y generosidad en juego auténtico.', '¿Quién te hizo jugar mejor hoy?'),
        ]),
      ],
    },
    {
      title: 'Recuperar y reaccionar', block: 'Jugar con otros y con el espacio', color: 'blue',
      intent: 'Aprender a defender el espacio y cambiar de rol tras ganar o perder.',
      observables: ['Se acerca al balón sin lanzarse al suelo', 'Cambia a defender tras perder', 'Al recuperar, levanta la vista y busca salida'],
      focus: { technical: 58, tactical: 78, motor: 72, person: 80 },
      sessions: [
        S(1, 'Robar sin hacer daño', 'Orientar al atacante y recuperar con respeto', ['Defensa', 'Agilidad', 'Respeto'], 'Respeto', 'Frena delante del rival, espera y toca balón sin empujar.', '¿Cómo puedes defender fuerte y seguro?', [
          welcome('Sombra defensora', 'En parejas, una sombra sin balón acompaña al viajero con balón.', 'desplazarse lateral, frenar y mantener distancia', 'Respeto', '¿Qué distancia te dejó reaccionar?'),
          A('Protege la puerta', 12, 'Exploración', 'Parejas frente a una puerta de 3 m. Atacante con balón a 6 m; defensor entre balón y puerta.', 'Atacante intenta cruzar controlado. Defensor suma si guía al atacante fuera o toca balón. Duelo de 12 s y cambio.', ['Llegar y frenar', 'Cuerpo entre meta y balón', 'Pie cercano preparado, sin lanzarse'], '1 balón por pareja · 16 conos', 'Descubrir posición defensiva y control corporal.', 'Puerta más estrecha o defensor inicia cerca.', 'Dos puertas para que el atacante elija.', 'Prohíbe entradas al suelo y detén contacto peligroso.', 'defend-gate'),
          A('Rondo con salida 3v1', 20, 'Reto guiado', 'Cuadrados 9 × 9 m, tres atacantes en lados y un defensor dentro; una puerta de salida fuera.', 'Atacantes conservan o conducen por puerta. Si defensor roba, sale conduciendo por cualquier lado y cambia con quien perdió. Series de 60 s.', ['Defensor: acercarse cuando balón viaja', 'Atacantes: ofrecer dos salidas', 'Cambio de mentalidad inmediato'], '1 balón por grupo · 20 conos · petos', 'Vincular recuperación con primera acción de ataque.', '4v1 o espacio mayor.', '3v2 o puerta de salida concreta.', 'Cambia defensor aunque no robe para evitar frustración.', 'rondo'),
          match('Gol doble si se marca durante los 6 s posteriores a recuperar; el entrenador cuenta solo si ayuda, no para gritar prisa.', 'Reaccionar y atacar cuando el rival está desorganizado.', '¿Qué hiciste justo después de recuperar?'),
        ]),
        S(2, 'Perder, volver, ayudar', 'Reaccionar juntos tras perder el balón', ['Transición', 'Cobertura', 'Esfuerzo'], 'Esfuerzo', 'El jugador más cercano presiona y otro protege una meta.', '¿Cómo puede ayudar quien está lejos del balón?', [
          welcome('Cambio de color', 'Dos equipos se desplazan; al mostrar color cambian de misión: atacar una zona o protegerla.', 'arrancar, frenar y orientar el cuerpo', 'Esfuerzo', '¿Qué te ayudó a cambiar rápido de misión?'),
          A('Tres tesoros por equipo', 12, 'Exploración', 'Dos equipos, tres conos-tesoro en cada fondo y un balón por niño.', 'Todos conducen para tocar tesoros rivales y volver. Si pierden control, deben proteger un tesoro propio antes de atacar otra vez.', ['Reacción al error', 'Mirar balón y tesoros', 'Ayudar sin perseguir todos lo mismo'], '1 balón por niño · 12 conos grandes · petos', 'Entrenar cambio de rol de manera lúdica y motriz.', 'Sin oposición: solo cambio de misión por señal.', 'Cada equipo con dos balones compartidos.', 'No uses eliminación ni castigo físico.', 'treasure'),
          A('3v3 + meta de seguridad', 20, 'Reto guiado', 'Campo 20 × 15 m, dos metas y una zona de seguridad de 3 m delante de cada una.', 'Juego normal. Tras perder, el equipo intenta recuperar; al menos un jugador debe recordar proteger su zona. No hay obligación posicional.', ['Cercano: molestar avance', 'Lejano: proteger camino a meta', 'Hablar con palabras simples'], '4 miniporterías · petos · conos planos · balones', 'Coordinar primeras respuestas defensivas sin posiciones rígidas.', 'Zona de seguridad más profunda.', 'Retira zona visual cuando comprendan el principio.', 'Refuerza decisiones, no conviertas niños en defensas fijos.', 'safety-zone'),
          match('Sin bonificaciones. Observa cinco pérdidas y anota qué hace el equipo, sin interrumpir.', 'Comprobar reacción espontánea en juego libre.', '¿Qué respuesta del equipo funcionó mejor?'),
        ]),
      ],
    },
    {
      title: 'El duelo y la elección', block: 'Percibir, decidir y adaptarse', color: 'yellow',
      intent: 'Ampliar recursos 1v1 y aprender a leer al oponente.',
      observables: ['Ataca el lado libre del defensor', 'Usa un cambio de ritmo después del engaño', 'Acepta ganar o perder el duelo y vuelve a jugar'],
      focus: { technical: 78, tactical: 72, motor: 78, person: 75 },
      sessions: [
        S(1, 'Engañar y escapar', 'Mover al defensor y atacar el espacio contrario', ['1v1', 'Finta', 'Creatividad'], 'Creatividad', 'Prueba al menos dos soluciones diferentes en los duelos.', '¿Cómo hiciste que el defensor se moviera?', [
          welcome('Copias imposibles', 'Cada niño inventa una finta y los demás eligen una para copiar.', 'inclinar cuerpo, tocar a un lado y salir', 'Creatividad', '¿Qué detalle hacía convincente la finta?'),
          A('Puertas opuestas', 12, 'Exploración', 'Parejas con una pelota y dos puertas separadas 6 m. Atacante en medio, defensor a un brazo de distancia.', 'Atacante puntúa cruzando cualquiera de las puertas; defensor puntúa tocando balón. Acción de 8 s y cambio. Empieza sin balón una ronda.', ['Mirar posición de caderas', 'Engañar antes de acelerar', 'Balón cerca al inicio, más largo al escapar'], '1 balón por pareja · 24 conos', 'Percibir postura rival y coordinar engaño con salida.', 'Defensor reacciona un segundo tarde.', 'Tres puertas o espacio algo menor.', 'Rondas breves para mantener calidad y disfrute.', 'two-gates'),
          A('Rey o reina del pasillo', 20, 'Reto guiado', 'Cuatro pasillos 13 × 8 m con dos metas de conos laterales al fondo.', '1v1: atacante elige meta; si defensor roba, contraataca la línea inicial. Tras acción, ambos cambian de pasillo para encontrar rival nuevo.', ['Atacar rápido si hay hueco', 'Fintar si defensor espera', 'Seguir jugando tras perder'], '16 conos · 8 balones · petos', 'Adaptar la decisión 1v1 a defensores distintos.', 'Meta más ancha y ventaja inicial.', 'Defensor puede iniciar en posición variable.', 'No clasifiques ganadores; celebra variedad de soluciones.', 'lanes'),
          match('Gol doble tras superar a un rival, pero pase y desmarque siguen valiendo.', 'Usar el 1v1 como una opción dentro del juego colectivo.', '¿Cuándo era buen momento para el duelo?'),
        ]),
        S(2, 'Elegir: duelo o ayuda', 'Reconocer cuándo atacar y cuándo compartir balón', ['1v1', 'Pase', 'Decisión'], 'Toma de decisiones', 'Elige distintas soluciones según espacio y posición de compañeros.', '¿Qué pista te hizo cambiar de idea?', [
          welcome('Uno, dos o tres caminos', 'A cada señal aparecen uno, dos o tres caminos de conos para elegir.', 'cambiar de ruta sin detenerse', 'Toma de decisiones', '¿Qué miraste primero?'),
          A('Comodín rescatador', 12, 'Exploración', 'Cuadrados 10 × 10 m, 1v1 dentro y un comodín en un lateral.', 'Atacante puede cruzar línea conduciendo o pasar al comodín y recibir. Si defensor roba, cambia rol. El comodín rota cada minuto.', ['Conducir si hay espacio', 'Usar ayuda si defensor cierra', 'Moverse al pasar'], '1 balón por grupo de 3 · conos · petos', 'Comparar solución individual y cooperación en el mismo problema.', 'Comodín puede entrar al campo.', 'Dos defensores ante dos atacantes y comodín exterior.', 'No señales la solución antes de que el niño perciba.', 'joker'),
          A('3v3 con zonas de reto', 20, 'Reto guiado', 'Campo 20 × 16 m con una pequeña zona 1v1 en cada lateral y meta al fondo.', 'Juego normal. En zona lateral no entra un segundo defensor, lo que ofrece un duelo claro; también pueden jugar por dentro y pasar.', ['Reconocer dónde está la ventaja', 'Apoyar sin invadir el duelo', 'Salir de zona con intención'], '4 miniporterías · petos · conos planos · balones', 'Identificar y explotar ventajas sin imponer patrón.', 'Zonas laterales más anchas.', 'Retirar una zona o permitir segundo defensor tras 3 s.', 'Zonas son ayuda temporal, no posiciones.', 'wide-zones'),
          match('Sin regla. Antes de jugar, cada niño elige una decisión que quiere probar.', 'Transferir elección autónoma a juego real.', '¿Qué decisión repetirías y cuál cambiarías?'),
        ]),
      ],
    },
    {
      title: 'Crear un dos contra uno', block: 'Percibir, decidir y adaptarse', color: 'yellow',
      intent: 'Coordinar fijación, apoyo y pase para superar a un rival.',
      observables: ['Portador avanza hasta atraer oposición', 'Apoyo se coloca fuera de la sombra defensiva', 'Ambos continúan tras superar al defensor'],
      focus: { technical: 72, tactical: 82, motor: 62, person: 82 },
      sessions: [
        S(1, 'Atraer y soltar', 'Fijar al defensor y pasar en el momento útil', ['2v1', 'Pase', 'Paciencia'], 'Paciencia', 'El portador no pasa automáticamente: observa si el defensor sale.', '¿Cuándo estaba el defensor realmente contigo?', [
          welcome('Imanes', 'Por tríos, un defensor-imán sigue al balón y dos atacantes buscan separarlo.', 'conducir hacia rival y pasar a espacio visible', 'Paciencia', '¿Cuándo notaste que el imán te seguía?'),
          A('El defensor decide', 12, 'Exploración', 'Tríos en pasillo 12 × 8 m. Dos atacantes en línea inicial; defensor en medio y meta al fondo.', 'El portador avanza. Si defensor sale, puede pasar; si espera, puede conducir. La acción termina al cruzar meta controlado. Rotan roles.', ['Atacar al defensor con control', 'Apoyo abierto y algo adelantado', 'Pase cuando aparece el camino'], '1 balón por trío · 16 conos', 'Leer el comportamiento defensivo antes de decidir.', 'Defensor camina o inicia más atrás.', 'Meta estrecha o defensor inicia lateral.', 'Pregunta “¿qué hizo el defensor?” antes de valorar resultado.', 'two-v-one'),
          A('Olas 2v1 continuas', 20, 'Reto guiado', 'Campo 18 × 12 m, meta en ambos fondos. Dos atacan a uno; al terminar, quien tiró o perdió pasa a defender la ola siguiente.', 'Balón nuevo sale rápido desde el otro fondo. Series de 3 min, luego pausa. Mantén parejas variadas.', ['Abrir dos caminos', 'Atacar antes de que llegue ayuda', 'Transición rápida al nuevo rol'], '2 miniporterías · 8 balones · petos · conos', 'Repetir 2v1 con continuidad, percepción y esfuerzo intermitente.', 'Defensor sale tarde.', 'Añade segundo defensor perseguidor a los 4 s.', 'Explica rotación con demostración; evita esperas.', 'waves'),
          match('Gol doble si el equipo supera una línea rival mediante pase o conducción y ambos jugadores continúan la jugada.', 'Reconocer el principio del 2v1 dentro del 3v3.', '¿Cómo creasteis dos caminos?'),
        ]),
        S(2, 'Ayuda por dentro o por fuera', 'Cambiar ángulo y distancia del apoyo', ['Apoyo', 'Orientación', 'Escucha'], 'Escucha', 'El apoyo ajusta su posición al movimiento del portador.', '¿Qué te pidió la jugada aunque nadie hablara?', [
          welcome('Guía silenciosa', 'En parejas, uno conduce y el otro ofrece caminos sin hablar; después intercambian.', 'aparecer a un lado, delante o detrás', 'Escucha', '¿Qué gesto entendiste de tu compañero?'),
          A('Ventanas de pase', 12, 'Exploración', 'Grupos de tres: portador, apoyo y defensor sombra en una zona 10 × 8 m.', 'El apoyo se mueve para aparecer en una ventana. El portador suma si pasa atravesando una puerta imaginaria entre defensor y cono; cambian cada 45 s.', ['Salir de la sombra', 'Mostrar perfil y manos como referencia', 'Ajustar distancia, no quedarse fijo'], '1 balón por trío · 12 conos', 'Reconocer y crear líneas de pase dinámicas.', 'Defensor permanece quieto.', 'Defensor intercepta al 70% de intensidad.', 'Evita gritar posiciones; usa preguntas al apoyo.', 'window'),
          A('2v2 + comodín viajero', 20, 'Reto guiado', 'Dos campos 17 × 14 m, 2v2 y un comodín que juega con atacantes.', 'Se marca cruzando zona final. El comodín no puede marcar y cambia de equipo al perderse el balón. Rota cada 2 min.', ['Crear triángulo', 'Comodín cambia de lado con el balón', 'Tras pase, buscar nueva ventana'], '2 balones · petos de 3 colores · conos', 'Practicar ayudas por dentro y fuera en ventaja continua.', 'Comodín sin límite de zona y campo ancho.', 'Comodín a un toque solo si el grupo está preparado.', 'No limites toques a niños si reduce el éxito.', 'triangle-game'),
          match('Sin regla. En pausas, el portador nombra una ayuda que pudo ver.', 'Hacer visible el valor de los apoyos y la escucha.', '¿Dónde apareció tu mejor apoyo?'),
        ]),
      ],
    },
    {
      title: 'Cambiar de rol', block: 'Percibir, decidir y adaptarse', color: 'yellow',
      intent: 'Responder a pérdidas y recuperaciones con acciones simples y coordinadas.',
      observables: ['Reacciona en los primeros segundos tras cambio', 'Se abre al recuperar', 'Protege meta o presiona según cercanía'],
      focus: { technical: 62, tactical: 86, motor: 78, person: 78 },
      sessions: [
        S(1, 'Recupero y salgo', 'Crear espacio inmediatamente después de robar', ['Transición', 'Conducción', 'Reacción'], 'Resiliencia', 'Tras recuperar, hace un primer contacto que aleja el balón de presión.', '¿Dónde estaba la salida al recuperar?', [
          welcome('La puerta cambia', 'Cada jugador ataca una puerta; al cambio de color debe girar hacia otra.', 'reaccionar, orientar primer contacto y acelerar', 'Resiliencia', '¿Cómo te recuperaste de elegir tarde?'),
          A('Roba y escapa', 12, 'Exploración', 'Parejas dentro de 8 × 8 m con cuatro puertas. Uno protege, otro intenta robar.', 'Cuando roba, debe salir conduciendo por cualquier puerta; el anterior poseedor puede recuperarla hasta que cruce. Acción de 15 s.', ['Primer contacto lejos del rival', 'Cabeza arriba para elegir puerta', 'Quien pierde reacciona sin enfadarse'], '1 balón por pareja · 24 conos', 'Enlazar recuperación, orientación y aceleración.', 'Defensor señala puerta antes de robar.', 'Una puerta se cierra por señal del entrenador.', 'Controla intensidad y celebra recuperación emocional.', 'four-gates'),
          A('3 equipos, transición', 20, 'Reto guiado', 'Campo 20 × 16 m. Dos equipos de 3 juegan; tercero espera repartido fuera con balones.', 'Cuando hay gol o salida, entra inmediatamente el equipo exterior atacando al que perdió. El equipo que marcó sale. Series de 4 min.', ['Prepararse fuera mirando', 'Cambiar rol sin protestar', 'Primeros pases o conducciones hacia espacio'], '6 petos por 3 colores · 8 balones · 4 miniporterías', 'Vivir transiciones frecuentes en contexto emocionante.', 'Entrada tras señal clara y campo ancho.', 'Equipo exterior puede entrar desde lados distintos.', 'Define zonas de entrada para evitar choques.', 'three-teams'),
          match('Gol doble dentro de 6 s de recuperar solo durante la primera serie; luego regla fuera.', 'Comprobar si la conducta aparece sin premio externo.', '¿Qué hiciste antes de recibir al recuperar?'),
        ]),
        S(2, 'Perdemos juntos, defendemos juntos', 'Organizar la primera defensa tras pérdida', ['Transición', 'Defensa', 'Responsabilidad'], 'Responsabilidad', 'Uno ralentiza y otro protege, sin culpar a quien perdió.', '¿Qué responsabilidad elegiste al perder?', [
          welcome('Apaga incendios', 'Aparecen zonas-fuego de color y el equipo debe llegar organizado para apagarlas.', 'comunicar, frenar y ocupar dos zonas', 'Responsabilidad', '¿Quién vio primero el nuevo problema?'),
          A('Dos puertas a proteger', 12, 'Exploración', 'Tríos: dos defensores sin balón protegen dos puertas; atacante con balón elige una.', 'Tras cada intento, quien perdió o salió último pasa a atacar. Los defensores deciden: uno se acerca y otro vigila la segunda puerta.', ['Más cercano orienta', 'Compañero cubre otra salida', 'Hablar: “voy” o “ayuda”'], '1 balón por trío · 24 conos', 'Introducir reparto simple de responsabilidades defensivas.', 'Atacante inicia lejos o puertas estrechas.', 'Añade un segundo atacante de apoyo.', 'No fijes roles por niño; todos experimentan todo.', 'two-gates'),
          A('3v3, cinco segundos útiles', 20, 'Reto guiado', 'Campo 20 × 15 m con dos metas. Juego 3v3 normal.', 'Al perder el balón, el entrenador cuenta cinco en voz baja. El equipo busca frenar avance o recuperar; después sigue defendiendo normal. Se habla en pausas, no durante.', ['Cercano reacciona', 'Lejano protege camino a meta', 'Cero reproches'], '4 miniporterías · petos · balones', 'Observar y mejorar la reacción colectiva a la pérdida.', 'Campo más estrecho para acercar ayudas.', 'Añade comodín atacante para mayor reto defensivo.', 'El conteo es información, nunca presión o castigo.', 'match'),
          match('Juego completamente libre. El entrenador registra tres transiciones sin intervenir.', 'Evaluar si el equipo cambia de rol de forma autónoma.', '¿Qué hicimos juntos cuando perdimos?'),
        ]),
      ],
    },
    {
      title: 'Empezar a jugar', block: 'Integrar y ganar autonomía', color: 'green',
      intent: 'Dar sentido a saques y reinicios sin memorizar jugadas.',
      observables: ['El jugador con balón encuentra dos opciones', 'Los compañeros se separan y muestran', 'Reanudan rápido y sin esperar al entrenador'],
      focus: { technical: 68, tactical: 78, motor: 55, person: 88 },
      sessions: [
        S(1, 'Sacar y ofrecernos', 'Crear opciones simples desde una reanudación', ['Saque', 'Apoyo', 'Autonomía'], 'Autonomía', 'En el saque aparecen una opción corta y otra alejada.', '¿Cómo podéis ayudar a quien saca?', [
          welcome('Foto y movimiento', 'El equipo crea una foto abierta; al balón en juego todos cambian para ser visibles.', 'separarse y orientarse antes de recibir', 'Autonomía', '¿En qué foto había más caminos?'),
          A('Saque con tres puertas', 12, 'Exploración', 'Grupos de cuatro: un sacador, dos compañeros, un defensor suave y tres puertas dentro de 10 × 8 m.', 'El sacador juega con mano o pie según normas del club; se puntúa si un compañero recibe y conduce por puerta. Rotan todos.', ['Uno cerca, otro lejos', 'Cuerpo preparado hacia campo', 'Si se cierra una opción, usar otra'], '1 balón por grupo · 18 conos · petos', 'Comprender el reinicio como problema de espacio y apoyo.', 'Sin defensor la primera ronda.', 'Defensor activo o puerta concreta tras recepción.', 'Adapta la forma exacta del saque a la competición del club.', 'restart'),
          A('3v3 desde distintas bandas', 20, 'Reto guiado', 'Campo 20 × 15 m. Balones colocados en cuatro puntos exteriores.', 'Cada salida reinicia desde el balón más cercano. El equipo en posesión se organiza solo; el entrenador cuenta ocho si se bloquean, luego ofrece una pregunta.', ['Abrirse antes del saque', 'Mirar campo, no solo balón', 'Reiniciar seguros pero sin eternizar'], '8 balones · 4 miniporterías · petos · conos', 'Practicar muchas reanudaciones variables en juego real.', 'Defensa espera detrás de línea media.', 'Defensa puede presionar desde el inicio.', 'No conviertas en ensayo de jugada fija.', 'match'),
          match('Todas las salidas se reanudan con rapidez desde el punto cercano.', 'Mantener autonomía y fluidez del juego.', '¿Qué hiciste antes de que volviera el balón?'),
        ]),
        S(2, 'Salir de una esquina', 'Resolver presión cerca de la línea', ['Orientación', 'Pase', 'Calma'], 'Calma', 'No golpea al azar: busca conducir, pasar o proteger con intención.', '¿Qué opción te dio más calma?', [
          welcome('Laberinto tranquilo', 'Conducen por un laberinto sencillo; cuando se cierra, respiran, protegen y buscan otra salida.', 'girar y tomar tiempo con balón', 'Calma', '¿Qué hiciste antes de decidir?'),
          A('Esquinas con salida', 12, 'Exploración', 'Tríos en un cuadrado 10 × 10 m. Atacante con balón inicia en esquina, apoyo fuera y defensor dentro.', 'Atacante sale conduciendo o combina con apoyo para cruzar lado opuesto. Defensor empieza a 3 m. Cambian cada acción.', ['Primer toque seguro', 'Apoyo fuera de la sombra', 'Usar línea como protección, no como trampa'], '1 balón por trío · 16 conos · petos', 'Resolver presión espacial con calma y ayuda.', 'Defensor sale tarde.', 'Apoyo entra después del pase o defensor inicia más cerca.', 'Asegura espacio de frenado fuera del cuadrado.', 'corner'),
          A('Salida 3v2 a zona', 20, 'Reto guiado', 'Campo 18 × 15 m dividido en zona de inicio y zona final. Tres atacantes salen ante dos defensores.', 'Punto al conducir o recibir controlado en zona final. Tras robo, defensores marcan en dos miniporterías de inicio.', ['Crear anchura desde el inicio', 'No esconder el balón en la esquina', 'Al superar, acompañar'], '4 miniporterías · petos · balones · conos planos', 'Integrar apoyos y orientación para progresar bajo presión.', 'Defensores esperan en mitad.', '3v3 o zona final menor.', 'Reinicia desde lados diferentes.', 'build-out'),
          match('El saque de fondo comienza en una esquina elegida por el equipo.', 'Aplicar soluciones propias desde reinicio real.', '¿Cómo salisteis sin rifar el balón?'),
        ]),
      ],
    },
    {
      title: 'Nuestro juego', block: 'Integrar y ganar autonomía', color: 'green',
      intent: 'Combinar principios y permitir que el equipo diseñe variantes.',
      observables: ['Explica una regla con sus palabras', 'Ajusta una solución al rival', 'Ayuda a organizar material y equipos'],
      focus: { technical: 75, tactical: 82, motor: 72, person: 92 },
      sessions: [
        S(1, 'Laboratorio de juegos', 'Modificar reglas y observar qué conducta cambia', ['Exploración', 'Táctica', 'Liderazgo'], 'Liderazgo', 'Propone una variante segura y explica qué quiere provocar.', '¿Qué cambió en el juego con vuestra regla?', [
          welcome('Capitanes de misión', 'Pequeños grupos eligen una activación ya conocida y la enseñan durante 45 s.', 'recordar, demostrar y escuchar', 'Liderazgo', '¿Cómo lograste que todos entendieran?'),
          A('Elige el campo', 12, 'Exploración', 'Prepara tres microcampos: cuatro metas, zonas finales y meta central. Grupos de cuatro rotan cada 3 min.', 'En cada campo juegan 2v2 y descubren qué acciones aparecen. Tras cada rotación, el grupo elige una palabra: abrir, ayudar, avanzar o proteger.', ['Entrar jugando de inmediato', 'Comparar sin decir “mejor/peor”', 'Cuidar material al rotar'], '12 miniporterías o conos · petos · 6 balones', 'Relacionar diseño del juego con decisiones técnicas y tácticas.', 'Juega 2v1 si un grupo necesita más éxito.', 'Los niños cambian una dimensión del campo.', 'Señala claramente límites entre campos.', 'lab'),
          A('Diseña un reto 3v3', 20, 'Reto guiado', 'Dos campos y equipos de tres. Ofrece 4 tarjetas: más metas, zona final, comodín o campo ancho.', 'Cada equipo escoge una tarjeta, explica el reto y juega 4 min. Después dice qué comportamiento vio y cambia una sola cosa.', ['Regla simple y segura', 'Todos opinan en 20 s', 'Jugar más de lo que se habla'], '4 miniporterías · petos · conos · tarjetas · balones', 'Dar autonomía para manipular restricciones con intención.', 'Entrenador ofrece solo dos tarjetas.', 'Equipo inventa su propia variante y predice efecto.', 'Rechaza reglas de eliminación o castigos.', 'lab'),
          match('El grupo vota una única regla de las probadas y explica por qué.', 'Practicar liderazgo compartido y comprensión del juego.', '¿La regla produjo lo que imaginabais?'),
        ]),
        S(2, 'Festival 3v3', 'Jugar mucho, variar rivales y mostrar aprendizajes', ['Juego real', 'Adaptación', 'Alegría'], 'Alegría', 'Mantiene participación y actitud positiva con rivales y resultados distintos.', '¿Qué rival te enseñó algo nuevo?', [
          welcome('Pasaporte de equipo', 'Cada equipo crea nombre, saludo breve y un compromiso de juego limpio.', 'coordinarse y activar con balón', 'Alegría', '¿Cómo haréis que todos disfruten?'),
          A('Reto de estaciones', 12, 'Exploración', 'Tres estaciones de 2v2: conducción por puerta, pase a zona y remate a dos metas.', 'Partidos de 2 min; al sonar, cada grupo deja balón preparado y rota. Sin tabla de ganadores.', ['Empezar rápido', 'Reconocer una buena acción rival', 'Probar una solución distinta por estación'], '6 balones · 8 miniporterías/conos · petos', 'Reactivar los aprendizajes principales con alta participación.', '2v1 en estación necesaria.', 'Los niños eligen restricción de una estación.', 'Hidratación breve tras una vuelta completa.', 'stations'),
          A('Liga de experiencias 3v3', 20, 'Reto guiado', 'Tres campos pequeños con formatos distintos: cuatro metas, zona final y fútbol normal.', 'Partidos de 4 min y rotación. Cada equipo recibe una misión de proceso, no de resultado: abrirse, apoyarse o reaccionar.', ['Misión por encima del marcador', 'Todos juegan tiempo similar', 'Saludar antes y después'], '12 miniporterías/conos · petos · 9 balones', 'Adaptarse a contextos y rivales manteniendo principios comunes.', 'Comodín si falta un jugador.', 'Capitanes cambian una misión a mitad.', 'No publiques clasificación; registra oportunidades y disfrute.', 'festival'),
          match('Último partido elegido por los niños entre los tres formatos.', 'Cerrar con juego autónomo, intenso y emocionalmente seguro.', '¿Qué formato os hizo aprender más?'),
        ]),
      ],
    },
    {
      title: 'Mostrar y celebrar', block: 'Integrar y ganar autonomía', color: 'green',
      intent: 'Observar progreso real, reforzar identidad y decidir el siguiente ciclo.',
      observables: ['Elige entre conducir, pasar y tirar con intención', 'Se orienta y apoya sin órdenes constantes', 'Cuida, anima y reflexiona sobre su aprendizaje'],
      focus: { technical: 82, tactical: 85, motor: 78, person: 95 },
      sessions: [
        S(1, 'Misiones de progreso', 'Observar conductas en juegos conocidos sin examen', ['Evaluación', 'Decisión', 'Autoestima'], 'Autoestima', 'Reconoce algo que ahora hace mejor y un reto próximo.', '¿Qué puedes hacer ahora que antes costaba?', [
          welcome('Galería de logros', 'Cada niño muestra con balón algo aprendido; el grupo responde con un gesto de reconocimiento.', 'elegir y demostrar una habilidad útil', 'Autoestima', '¿De qué intento estás orgulloso?'),
          A('Tres juegos, tres miradas', 12, 'Exploración', 'Tres microcampos conocidos: puertas, 1v1 y 2v1. Grupos pequeños rotan cada 3 min.', 'El entrenador observa una conducta por campo: mirar antes de conducir, resolver duelo, ofrecer apoyo. No corrige durante la ronda.', ['Jugar como siempre', 'No compararse', 'Cambiar de rol con autonomía'], 'Balones · conos · miniporterías · petos · hoja de observación', 'Recoger evidencia auténtica en tareas familiares y breves.', 'Reduce oposición si aparece frustración.', 'Pregunta al niño qué quiere intentar.', 'Registra “todavía / a veces / frecuente”, no notas numéricas.', 'stations'),
          A('Partido observado 3v3', 20, 'Reto guiado', 'Dos campos 3v3 con cuatro metas y rotaciones cada 4 min.', 'Juego libre. El entrenador elige solo 3 indicadores: abrirse, reaccionar al cambio y decidir con intención. Un ayudante puede contar participación y disfrute.', ['No intervenir salvo seguridad', 'Todos juegan', 'Valorar decisión aunque falle ejecución'], '8 miniporterías · petos · balones · hoja/ móvil', 'Evaluar transferencia sin examen técnico aislado.', 'Comodín para el equipo con menos opciones.', 'Cambia a dos metas para observar adaptación.', 'No uses resultados para clasificar niños.', 'four-goals'),
          match('Juego elegido por el grupo. El entrenador solo observa y toma notas.', 'Cerrar la observación con máxima autenticidad.', '¿Qué decisión buena viste en otra persona?'),
        ]),
        S(2, 'Fiesta del aprendizaje', 'Celebrar, compartir y acordar el próximo reto', ['Juego', 'Valores', 'Pertenencia'], 'Pertenencia', 'Participa, anima y ayuda a explicar el juego a otra persona.', '¿Qué queremos seguir descubriendo juntos?', [
          welcome('Montamos el campo juntos', 'Con un plano simple, los niños ayudan por parejas a colocar conos, balones y petos.', 'transportar material de forma segura y orientarse', 'Pertenencia', '¿Qué tarea necesita ayuda?'),
          A('Juegos favoritos', 12, 'Exploración', 'Votación rápida entre cuatro juegos del ciclo. Prepara dos opciones y juega 5 min cada una.', 'Los niños explican una regla antes de empezar. El entrenador asegura inclusión y hace una adaptación si alguien participa poco.', ['Explicar con ejemplo', 'Invitar a todos', 'Cuidar el ritmo'], 'Material de los juegos elegidos', 'Comprobar recuerdo, autonomía y preferencia para planificar.', 'Entrenador demuestra con dos niños.', 'Un niño propone la adaptación.', 'La votación no excluye: se juegan dos opciones.', 'lab'),
          A('Festival cooperativo', 20, 'Reto guiado', 'Tres campos 3v3. Cada partido tiene un objetivo común para ambos equipos: 6 goles totales, 8 reinicios rápidos o 10 ayudas visibles.', 'Los equipos compiten y a la vez intentan alcanzar la misión conjunta. Rotan cada 4 min y reciben nueva misión.', ['Competir sin dejar de colaborar', 'Animar un buen intento', 'Resolver desacuerdo hablando'], 'Miniporterías · petos · balones · tarjetas de misión', 'Unir competencia, cooperación y valores en un contexto real.', 'Meta común menor o comodín.', 'Los equipos crean misión medible de proceso.', 'No premies solo cantidad; reconoce cuidado y honestidad.', 'festival'),
          match('Último partido sin regla, seguido de círculo de dos minutos y aplauso colectivo.', 'Celebrar la identidad del equipo y recoger la voz infantil.', '¿Qué promesa de equipo llevamos al siguiente bloque?'),
        ]),
      ],
    },
  ]

  window.TRAINING_PLAN = {
    title: 'La Pizarra',
    team: 'Prebenjamín · CF Rincón',
    cycle: 'Ciclo inicial · 12 semanas',
    baseDate: '2026-08-24T12:00:00',
    weeks,
    methodology: [
      { title: 'El juego enseña', text: 'Partimos de juegos reducidos y situaciones reconocibles. El entrenador diseña el problema, observa y pregunta; no prescribe cada respuesta.' },
      { title: 'Una intención por sesión', text: 'Cada día conecta técnica, táctica, movimiento y persona alrededor de un objetivo observable. Menos consignas, más oportunidades de decidir.' },
      { title: 'Mucho balón, poca espera', text: 'Formatos 1v1–4v4, varios campos y reposiciones rápidas. Nadie queda eliminado y las filas largas son una señal para rediseñar.' },
      { title: 'Carga dentro del juego', text: 'Aceleración, frenada, equilibrio, coordinación y resistencia aparecen jugando. A esta edad no se programan vueltas al campo ni trabajo físico descontextualizado.' },
      { title: 'Adaptar antes que etiquetar', text: 'Cambia espacio, número de jugadores, metas o ventaja inicial para equilibrar reto y éxito. No se separa a los niños en grupos fijos de “nivel”.' },
      { title: 'Observar tendencias', text: 'Usa todavía / a veces / frecuente y notas concretas. Compara al niño consigo mismo, nunca mediante rankings.' },
    ],
    safety: [
      'Revisa campo, porterías, cordones, superficie, hidratación y medicación comunicada antes de empezar.',
      'En calor, busca sombra, multiplica pausas y reduce duración/intensidad según las condiciones y el protocolo del club.',
      'Nada de castigo físico, eliminación, humillación o contacto peligroso. Entrada al suelo fuera de estas sesiones.',
      'Mantén visibilidad adulta, sigue el protocolo de protección del menor del club y registra cualquier incidencia.',
      'Si un niño muestra dolor, mareo, dificultad respiratoria o conducta inusual, detén su participación y aplica el protocolo del club.',
    ],
    sources: [
      { label: 'FIFA · Learning through football', url: 'https://inside.fifa.com/advancing-football/football-for-schools/learning-through-football', note: 'Juegos, exploración, inclusión y desarrollo integral 4–7 años.' },
      { label: 'FIFA · Coach-educators', url: 'https://inside.fifa.com/advancing-football/football-for-schools/coach-educators', note: 'Estructura de sesión, habilidades para la vida y protección.' },
      { label: 'FIFA Training Centre · Small team exercises', url: 'https://www.fifatrainingcentre.com/en/practice/grassroots/4-to-8/small-team-exercises.php', note: 'Formatos 3v3 y 4v4 adaptables.' },
      { label: 'OMS · Actividad física y sedentarismo', url: 'https://www.who.int/publications/i/item/9789240015128', note: 'Actividad variada, apropiada a edad y capacidad.' },
      { label: 'RFEF · Protección de la infancia', url: 'https://rfef.es/es/federacion/proteccion-de-la-infancia', note: 'Entorno seguro y prevención del daño.' },
    ],
  }
})()
