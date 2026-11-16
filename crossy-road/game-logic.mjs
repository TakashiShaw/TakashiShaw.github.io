// Mutates score using the most-forward row reached. Returns undefined.
export function refreshScore(score, playerRow, playerStartRow) {
  if (playerRow < score.bestRow) {
    score.bestRow = playerRow;
    score.val     = playerStartRow - score.bestRow;
    if (score.val > score.best) score.best = score.val;
  }
}

// Returns whether the player's hitbox strictly overlaps this car's hitbox.
// laneY is the lane's screen-space top edge; config supplies tileSize,
// playerHitbox, and carHitbox.
export function overlapsCar(player, car, laneY, config) {
  const hs   = (config.tileSize * config.playerHitbox) / 2;
  const px1  = player.px - hs;
  const px2  = player.px + hs;
  const py1  = player.py - hs;
  const py2  = player.py + hs;

  const cy     = laneY + (config.tileSize - car.h) / 2;
  const shrink = car.h * (1 - config.carHitbox) / 2;
  const cx1    = car.x;
  const cx2    = car.x + car.w;
  const cy1    = cy + shrink;
  const cy2    = cy + car.h - shrink;

  return px2 > cx1 && px1 < cx2 && py2 > cy1 && py1 < cy2;
}

// Returns whether a grass lane has blocking scenery at the given column.
export function isTileBlocked(lane, col) {
  if (lane.type !== 'grass') return false;
  return lane.scenery.some(s => s.blocked && s.col === col);
}
