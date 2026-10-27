// In-memory demo adapter. No cookies, localStorage, sessionStorage, or network writes.
// A production adapter must enforce identity and ledger rules on the server.
export function createDemoStore(events, rewards, now = () => new Date().toISOString()) {
  let state = fresh();
  function fresh() { return { guest: false, plans: [], visits: [], claims: [] }; }
  function balance() {
    return state.visits.reduce((sum, item) => sum + item.points, 0) - state.claims.reduce((sum, item) => sum + item.points, 0);
  }
  function snapshot() { return structuredClone({ ...state, balance: balance() }); }
  return {
    snapshot,
    async startGuest() { state.guest = true; return snapshot(); },
    async togglePlan(eventId) {
      if (!events.some(event => event.id === eventId)) throw new Error('Choose a listed game.');
      state.guest = true;
      state.plans = state.plans.includes(eventId) ? state.plans.filter(id => id !== eventId) : [...state.plans, eventId];
      return snapshot();
    },
    async checkIn(eventId, code) {
      const event = events.find(item => item.id === eventId);
      if (!event || typeof code !== 'string' || code.trim().toUpperCase() !== event.code) throw new Error('That code does not match this game. Check the code and try again.');
      if (state.visits.some(visit => visit.eventId === eventId)) throw new Error('You have already checked in to this game.');
      state.guest = true;
      state.visits.push({ eventId, points: event.points, at: now() });
      return snapshot();
    },
    async claimReward(rewardId) {
      const reward = rewards.find(item => item.id === rewardId);
      if (!reward) throw new Error('Choose a listed reward.');
      if (state.claims.some(claim => claim.rewardId === rewardId)) throw new Error('You have already tried this reward.');
      if (balance() < reward.points) throw new Error('Attend more games to unlock this reward.');
      state.claims.push({ rewardId, points: reward.points, at: now() });
      return snapshot();
    },
    async reset() { state = fresh(); return snapshot(); },
  };
}
