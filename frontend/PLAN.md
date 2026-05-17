Proyecto: Poke Guess Game
Stack: Solid.js (JavaScript), Vite, sql.js (SQLite in-browser), PokeAPI

Objetivo
- MVP jugable local: 10 preguntas, 5 opciones, temporizador, pistas, registro jugador, leaderboard guardado en DB in-browser.

Fases

Fase 0 — Preparación
- Verificar package.json y scripts (dev, build).
- Instalar dependencias: solid-js, sql.js, nanoid.
- Crear estructura: src/, src/components, src/pages, src/lib.

Fase 1 — MVP (prioridad alta)
1) UI básica
 - Home: registrar jugador modal, boton jugar, ver scoreboard.
 - Game: pregunta (imagen/silueta), 5 opciones, timer por pregunta, pistas toggle.
 - Results: resumen, tiempo total, aciertos, reintentar.

2) Lógica preguntas
 - Generar 10 preguntas usando IDs 1..151.
 - Para cada pregunta elegir 4 distractores (evitar repeticiones).
 - Prefetch datos necesarios: sprite, types, name.
 - Fallback si sprite falta -> official-artwork.

3) Temporizador y puntuacion
 - Timer por pregunta (12s). Cronometro total.
 - Scoring: primary = aciertos, tiebreaker = menor tiempo total.

4) Persistencia in-browser (sql.js)
 - DB schema: players(id,name,avatar,created_at), scores(id,player_id,correct,total_time_ms,score,date).
 - Helpers: addPlayer, getPlayers, addScore, getTopScores.
 - Persist DB blob en IndexedDB.

5) Reintentos
 - Guardar todos intentos. Marcar/update best per player si nueva mejor.

Fase 2 — Mejoras UX
- Tema "cute": paleta pastel, animaciones acierto/fallo, confetti.
- Pistas extra: tipo, primera letra, color, silueta.
- Dificultad: facil/normal/dificil.
- Cache de PokeAPI en sessionStorage para acelerar.

Fase 3 — Extras opcionales
- Export/Import DB (base64). Share score image.
- Backend futuro opcional para leaderboard global.

Tareas iniciales inmediatas
1) Crear src/lib/db.js con sql.js init y API CRUD.
2) Crear src/lib/api.js para PokeAPI fetch + cache.
3) Crear App skeleton y rutas Home/Game/Results.

Milestones
- MVP local funcional: 48-72 horas.
- UX polish + pistas: 1 semana.

Decisiones abiertas
- Guardar sprites en cache persistente? (recomendar: sí, sessionStorage).
- Seleccion de distractores: por tipo vs puro aleatorio? (recomendar: por tipo para mejor UX).

Notas técnicas
- PokeAPI CORS: usar proxy en dev o fetch desde Vite dev server.
- sql.js wasm aumenta bundle. Lazy-load DB module on app start.

Contacto
- Repo: poke-guess-game/
