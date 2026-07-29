const ITEM_HEIGHT = 110;

for (let i = 0; i < 5; i++) {
  const x1 = Math.sin(i * 0.6) * 70;
  const x2 = Math.sin((i + 1) * 0.6) * 70;

  const dx = x2 - x1;
  const dy = ITEM_HEIGHT;
  const length = Math.hypot(dx, dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  console.log(`Node ${i+1} -> Node ${i+2}: x1=${x1.toFixed(1)}, x2=${x2.toFixed(1)}, len=${length.toFixed(1)}px, angle=${angle.toFixed(1)}deg`);
}
