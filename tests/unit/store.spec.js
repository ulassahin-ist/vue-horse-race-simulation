import { describe, it, expect, beforeEach } from "vitest";
import store from "../../src/store";

describe("Vuex Store Tests", () => {
  beforeEach(() => {
    store.commit("resetAll");
  });

  it("generates 20 horses", async () => {
    await store.dispatch("generateHorses");

    expect(store.state.horses.length).toBe(20);

    const ids = store.state.horses.map((h) => h.id);
    expect(new Set(ids).size).toBe(20);
  });

  it("each horse has name, color, condition", async () => {
    await store.dispatch("generateHorses");

    store.state.horses.forEach((horse) => {
      expect(horse.name).toBeTruthy();
      expect(horse.color).toBeTruthy();
      expect(horse.condition).toBeGreaterThanOrEqual(1);
      expect(horse.condition).toBeLessThanOrEqual(100);
    });
  });

  it("generates 6 races with correct distances", async () => {
    await store.dispatch("generateHorses");
    await store.dispatch("generateRaces");

    expect(store.state.races.length).toBe(6);
    expect(store.state.races[0].distance).toBe(1200);
    expect(store.state.races[5].distance).toBe(2200);
  });

  it("each race has 10 horses", async () => {
    await store.dispatch("generateHorses");
    await store.dispatch("generateRaces");

    store.state.races.forEach((race) => {
      expect(race.horses.length).toBe(10);
    });
  });

  it("increments race index safely", () => {
    store.commit("incrementRaceIndex");

    expect(store.state.raceState.raceIndex).toBe(0);

    store.state.races = Array(6).fill({});
    store.commit("incrementRaceIndex");
    expect(store.state.raceState.raceIndex).toBe(1);
  });

  it("addResult stores winners correctly", () => {
    store.commit("addResult", { raceId: 1, horse: { id: 2, name: "A" } });

    expect(store.state.results.length).toBe(1);
    expect(store.state.results[0].horses[0].id).toBe(2);
  });

  it("resetAll resets entire state", () => {
    store.commit("setGameInProgress", true);
    store.commit("setRaceState", { running: true });

    store.commit("resetAll");

    expect(store.state.gameInProgress).toBe(false);
    expect(store.state.horses.length).toBe(0);
    expect(store.state.raceState.running).toBe(false);
  });
});
