import {
  createSignal,
  onMount,
  onCleanup,
  createEffect,
  Show,
  For,
} from "solid-js";
import { fetchPokemon } from "../lib/api";

function randInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

async function genQuestion(usedIds) {
  let id = randInt(151);
  while (usedIds.has(id)) id = randInt(151);
  usedIds.add(id);

  const correct = await fetchPokemon(id);
  const distractors = [];
  while (distractors.length < 5) {
    let dId = randInt(151);
    if (dId !== id && !usedIds.has(dId)) {
      try {
        const d = await fetchPokemon(dId);
        distractors.push(d.name);
      } catch (e) {}
    }
  }

  const options = [correct.name, ...distractors].sort(
    () => Math.random() - 0.5,
  );
  return {
    id: correct.id,
    name: correct.name,
    sprite: correct.sprites.front_default,
    types: correct.types,
    options,
  };
}

export default function Game(props) {
  const [questionIdx, setQuestionIdx] = createSignal(0);
  const [questions, setQuestions] = createSignal([]);
  const [timeLeft, setTimeLeft] = createSignal(12);
  const [correct, setCorrect] = createSignal(0);
  const [startTime, setStartTime] = createSignal(0);
  const [loading, setLoading] = createSignal(true);
  const [answered, setAnswered] = createSignal(false);
  let timerInterval;

  onMount(async () => {
    const qs = [];
    const used = new Set();
    for (let i = 0; i < 10; i++) {
      try {
        const q = await genQuestion(used);
        qs.push(q);
      } catch (e) {
        console.error("Failed to generate question", e);
      }
    }
    setQuestions(qs);
    setStartTime(Date.now());
    setLoading(false);

    // Start timer
    timerInterval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1 && !answered()) {
          // Auto-fail if time's up
          handleAutoFail();
          return 0;
        }
        return t > 0 ? t - 1 : 0;
      });
    }, 1000);

    onCleanup(() => {
      if (timerInterval) clearInterval(timerInterval);
    });
  });

  function handleAutoFail() {
    if (answered()) return;
    setAnswered(true);
    setTimeout(() => {
      advanceQuestion();
    }, 500);
  }

  function advanceQuestion() {
    const idx = questionIdx();
    if (idx === 9) {
      // Game finished
      const totalTime = Date.now() - startTime();
      props.onFinish({ correct: correct(), totalTimeMs: totalTime });
    } else {
      // Next question
      setQuestionIdx(idx + 1);
      setTimeLeft(12);
      setAnswered(false);
    }
  }

  function answer(choice) {
    if (answered()) return;
    setAnswered(true);
    const q = questions()[questionIdx()];
    if (choice === q.name) {
      setCorrect((c) => c + 1);
    }

    // Delay before advancing
    setTimeout(() => {
      advanceQuestion();
    }, 800);
  }

  const q = () => questions()[questionIdx()];

  return (
    <div class="game">
      <div class="game-header">
        <div class="progress">Q {questionIdx() + 1}/10</div>
        <div class={`timer ${timeLeft() < 3 ? "danger" : ""}`}>
          {timeLeft()}s
        </div>
      </div>
      <Show when={loading()}>
        <div class="loading">Generating questions...</div>
      </Show>
      <Show when={!loading() && q()}>
        <div class="game-content">
          <img src={q().sprite} alt={q().name} class="pokemon-sprite" />
          <div class="options">
            <For each={q().options}>
              {(o) => (
                <button
                  type="button"
                  onClick={() => answer(o)}
                  class={`option ${answered() && o === q().name ? "correct" : answered() && o !== q().name ? "incorrect" : ""}`}
                  disabled={answered()}
                >
                  {o}
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>
      <Show when={!loading() && !q()}>
        <div>Loading...</div>
      </Show>
    </div>
  );
}
