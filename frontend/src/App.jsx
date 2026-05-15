import { createSignal, Show } from 'solid-js';
import Home from './pages/Home';
import Game from './pages/Game';
import Results from './pages/Results';

export default function App(){
  const [route, setRoute] = createSignal('home');
  const [session, setSession] = createSignal({player:null,game:null});
  return (
    <div class="app">
      <Show when={route() === 'home'}>
        <Home onStart={(player)=>{ setSession(s=>({player,game:null})); setRoute('game'); }} />
      </Show>
      <Show when={route() === 'game'}>
        <Game session={session()} onFinish={(res)=>{ setSession(s=>({...s,game:res})); setRoute('results'); }} onQuit={()=>setRoute('home')} />
      </Show>
      <Show when={route() === 'results'}>
        <Results session={session()} onRetry={()=>setRoute('game')} onHome={()=>setRoute('home')} />
      </Show>
    </div>
  );
}
