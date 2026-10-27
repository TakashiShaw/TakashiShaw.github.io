import { events, rewards } from './data.js';
import { createDemoStore } from './store.js';

const store = createDemoStore(events, rewards);
const main = document.querySelector('main');
const modal = document.querySelector('#modal');
let filter = 'All sports';
let toastTimer;
let opener;
let staffEvent = events[0].id;
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paths = {
  home: '<path d="m3 10 9-7 9 7v10H3z"/><path d="M9 20v-7h6v7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h2m4 0h2"/>',
  gift: '<path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14"/><path d="M12 7C6 7 5 5 6 3c2-2 5 1 6 4Zm0 0c6 0 7-2 6-4-2-2-5 1-6 4Z"/>',
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5M7 7h3v3H7zm7 0h3v3h-3zM7 14h3v3H7zm7 0h3v3h-3z"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  pin: '<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-16a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  ticket: '<path d="M3 6h18v4a2 2 0 0 0 0 4v4H3v-4a2 2 0 0 0 0-4zM15 6v2m0 3v2m0 3v2"/>',
  chart: '<path d="M4 3v18h17M8 17v-5m5 5V7m5 10V4"/>',
  bag: '<path d="M4 7h16l1 14H3zM8 8V6a4 4 0 0 1 8 0v2"/>',
  food: '<path d="M5 3v7m3-7v7m3-7v7M5 7h6m-3 3v11M18 3c-3 3-3 8 0 9h2V3Zm2 9v9"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
const navItems = [['home', 'home', 'Overview'], ['games', 'calendar', 'Game day'], ['rewards', 'gift', 'My rewards'], ['check-in', 'scan', 'Check in']];

function route() {
  const [page, query = ''] = location.hash.slice(1).split('?');
  return { page: page || 'home', params: new URLSearchParams(query) };
}

function court(sport, variant = '') {
  const common = '<rect x="40" y="20" width="320" height="180" rx="1"/><path d="M200 20v180"/>';
  let lines = common;
  if (sport === 'Football') lines += '<path d="M80 20v180M120 20v180M160 20v180M240 20v180M280 20v180M320 20v180"/><path stroke-dasharray="4 12" d="M40 80h320M40 140h320"/>';
  else if (sport === 'Soccer') lines += '<circle cx="200" cy="110" r="37"/><path d="M40 65h55v90H40m320-90h-55v90h55"/><circle cx="200" cy="110" r="3" fill="currentColor"/>';
  else if (sport === 'Basketball') lines += '<circle cx="200" cy="110" r="33"/><path d="M40 77h60v66H40m320-66h-60v66h60"/><path d="M65 20c110 55 110 125 0 180m270-180c-110 55-110 125 0 180"/>';
  else lines += '<path d="M145 20v180m110-180v180"/><path d="M196 8v204m8-204v204" stroke-dasharray="3 5"/>';
  return `<div class="court-art ${variant} ${sport.toLowerCase()}" aria-hidden="true"><svg viewBox="0 0 400 220" fill="none" stroke="currentColor" stroke-width="1.5">${lines}</svg><span class="court-word">TARTANS</span></div>`;
}

function notice(text = 'Try the whole experience. No email needed. Progress resets when you refresh.') {
  return `<div class="demo-notice"><span class="notice-dot"></span><span><strong>Demo mode.</strong> ${text}</span></div>`;
}

function gameCard(event) {
  const state = store.snapshot();
  const checked = state.visits.some(visit => visit.eventId === event.id);
  const planned = state.plans.includes(event.id);
  return `<article class="game-card">${court(event.sport)}<div class="game-art-top"><span class="sport-tag">${escape(event.sport)}</span><span class="points-tag">+${event.points} PTS</span></div><div class="game-body"><div class="game-date"><b>${event.month}</b><strong>${event.dayNumber}</strong></div><div class="game-description"><span class="eyebrow">${event.day} · ${event.time}</span><h3>${escape(event.title)}</h3><p>CMU vs. ${escape(event.opponent)}</p></div></div><div class="game-location">${icon('pin')}${escape(event.venue)}</div><div class="game-bottom"><span class="example-label">Example game</span><button class="small-button ${planned ? 'planned' : ''}" data-action="plan" data-id="${event.id}" ${checked ? 'disabled' : ''}>${checked ? `${icon('check')} Checked in` : planned ? `${icon('check')} Going` : `I’m going ${icon('arrow')}`}</button></div></article>`;
}

function rewardCard(reward) {
  const state = store.snapshot();
  const claimed = state.claims.some(claim => claim.rewardId === reward.id);
  const available = state.balance >= reward.points;
  return `<article class="reward-card"><div class="reward-art ${reward.type}"><span class="example-chip">CONCEPT REWARD</span><span class="reward-drawing">${icon(reward.type === 'bookstore' ? 'bag' : 'food')}</span><strong>${reward.offer}</strong><span>${escape(reward.partner)}</span></div><div class="reward-content"><span class="eyebrow">${reward.points} POINTS</span><h3>${reward.title}</h3><p>${reward.description}</p><button class="button ${available && !claimed ? 'primary' : 'outline'} full" data-action="reward" data-id="${reward.id}">${claimed ? 'View demo voucher' : available ? 'Try this reward' : `${reward.points - state.balance} points to go`}${icon(claimed ? 'ticket' : 'arrow')}</button></div></article>`;
}

function homePage() {
  const state = store.snapshot();
  const next = rewards.find(reward => !state.claims.some(claim => claim.rewardId === reward.id)) || rewards[0];
  return `<div class="page-intro"><div><p class="eyebrow red">THE STUDENT SECTION</p><h1>Make showing up count<span class="red">.</span></h1><p>Your teams. Your campus. A little something for being there.</p></div><span class="season-label">THE TARTAN UP CONCEPT <span>↗</span></span></div>
  <div class="hero-layout"><section class="hero tartan"><div class="hero-content"><div class="hero-kicker"><span></span> LESS SCROLLING. MORE CHEERING.</div><h2>GOOD GAMES.<br>BETTER PERKS.</h2><p>Show up for the Tartans. Earn points.<br>Turn school spirit into your next reward.</p><a class="button light" href="#games">Find your next game ${icon('arrow')}</a></div><div class="hero-emblem" aria-hidden="true"><div class="emblem-ring">CMU • STUDENT SECTION •</div><strong>T<span>↗</span></strong><small>SHOW UP. TARTAN UP.</small></div><span class="hero-number" aria-hidden="true">01 /</span></section>
  <section class="wallet-card"><div class="wallet-heading"><span class="eyebrow">YOUR REWARD BALANCE</span>${icon('star')}</div><div class="balance">${state.balance}<span>PTS</span></div><p>${state.visits.length ? 'School spirit looks good on you.' : 'Your first game is your first 100.'}</p><div class="wallet-divider"></div><div class="progress-label"><span>${state.balance >= next.points ? 'Reward ready to try' : 'Next stop: a little perk'}</span><strong>${Math.min(state.balance, next.points)} / ${next.points}</strong></div><progress max="${next.points}" value="${Math.min(state.balance, next.points)}" aria-label="Progress toward ${escape(next.title)}"></progress><div class="next-reward">${icon(next.type === 'bookstore' ? 'bag' : 'food')}<div><strong>${next.offer.toLowerCase()} · ${next.partner}</strong><small>Example offer · not redeemable</small></div></div><a class="wallet-link" href="#rewards">Explore rewards ${icon('arrow')}</a></section></div>
  ${notice()}
  <section class="section"><div class="section-heading"><div><p class="eyebrow red">FIND YOUR REASON TO SHOW UP</p><h2>Coming up on campus</h2></div><a class="text-link" href="#games">All games ${icon('arrow')}</a></div><div class="games-grid">${events.slice(0, 3).map(gameCard).join('')}</div><p class="fine-print">Illustrative schedule. Your team’s confirmed games will replace these examples.</p></section>
  <section class="how-section"><div><p class="eyebrow red">SMALL EFFORT. BIG SCHOOL SPIRIT.</p><h2>The game plan.</h2></div><div class="how-step"><span>01</span><div><strong>Pick a game</strong><p>Find a match. Bring a friend.</p></div></div><div class="how-step"><span>02</span><div><strong>Check in</strong><p>Scan your group’s QR at the venue.</p></div></div><div class="how-step"><span>03</span><div><strong>Get rewarded</strong><p>Put your points toward a perk.</p></div></div></section>`;
}

function gamesPage() {
  const selected = events.filter(event => filter === 'All sports' || event.category === filter);
  return `<div class="page-intro"><div><p class="eyebrow red">YOUR NEXT PLAN STARTS HERE</p><h1>Meet you in the stands<span class="red">.</span></h1><p>Pick a game. Rally your friends. Make some noise.</p></div><a class="button primary" href="#check-in">${icon('scan')} Check in</a></div>${notice('These are example games, not the official CMU schedule.')}<div class="filter-row" role="group" aria-label="Filter by sport">${['All sports', ...new Set(events.map(event => event.category))].map(item => `<button class="filter ${filter === item ? 'active' : ''}" data-action="filter" data-filter="${escape(item)}" aria-pressed="${filter === item}">${item}</button>`).join('')}</div><div class="games-grid">${selected.map(gameCard).join('')}</div><div class="info-strip">${icon('ticket')}<div><strong>One game. 100 points. A reason to come back.</strong><p>“I’m going” saves your plan for this demo. Points are earned when you check in.</p></div></div>`;
}

function rewardsPage() {
  const state = store.snapshot();
  return `<div class="page-intro"><div><p class="eyebrow red">A LITTLE THANK-YOU FOR SHOWING UP</p><h1>School spirit has its perks<span class="red">.</span></h1><p>Explore the kinds of rewards Tartan Up could bring to campus.</p></div><div class="balance-pill">${icon('star')} <strong>${state.balance}</strong> points</div></div>${notice('All discounts are concepts. No restaurant or bookstore partnerships are confirmed.')}<div class="rewards-grid">${rewards.map(rewardCard).join('')}</div><section class="activity-section"><div class="section-heading"><h2>Your game-day story</h2><span class="eyebrow">THIS DEMO ONLY</span></div>${state.visits.length || state.claims.length ? `<div class="activity-list">${[
    ...state.visits.map(visit => ({ at: visit.at, title: events.find(event => event.id === visit.eventId).title, subtitle: 'Demo check-in', points: `+${visit.points}`, icon: 'calendar' })),
    ...state.claims.map(claim => ({ at: claim.at, title: rewards.find(reward => reward.id === claim.rewardId).title, subtitle: 'Demo reward claimed', points: `−${claim.points}`, icon: 'gift' })),
  ].sort((a, b) => b.at.localeCompare(a.at)).map(item => `<div class="activity-item"><span class="activity-icon">${icon(item.icon)}</span><div><strong>${item.title}</strong><small>${item.subtitle}</small></div><b>${item.points} pts</b></div>`).join('')}</div>` : `<div class="empty-state">${icon('ticket')}<h3>Every fan starts somewhere.</h3><p>Try checking in to a sample game to earn your first points.</p><a href="#check-in" class="text-link">Try a check-in ${icon('arrow')}</a></div>`}</section>`;
}

function checkInPage(params) {
  const requested = params.get('event');
  const selected = events.find(event => event.id === requested);
  if (requested && !selected) return `<div class="page-intro"><div><p class="eyebrow red">CHECK-IN</p><h1>We couldn’t find that game.</h1><p>This check-in link isn’t part of the demo.</p></div></div><a class="button primary" href="#check-in">Choose a sample game ${icon('arrow')}</a>`;
  const event = selected || events[0];
  const done = store.snapshot().visits.some(visit => visit.eventId === event.id);
  return `<div class="page-intro"><div><p class="eyebrow red">YOU BROUGHT THE ENERGY</p><h1>You’re here. Make it count<span class="red">.</span></h1><p>Check in at the game and take one step closer to your next reward.</p></div></div><div class="checkin-layout"><section class="checkin-card"><div class="large-icon">${icon(done ? 'check' : 'scan')}</div><h2>${done ? 'You’re on the board.' : 'Let’s get you checked in.'}</h2><p>${done ? 'You already earned points for this sample game.' : 'At a real game, scan the QR your group displays. For now, try the sample code below.'}</p><form id="checkin-form"><label for="checkin-event">Choose a sample game</label><select id="checkin-event" name="event">${events.map(item => `<option value="${item.id}" ${item.id === event.id ? 'selected' : ''}>${escape(item.title)} · ${item.month} ${item.dayNumber}</option>`).join('')}</select><div class="checkin-summary">${icon('pin')} ${event.venue}<span>+${event.points} PTS</span></div>${done ? `<a class="button primary full" href="#rewards">See my rewards ${icon('arrow')}</a>` : `<label for="checkin-code">Event code</label><input id="checkin-code" name="code" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="Enter event code" ${selected ? `value="${event.code}"` : ''} required maxlength="24"><p class="input-help">Sample code: <button type="button" class="code-fill" data-action="fill-code" data-id="${event.id}">${event.code} ${icon('arrow')}</button></p><p id="checkin-error" class="form-error" role="alert"></p><button class="button primary full" type="submit">Check in & earn ${event.points} points ${icon('arrow')}</button>`}</form><p class="fine-print">Guest demo · No email required · Resets on refresh</p></section><aside class="checkin-aside tartan"><span class="eyebrow">FROM THE STANDS TO YOUR NEXT PERK</span><h2>SHOW UP.<br>CHEER LOUD.<br>TARTAN UP.</h2><div class="checkin-how"><span>01</span><p><strong>One check-in per game</strong>Your points are added immediately.</p></div><div class="checkin-how"><span>02</span><p><strong>Keep coming back</strong>Two sample games unlock the first reward.</p></div><div class="checkin-how"><span>03</span><p><strong>Try a reward</strong>Preview a discount. No actual redemption.</p></div></aside></div>${notice('Sample codes are public and reusable across browsers. This demo does not verify real attendance.')}`;
}

function athleticsPage() {
  const state = store.snapshot();
  const visited = state.visits.length;
  return `<div class="page-intro"><div><p class="eyebrow red">FOR THE PEOPLE BEHIND GAME DAY</p><h1>A fuller student section<span class="red">.</span></h1><p>A preview of the tools an Athletics team could use to run a pilot.</p></div><span class="outlined-badge">OPEN DEMO · NO ADMIN LOGIN</span></div>${notice('Counts below describe this browser’s current guest session only. They are not pilot results.')}<div class="stats-grid"><div class="stat-card">${icon('users')}<span>Guest attendees</span><strong>${visited ? 1 : 0}</strong><small>This browser only</small></div><div class="stat-card">${icon('scan')}<span>Game check-ins</span><strong>${visited}</strong><small>One per sample game</small></div><div class="stat-card">${icon('calendar')}<span>Repeat attendees</span><strong>${visited > 1 ? 1 : 0}</strong><small>Guests at 2+ games</small></div><div class="stat-card">${icon('chart')}<span>Attendance increase</span><strong class="unmeasured">Not measured</strong><small>A comparison is needed</small></div></div><div class="admin-layout"><section class="panel"><div class="section-heading"><h2>The check-in station</h2>${icon('scan')}</div><p>Choose a game and display its QR for your group.</p><label for="staff-event">Sample game</label><select id="staff-event">${events.map(event => `<option value="${event.id}" ${event.id === staffEvent ? 'selected' : ''}>${escape(event.title)}</option>`).join('')}</select><div id="qr-area" class="qr-area"></div><div class="button-row"><button class="button outline" data-action="copy-link">Copy check-in link</button><a id="test-qr-link" class="button primary" href="#check-in?event=${staffEvent}">Try this check-in ${icon('arrow')}</a></div><p class="fine-print">On the published site, scan with a phone’s camera. Each browser has its own temporary demo; scans won’t update this screen from another device.</p><p id="local-qr-note" class="local-note" hidden>This preview address works on this computer only. Phone scanning will work after you publish to GitHub Pages.</p></section><section class="panel"><div class="section-heading"><h2>What we can learn</h2>${icon('chart')}</div><p class="panel-description">A future pilot needs a fair comparison to estimate additional attendance.</p><div class="measure-item"><span>01</span><div><h3>Record attendance</h3><p>Count verified students at each participating game, including repeat visits.</p></div></div><div class="measure-item"><span>02</span><div><h3>Agree on the comparison</h3><p>Use comparable games or test groups. Account for opponent, timing, weather, and other promotions.</p></div></div><div class="measure-item"><span>03</span><div><h3>Report the result</h3><p>Show additional attendees, reward costs, and the limits of the comparison.</p></div></div><div class="measurement-note"><strong>More check-ins ≠ proven attendance lift.</strong><p>The demo shows the experience. A live pilot supplies the evidence.</p></div></section></div><section class="panel attendance-panel"><div class="section-heading"><h2>This session’s attendance</h2><button class="small-button" data-action="export" ${visited ? '' : 'disabled'}>Export demo CSV ${icon('arrow')}</button></div><div class="attendance-list">${events.map(event => { const checked = state.visits.some(visit => visit.eventId === event.id); return `<div class="attendance-row"><span>${escape(event.title)}</span><div class="attendance-track"><span style="width:${checked ? 100 : 0}%"></span></div><strong>${checked ? 1 : 0} guest</strong></div>`; }).join('')}</div><p class="fine-print">This is a demonstration of reporting, not shared or verified attendance data.</p></section>`;
}

function render() {
  const { page, params } = route();
  const state = store.snapshot();
  for (const id of ['desktop-nav', 'mobile-nav']) {
    document.getElementById(id).innerHTML = navItems.map(([key, glyph, label]) => `<a href="#${key}" ${page === key ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${label}</span>${key === 'rewards' ? `<span class="nav-count">${state.balance}</span>` : ''}</a>`).join('');
  }
  const label = { home: 'The student section', games: 'Game day', rewards: 'My rewards', 'check-in': 'Check in', athletics: 'Athletics demo' }[page];
  document.getElementById('page-label').textContent = label || 'Page not found';
  document.title = `${label || 'Page not found'} · Tartan Up`;
  document.getElementById('guest-button').innerHTML = state.guest ? `<span class="guest-avatar">T</span> Guest student` : 'Try as a student <span>↗</span>';
  const pages = { home: homePage, games: gamesPage, rewards: rewardsPage, 'check-in': () => checkInPage(params), athletics: athleticsPage };
  main.innerHTML = pages[page] ? pages[page]() : `<div class="empty-state"><h1>That page left the stands.</h1><a class="button primary" href="#home">Back to the overview</a></div>`;
  if (page === 'athletics') drawQR();
}

function checkInURL() {
  const url = new URL(location.href);
  url.search = '';
  url.hash = `check-in?event=${encodeURIComponent(staffEvent)}`;
  return url.href;
}

function drawQR() {
  const area = document.getElementById('qr-area');
  const event = events.find(item => item.id === staffEvent);
  try {
    const qr = window.qrcode(0, 'M');
    qr.addData(checkInURL());
    qr.make();
    area.innerHTML = `<div class="qr-code" role="img" aria-label="Demo check-in QR for ${escape(event.title)}">${qr.createSvgTag({ cellSize: 5, margin: 20, scalable: true })}</div><p class="qr-code-label">${event.code}</p><span class="example-label">Demo check-in code</span>`;
  } catch { area.innerHTML = '<p>QR preview unavailable. Use the check-in link below.</p>'; }
  document.getElementById('test-qr-link').href = `#check-in?event=${staffEvent}`;
  document.getElementById('local-qr-note').hidden = !['localhost', '127.0.0.1'].includes(location.hostname);
}

function toast(message) {
  const element = document.getElementById('toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 4300);
}

function showModal(content) {
  opener = document.activeElement;
  document.getElementById('modal-content').innerHTML = `<button class="modal-close" data-action="close" aria-label="Close dialog">${icon('close')}</button>${content}`;
  modal.showModal();
}

function closeModal() { modal.close(); if (opener?.isConnected) opener.focus(); }

function showReward(id) {
  const reward = rewards.find(item => item.id === id);
  if (!reward) return;
  const state = store.snapshot();
  const claimed = state.claims.some(claim => claim.rewardId === id);
  const ready = state.balance >= reward.points;
  showModal(`<span class="eyebrow red">${claimed ? 'YOUR DEMO VOUCHER' : 'CONCEPT REWARD'}</span><h2 id="modal-title">${reward.title}</h2><div class="voucher ${reward.type}"><span>${escape(reward.partner)}</span><strong>${reward.offer}</strong><b>DEMO ONLY · NO CASH VALUE</b></div><p>${reward.terms}</p>${claimed ? '<p class="voucher-status">Demo reward claimed. This is not a valid coupon.</p>' : `<p>${ready ? `Trying this reward uses ${reward.points} of your ${state.balance} demo points.` : `You need ${reward.points - state.balance} more points to try this reward.`}</p>`}<div class="modal-actions">${claimed ? '<button class="button primary full" data-action="close">Got it</button>' : ready ? `<button class="button primary full" data-action="claim" data-id="${id}">Use ${reward.points} demo points ${icon('gift')}</button>` : '<button class="button primary full" data-action="go-checkin">Try a game check-in '+icon('arrow')+'</button>'}</div>`);
}

document.addEventListener('click', async event => {
  if (event.target.closest('.skip-link')) { event.preventDefault(); main.focus(); return; }
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const { action, id } = button.dataset;
  try {
    if (action === 'guest') { await store.startGuest(); render(); toast('You’re in! No email or personal information needed.'); }
    if (action === 'plan') {
      const state = await store.togglePlan(id);
      render();
      main.querySelector(`[data-action="plan"][data-id="${id}"]`)?.focus();
      toast(state.plans.includes(id) ? 'Added to your demo plans. Check in at the game to earn points.' : 'Removed from your demo plans.');
    }
    if (action === 'filter') { filter = button.dataset.filter; render(); main.querySelector(`[data-filter="${filter}"]`)?.focus(); }
    if (action === 'fill-code') { const input = document.getElementById('checkin-code'); input.value = events.find(item => item.id === id).code; input.focus(); }
    if (action === 'reward') showReward(id);
    if (action === 'close') closeModal();
    if (action === 'go-checkin') { closeModal(); location.hash = 'check-in'; }
    if (action === 'claim') { await store.claimReward(id); closeModal(); render(); showReward(id); toast('Demo reward claimed. This voucher is an example only.'); }
    if (action === 'reset') showModal('<span class="eyebrow red">START FRESH</span><h2 id="modal-title">Another run through?</h2><p>This clears your temporary guest, plans, points, and demo rewards. Nothing has been saved to an account.</p><div class="modal-actions"><button class="button primary full" data-action="confirm-reset">Reset demo</button><button class="button outline full" data-action="close">Keep exploring</button></div>');
    if (action === 'confirm-reset') { await store.reset(); closeModal(); filter = 'All sports'; location.hash = 'home'; render(); toast('Fresh start. Your demo has been reset.'); }
    if (action === 'copy-link') {
      try { await navigator.clipboard.writeText(checkInURL()); toast('Check-in link copied.'); }
      catch { showModal(`<h2 id="modal-title">Copy this check-in link</h2><label for="copy-url">Demo link</label><input id="copy-url" value="${escape(checkInURL())}" readonly><p>Select the link and copy it to share.</p>`); document.getElementById('copy-url').select(); }
    }
    if (action === 'export') {
      const csv = ['data_type,event_id,event_title,guest_id,points,timestamp', ...store.snapshot().visits.map(visit => `DEMO_ONLY,${visit.eventId},"${events.find(item => item.id === visit.eventId).title}",temporary-guest,${visit.points},${visit.at}`)].join('\r\n');
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'tartan-up-DEMO-attendance.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  } catch (error) { toast(error.message); }
});

document.addEventListener('change', event => {
  if (event.target.id === 'checkin-event') location.hash = `check-in?event=${event.target.value}`;
  if (event.target.id === 'staff-event') { staffEvent = event.target.value; drawQR(); }
});

document.addEventListener('submit', async event => {
  if (event.target.id !== 'checkin-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    const state = await store.checkIn(form.get('event'), form.get('code'));
    const game = events.find(item => item.id === form.get('event'));
    render();
    showModal(`<div class="success-icon">${icon('check')}</div><span class="eyebrow red">THAT’S THE SPIRIT</span><h2 id="modal-title">You just earned ${game.points} points.</h2><p>Thanks for showing up for ${escape(game.title.toLowerCase())}. Your demo balance is now <strong>${state.balance} points</strong>.</p><p class="fine-print">Sample check-in. No actual attendance was verified.</p><div class="modal-actions"><button class="button primary full" data-action="close">Keep exploring ${icon('arrow')}</button></div>`);
  } catch (error) { document.getElementById('checkin-error').textContent = error.message; }
});

modal.addEventListener('click', event => { if (event.target === modal) { const rect = modal.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeModal(); } });
window.addEventListener('hashchange', () => { if (modal.open) closeModal(); render(); window.scrollTo({ top: 0 }); main.focus({ preventScroll: true }); });
render();
