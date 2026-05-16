// DB wrapper usando backend PHP
const API_BASE = '/api';

async function init() {
  // Verificar que el backend está disponible
  try {
    const res = await fetch(`${API_BASE}/scores/top/1`);
    if (!res.ok) throw new Error('Backend not available');
    return true;
  } catch (e) {
    console.error('Failed to connect to backend:', e);
    throw e;
  }
}

async function addPlayer({id, name, avatar}) {
  try {
    const res = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id, name, avatar})
    });
    
    if (!res.ok) throw new Error(`Failed to add player: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error adding player:', e);
    throw e;
  }
}

async function getPlayers() {
  try {
    const res = await fetch(`${API_BASE}/players`);
    if (!res.ok) throw new Error(`Failed to get players: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error getting players:', e);
    return [];
  }
}

async function addScore({id, player_id, correct, total_time_ms, score}) {
  try {
    const res = await fetch(`${API_BASE}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id, player_id, correct, total_time_ms, score})
    });
    
    if (!res.ok) throw new Error(`Failed to add score: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error adding score:', e);
    throw e;
  }
}

async function getTopScores(limit=20, period='all') {
  try {
    const res = await fetch(`${API_BASE}/scores/top/${limit}?period=${period}`);
    if (!res.ok) throw new Error(`Failed to get top scores: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error getting top scores:', e);
    return [];
  }
}

async function getPlayerScores(playerId, period='all') {
  try {
    const res = await fetch(`${API_BASE}/scores/player/${playerId}?period=${period}`);
    if (!res.ok) throw new Error(`Failed to get player scores: ${res.status}`);
    return await res.json();
  } catch (e) {
    console.error('Error getting player scores:', e);
    return [];
  }
}

export default { init, addPlayer, getPlayers, addScore, getTopScores, getPlayerScores };
