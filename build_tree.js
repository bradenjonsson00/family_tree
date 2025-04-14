export function buildTree(individuals, families, ancestorIds) {
  const output = [];
  const generations = [];
  const seenIndividuals = new Set();
  const seenFamilies = new Set();

  let queue = ancestorIds.map(id => ({ indiId: id }));

  while (queue.length) {
    const nextQueue = [];
    const generation = [];

    for (const { indiId } of queue) {
      if (seenIndividuals.has(indiId)) continue;
      seenIndividuals.add(indiId);

      const person = individuals[indiId];
      if (!person) continue;

      if (person.families.length > 0) {
        for (const famId of person.families) {
          if (seenFamilies.has(famId)) continue; // <-- Skip if family already printed
          seenFamilies.add(famId);

          const fam = families[famId];
          if (fam) {
            const husb = getName(individuals, fam.husb);
            const wife = getName(individuals, fam.wife);
            generation.push(`${husb} +++ ${wife}`);

            if (fam.chil && fam.chil.length) {
              for (const childId of fam.chil) {
                if (!seenIndividuals.has(childId)) {
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

function getName(individuals, id) {
  return individuals[id] ? individuals[id].name : '?';
}
