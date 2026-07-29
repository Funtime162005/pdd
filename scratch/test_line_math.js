function getPos(i) {
  const stepY = 100;
  const y = i * stepY + 50; // center Y
  const x = Math.sin(i * 0.5) * 70; // offset X from center
  return { x, y };
}

console.log('--- Testing Node Centers & Line Connections ---');
for (let i = 0; i < 5; i++) {
  const p1 = getPos(i);
  const p2 = getPos(i + 1);

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  console.log(`Node ${i+1} -> Node ${i+2}: Start (${p1.x.toFixed(1)}, ${p1.y}), Length: ${length.toFixed(1)}px, Angle: ${angle.toFixed(1)}deg`);
}
