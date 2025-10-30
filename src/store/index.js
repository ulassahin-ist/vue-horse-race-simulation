import { createStore } from "vuex";

export default createStore({
  state: {
    horses: [],
    races: [],
    currentRound: 0,
    gameStatus: "idle",
  },
  mutations: {
    setHorses(state, horses) {
      state.horses = horses;
    },
    setRaces(state, races) {
      state.races = races;
    },
    setCurrentRound(state, round) {
      state.currentRound = round;
    },
    setGameStatus(state, status) {
      state.gameStatus = status;
    },
  },
  actions: {
    generateHorses({ commit }) {
      // prettier-ignore
      const horseNames = ["Thunderbolt", "Midnight Majesty", "Silver Arrow", "Crimson Comet", "Golden Mirage","Whisperwind", "Ironstride", "Phantom Blaze", "Luna’s Shadow", "Wildfire","Star Dancer", "Misty Valley", "Storm Runner", "Jetstream", "Aurora Flame","Velvet Thunder", "Dust Devil", "Nightshade", "Echo Spirit", "Royal Tempest","Shadowfax", "Morning Glory", "Cinderheart", "High Voltage", "Eclipse Dancer","Frozen Fire", "Rapid River", "Diamond Soul", "Majestic Dream", "Solar Wind","Moonfire", "Lightning Step", "Ocean Whisper", "Valiant Star", "Frostbite","Noble Heart", "Wild Majesty", "Desert Flame", "Silver Storm", "Tempest Wind"]

      // prettier-ignore
      const horseColors = ["reddish","green","blue","yellow","purple","orange","teal","dark-orange","emerald-green","sky-blue","red","dark-purple","deep-blue","turquoise","bright-orange","crimson","gray","silver","dark-navy","pink",];
      const shuffledNames = [...horseNames].sort(() => 0.5 - Math.random());
      const shuffledColors = [...horseColors].sort(() => 0.5 - Math.random());
      const horses = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: shuffledNames[i],
        color: shuffledColors[i],
        condition: Math.floor(Math.random() * 100) + 1,
      }));
      commit("setHorses", horses);
    },

    generateRaces({ state, commit }) {
      const distances = [1200, 1400, 1600, 1800, 2000, 2200];
      const races = distances.map((distance, i) => {
        const tenHorses = [...state.horses]
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        return {
          id: i + 1,
          distance: distance,
          horses: tenHorses,
        };
      });
      commit("setRaces", races);
    },
  },
});
