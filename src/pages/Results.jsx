import { createSignal, onMount, Show, For } from 'solid-js';
import db from '../lib/db';
import { nanoid } from 'nanoid';

export default function Results(props){
  const s = props.session.game;
  const [saved, setSaved] = createSignal(false);
  const [scores, setScores] = createSignal([]);

  onMount(async () => {
    const top = await db.getTopScores(5);
    setScores(top);
  });

  async function save(){
    const id = nanoid();
    const seconds = Math.round(s.totalTimeMs / 1000);
    await db.addScore({id, player_id: props.session.player.id, correct: s.correct, total_time_ms: s.totalTimeMs, score: s.correct});
    setSaved(true);
    setTimeout(async () => {
      const top = await db.getTopScores(5);
      setScores(top);
    }, 200);
  }

  return (
    <div class="results">
      <h2>Game Over!</h2>
      <div class="result-summary">
        <div class="correct-count">{s.correct}/10</div>
        <div class="time-count">{Math.round(s.totalTimeMs / 1000)}s</div>
      </div>
      <Show when={!saved()}>
        <button type="button" onClick={save} class="save-btn">Save Score</button>
      </Show>
      <Show when={saved()}>
        <p class="saved">✓ Score saved!</p>
      </Show>
      
      <div class="scoreboard">
        <h3>Top Scores</h3>
        <Show when={scores().length > 0}>
          <table>
            <thead>
              <tr><th>Player</th><th>Correct</th><th>Time</th></tr>
            </thead>
            <tbody>
              <For each={scores()}>
                {(sc, i) => (
                  <tr class={sc.player_id === props.session.player.id ? 'current-player' : ''}>
                    <td>{i()+1}. {sc.name || 'Unknown'}</td>
                    <td>{sc.correct}/10</td>
                    <td>{Math.round(sc.total_time_ms / 1000)}s</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </Show>
        <Show when={scores().length === 0}>
          <p>No scores yet</p>
        </Show>
      </div>

      <div class="actions">
        <button type="button" onClick={props.onRetry} class="retry-btn">Retry</button>
        <button type="button" onClick={props.onHome} class="home-btn">Home</button>
      </div>
    </div>
  );
}
