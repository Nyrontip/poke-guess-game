// PokeAPI helper with simple cache
const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';
const CACHE_KEY = 'pg_poke_cache_v1';

function _getCache() {
  try { return JSON.parse(sessionStorage.getItem(CACHE_KEY) || '{}'); } catch(e){ return {}; }
}

function _setCache(obj){ sessionStorage.setItem(CACHE_KEY, JSON.stringify(obj)); }

async function fetchPokemon(id) {
  const cache = _getCache();
  if (cache[id]) return cache[id];
  const proxy = 'https://corsproxy.io/?';
  const res = await fetch(proxy + API_BASE + id);
  if (!res.ok) throw new Error('PokeAPI fetch failed: ' + res.status);
  const data = await res.json();
  const payload = {
    id: data.id,
    name: data.name,
    sprites: data.sprites,
    types: data.types.map(t=>t.type.name)
  };
  cache[id] = payload;
  _setCache(cache);
  return payload;
}

export { fetchPokemon };
