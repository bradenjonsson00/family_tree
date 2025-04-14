export function buildTree(individuals, families, ancestorIds) {
  const output = [];
  const generations = [];
  const seen = new Set(); // <-- NEW

  let queue = ancestorIds.map(id => ({ indiId: id }));

  while (queue.length) {
    const nextQueue = [];
    const generation = [];

    for (const { indiId } of queue) {
      if (seen.has(indiId)) continue; // <-- ADD THIS
      seen.add(indiId); // <-- AND THIS

      const person = individuals[indiId];
      if (!person) continue;

      if (person.families.length > 0) {
        for (const famId of person.families) {
          const fam = families[famId];
          if (fam) {
            const husb = getName(individuals, fam.husb);
            const wife = getName(individuals, fam.wife);
            generation.push(`${husb} +++ ${wife}`);

            if (fam.chil && fam.chil.length) {
              for (const childId of fam.chil) {
                if (!seen.has(childId)) { // <-- NEW
                  nextQueue.push({ indiId: childId });
                }
              }
            }
          }
        }
      } else {
        generation.push(person.name);
      }
    }

    if (generation.length > 0) {
      generations.push(generation);
    }
    queue = nextQueue;
  }

  // Format generations horizontally
  for (let i = 0; i < generations.length; i++) {
    const line = generations[i].join("            ");
    output.push(line);

    if (i < generations.length - 1) {
      const mid = Math.floor(line.length / 2);
      output.push(" ".repeat(mid) + "|");
      output.push(" ".repeat(mid - 5) + "-".repeat(10));
    }
  }

  return output.join("\n");
}
