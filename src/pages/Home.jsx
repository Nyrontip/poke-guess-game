import { createSignal, onMount, Show, For } from 'solid-js';
import db from '../lib/db';
import { nanoid } from 'nanoid';

export default function Home(props){
  const [name, setName] = createSignal('');
  const [players, setPlayers] = createSignal([]);
  const [mode, setMode] = createSignal('list'); // 'list' | 'new'
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

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
                    <button type="button" onClick={() => selectPlayer(p)} class="player-btn">
                      {p.avatar} {p.name}
                    </button>
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
    </div>
  );
}
