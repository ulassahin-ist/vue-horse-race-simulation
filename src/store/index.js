import { createStore } from "vuex";

/* Base shape for race runtime state */
const defaultRaceState = () => ({
  running: false,
  paused: false,
  horses: [],
  finishedOrder: [],
  winner: null,
  raceIndex: 0,
});

/* Full store reset shape */
const defaultStoreState = () => ({
  gameInProgress: false,
  horses: [],
  races: [],
  results: [],
  raceState: defaultRaceState(),
});

/* Fisher–Yates shuffle for random order */
function shuffle(array) {
  let i = array.length;
  while (i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default createStore({
  state: defaultStoreState(),

  mutations: {
    setGameInProgress(state, value) {
      state.gameInProgress = value;
    },

    setHorses(state, horses) {
      state.horses = horses;
    },

    setRaces(state, races) {
      state.races = races;
    },

    /* Adds result for a race or appends if already exists */
    addResult(state, { raceId, horse }) {
      const existing = state.results.find((r) => r.id === raceId);
      if (existing) {
        existing.horses = [...existing.horses, horse];
      } else {
        state.results.push({ id: raceId, horses: [horse] });
      }
    },

    clearResults(state) {
      state.results = [];
    },

    /* Update raceState without full overwrite */
    setRaceState(state, payload) {
      Object.assign(state.raceState, payload);
    },

    addFinishedHorse(state, horse) {
      state.raceState.finishedOrder = [...state.raceState.finishedOrder, horse];
    },

    setWinner(state, horse) {
      state.raceState.winner = horse;
    },

    incrementRaceIndex(state) {
      if (state.raceState.raceIndex < state.races.length - 1) {
        state.raceState.raceIndex++;
      }
    },

    togglePause(state) {
      if (state.raceState.running) {
        state.raceState.paused = !state.raceState.paused;
      }
    },

    /* Reset runtime only */
    clearRuntime(state) {
      state.raceState = defaultRaceState();
    },

    /* Full store reset */
    resetAll(state) {
      Object.assign(state, defaultStoreState());
    },
  },

  actions: {
    /* Generates 20 random horses */
    generateHorses({ commit }) {
      // prettier-ignore
      const horseNames = ["Thunderbolt","Midnight Sun","Silver Arrow","Crimson Comet","Golden Mirage","Whisperwind","Ironstride","Phantom Blaze","Luna’s Shadow","Wildfire","Star Dancer","Misty Valley","Storm Runner","Jetstream","Aurora Flame","Velvet Thunder","Dust Devil","Nightshade","Echo Spirit","Royal Tempest","Shadowfax","Morning Glory","Cinderheart","High Voltage","Eclipse Dancer","Frozen Fire","Rapid River","Diamond Soul","Majestic Dream","Solar Wind","Moonfire","Lightning Step","Ocean Whisper","Valiant Star","Frostbite","Noble Heart","Wild Majesty","Desert Flame","Silver Storm","Tempest Wind","Black Gokhce"]

      // prettier-ignore
      const horseColors = ["reddish","green","blue","yellow","purple","orange","teal","dark-orange","emerald-green","sky-blue","red","dark-purple","deep-blue","turquoise","bright-orange","crimson","gray","silver","dark-navy","pink"];

      const names = shuffle([...horseNames]);
      const colors = shuffle([...horseColors]);

      const horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: names[i],
        color: colors[i],
        condition: Math.floor(Math.random() * 100) + 1,
      })).sort((a, b) => a.name.localeCompare(b.name));

      commit("setHorses", horses);
    },

    /* Generates 6 races, each with shuffled horses */
    generateRaces({ state, commit }) {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200];

      const races = distances.map((distance, i) => ({
        id: i + 1,
        distance,
        horses: shuffle([...state.horses]).slice(0, 10),
      }));

      commit("setRaces", races);
    },
  },
});
