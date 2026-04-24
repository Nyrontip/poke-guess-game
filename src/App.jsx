import { createSignal } from 'solid-js';
import Home from './pages/Home';
import Game from './pages/Game';
import Results from './pages/Results';

export default function App(){
  const [route, setRoute] = createSignal('home');
  const [session, setSession] = createSignal({player:null,game:null});
  return (
    <div class="app">
      {route() === 'home' && <Home onStart={(player)=>{ setSession(s=>({player,game:null})); setRoute('game'); }} />}
      {route() === 'game' && <Game session={session()} onFinish={(res)=>{ setSession(s=>({...s,game:res})); setRoute('results'); }} onQuit={()=>setRoute('home')} />}
      {route() === 'results' && <Results session={session()} onRetry={()=>setRoute('game')} onHome={()=>setRoute('home')} />}
    </div>
  );
}
