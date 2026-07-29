const fs = require('fs');
const path = require('path');

const replaceInDir = (dir) => {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      replaceInDir(p);
    } else if (p.endsWith('.tsx') || p.endsWith('.ts') || p.endsWith('.js')) {
      let c = fs.readFileSync(p, 'utf8');
      let changed = false;
      
      const fixes = [
        ["koala: require('../../assets/avatars/.jpg')", "koala: require('../../assets/avatars/koala.jpg')"],
        ["tiger: require('../../assets/avatars/.jpg')", "tiger: require('../../assets/avatars/tiger.jpg')"],
        ["panda: require('../../assets/avatars/.jpg')", "panda: require('../../assets/avatars/panda.jpg')"],
        ["monkey: require('../../assets/avatars/.jpg')", "monkey: require('../../assets/avatars/monkey.jpg')"],
        ["elephant: require('../../assets/avatars/.jpg')", "elephant: require('../../assets/avatars/elephant.jpg')"],
        ["giraffe: require('../../assets/avatars/.jpg')", "giraffe: require('../../assets/avatars/giraffe.jpg')"],
        ["penguin: require('../../assets/avatars/.jpg')", "penguin: require('../../assets/avatars/penguin.jpg')"],
        ["lion: require('../../assets/avatars/.jpg')", "lion: require('../../assets/avatars/lion.jpg')"]
      ];

      fixes.forEach(([from, to]) => {
        if (c.includes(from)) {
          c = c.split(from).join(to);
          changed = true;
        }
      });

      // MascotAssistant fix
      if (c.includes("require('../assets/avatars/.jpg')")) {
        c = c.split("require('../assets/avatars/.jpg')").join("require('../assets/avatars/monkey.jpg')");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(p, c);
        console.log('Fixed', p);
      }
    }
  });
};

replaceInDir('app');
replaceInDir('components');
console.log('Done');
