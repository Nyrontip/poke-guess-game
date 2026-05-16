import { createSignal, onMount, Show, For } from 'solid-js';
import db from '../lib/db';
import { nanoid } from 'nanoid';

export default function Home(props){
  const [name, setName] = createSignal('');
  const [players, setPlayers] = createSignal([]);
  const [mode, setMode] = createSignal('list'); // 'list' | 'new' | 'history'
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [selectedPlayer, setSelectedPlayer] = createSignal(null);
  const [playerScores, setPlayerScores] = createSignal([]);
  const [period, setPeriod] = createSignal('all');

  onMount(async () => {
    try {
      await db.init();
      const p = await db.getPlayers();
      setPlayers(p);
    } catch (e) {
      setError('Failed to load players: ' + e.message);
      console.error(e);
    }
  });

  async function loadPlayerHistory(player) {
    setSelectedPlayer(player);
    setPeriod('all');
    const scores = await db.getPlayerScores(player.id, 'all');
    setPlayerScores(scores);
    setMode('history');
  }

  async function changePeriod(p) {
    setPeriod(p);
    const scores = await db.getPlayerScores(selectedPlayer().id, p);
    setPlayerScores(scores);
  }

  function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString();
  }

  async function register(){
    if (!name().trim()) {
      setError('Please enter a name');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const id = nanoid();
      await db.addPlayer({id, name: name(), avatar: ''});
      props.onStart({id, name: name(), avatar: ''});
    } catch (e) {
      setError('Failed to register: ' + e.message);
      console.error(e);
      setLoading(false);
    }
  }

  function selectPlayer(player){
    props.onStart(player);
  }

  return (
    <div class="home">
      <h1>🎮 Poke Guess Game</h1>
      
      <Show when={error()}>
        <div class="error-msg">{error()}</div>
      </Show>
      
      <Show when={mode() === 'list'}>
        <div class="home-list">
          <Show when={players().length > 0}>
            <div class="players-section">
              <h2>Select Player</h2>
              <div class="player-list">
                <For each={players()}>
                  {(p) => (
                    <div class="player-row">
                      <button type="button" onClick={() => selectPlayer(p)} class="player-btn">
                        {p.avatar} {p.name}
                      </button>
                      <button type="button" onClick={() => loadPlayerHistory(p)} class="history-btn">
                        📊
                      </button>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </Show>
          <button 
            type="button" 
            onClick={() => {
              setName('');
              setMode('new');
            }} 
            class="new-player-btn"
          >
            {players().length > 0 ? 'New Player' : 'Start Game'}
          </button>
        </div>
      </Show>
      
      <Show when={mode() === 'new'}>
        <div class="home-new">
          <input 
            placeholder="Enter your name" 
            value={name()} 
            onInput={e => setName(e.target.value)}
            class="name-input"
            disabled={loading()}
          />
          <button 
            type="button" 
            onClick={register} 
            class="play-btn"
            disabled={loading()}
          >
            {loading() ? 'Loading...' : 'Play'}
          </button>
          <Show when={players().length > 0}>
            <button 
              type="button" 
              onClick={() => setMode('list')} 
              class="back-btn"
              disabled={loading()}
            >
              Back
            </button>
          </Show>
        </div>
      </Show>
      
      <Show when={mode() === 'history'}>
        <div class="history-view">
          <h2>{selectedPlayer().name} - Score History</h2>
          
          <div class="period-tabs">
            <button 
              type="button" 
              class={`tab-btn ${period() === 'week' ? 'active' : ''}`}
              onClick={() => changePeriod('week')}
            >
              Week
            </button>
            <button 
              type="button" 
              class={`tab-btn ${period() === 'month' ? 'active' : ''}`}
              onClick={() => changePeriod('month')}
            >
              Month
            </button>
            <button 
              type="button" 
              class={`tab-btn ${period() === 'all' ? 'active' : ''}`}
              onClick={() => changePeriod('all')}
            >
              All Time
            </button>
          </div>
          
          <Show when={playerScores().length === 0}>
            <p class="no-scores">No scores for this period</p>
          </Show>
          
          <Show when={playerScores().length > 0}>
            <div class="scores-list">
              <For each={playerScores()}>
                {(s) => (
                  <div class="score-item">
                    <span class="score-date">{formatDate(s.date)}</span>
                    <span class="score-correct">✅ {s.correct}/10</span>
                    <span class="score-time">⏱ {(s.total_time_ms / 1000).toFixed(1)}s</span>
                    <span class="score-points">🏆 {s.score}</span>
                  </div>
                )}
              </For>
            </div>
          </Show>
          
          <button 
            type="button" 
            onClick={() => setMode('list')} 
            class="back-btn"
          >
            Back
          </button>
        </div>
      </Show>
    </div>
  );
}