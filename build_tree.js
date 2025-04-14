export function buildTree(individuals, families, startId) {
  const parentMap = {};
  const childMap = {};

  // Build parent relationships starting from Braden
  function climb(id) {
    const person = individuals[id];
    if (!person) return;

    if (person.parents.length > 0) {
      const fam = families[person.parents[0]];
      if (fam) {
        parentMap[id] = {
          father: fam.husb,
          mother: fam.wife
        };

        // Add child references
        if (fam.husb) {
          childMap[fam.husb] = childMap[fam.husb] || [];
          childMap[fam.husb].push(id);
        }
        if (fam.wife) {
          childMap[fam.wife] = childMap[fam.wife] || [];
          childMap[fam.wife].push(id);
        }

        // Climb up recursively
        if (fam.husb) climb(fam.husb);
        if (fam.wife) climb(fam.wife);
      }
    }
  }

  climb(startId); // Start climbing from Braden
  console.log("Parent Map:", parentMap);
  console.log("Child Map:", childMap);

  document.getElementById('tree').textContent =
    "Parent Map:\n" + JSON.stringify(parentMap, null, 2) +
    "\n\nChild Map:\n" + JSON.stringify(childMap, null, 2);


  // Find all root ancestors (those who have no parents)
  const roots = new Set();
  for (const personId of Object.keys(parentMap)) {
    const parents = parentMap[personId];
    if (parents.father && !parentMap[parents.father]) roots.add(parents.father);
    if (parents.mother && !parentMap[parents.mother]) roots.add(parents.mother);
  }

  // Build generations downward
  const generations = [];
  let currentGen = Array.from(roots);

  while (currentGen.length > 0) {
    generations.push(currentGen);
    const nextGen = [];

    for (const id of currentGen) {
      if (childMap[id]) {
        for (const childId of childMap[id]) {
          if (!nextGen.includes(childId)) {
            nextGen.push(childId);
          }
        }
      }
    }

    currentGen = nextGen;
  }

  // Now render the generations
  const output = [];

  for (let i = 0; i < generations.length; i++) {
    const gen = generations[i];
    const line = gen.map(id => formatPerson(individuals, id)).join("             ");
    output.push(line);

    if (i < generations.length - 1) {
      const nextGen = generations[i + 1];
      if (nextGen.length === 1) {
        const mid = Math.floor(line.length / 2);
        output.push(" ".repeat(mid) + "|");
      } else {
        const mid = Math.floor(line.length / 2);
        output.push(" ".repeat(mid - 1) + "\\" + " ".repeat(2) + "/");
        output.push(" ".repeat(mid - 10) + "-".repeat(20));
      }
    }
  }

  return output.join("\n");
}

function formatPerson(individuals, id) {
  if (!id) return "?";
  const name = individuals[id]?.name || "?";
  return name;
}
