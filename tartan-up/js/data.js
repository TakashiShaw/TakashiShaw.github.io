// Illustrative fixtures, not the official CMU schedule or confirmed offers.
// Replace these records with the team's confirmed games before a pilot.
export const events = [
  { id: 'volleyball', sport: 'Volleyball', category: 'Volleyball', title: "Women’s volleyball", opponent: 'Visiting team', date: '2026-10-30', day: 'FRI', month: 'OCT', dayNumber: '30', time: '7:00 PM', venue: 'Wiegand Gymnasium', points: 100, code: 'TARTAN100', featured: true },
  { id: 'football', sport: 'Football', category: 'Football', title: 'Football', opponent: 'Visiting team', date: '2026-10-31', day: 'SAT', month: 'OCT', dayNumber: '31', time: '1:00 PM', venue: 'Gesling Stadium', points: 100, code: 'TARTAN200' },
  { id: 'soccer', sport: 'Soccer', category: 'Soccer', title: "Women’s soccer", opponent: 'Visiting team', date: '2026-11-01', day: 'SUN', month: 'NOV', dayNumber: '01', time: '2:00 PM', venue: 'Soccer Field', points: 100, code: 'TARTAN300' },
  { id: 'basketball', sport: 'Basketball', category: 'Basketball', title: "Men’s basketball", opponent: 'Visiting team', date: '2026-11-04', day: 'WED', month: 'NOV', dayNumber: '04', time: '7:00 PM', venue: 'Wiegand Gymnasium', points: 100, code: 'TARTAN400' },
];

export const rewards = [
  { id: 'restaurant', title: 'Your next food run', partner: 'Local restaurant', offer: '10% OFF', points: 200, type: 'food', description: 'A little extra reason to grab a bite after the game.', terms: 'Example restaurant discount. No participating restaurant or offer has been confirmed.' },
  { id: 'bookstore', title: 'A little more Tartan', partner: 'Campus bookstore', offer: '15% OFF', points: 300, type: 'bookstore', description: 'Turn your school spirit into a bookstore perk.', terms: 'Example bookstore discount. No bookstore partnership or offer has been confirmed.' },
  { id: 'meal', title: 'Make it a team dinner', partner: 'Local restaurant', offer: '$5 OFF', points: 400, type: 'meal', description: 'Show up for your team. Bring your friends for dinner.', terms: 'Example discount on a future qualifying purchase. No participating restaurant or offer has been confirmed.' },
];
