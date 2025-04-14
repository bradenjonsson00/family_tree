const seenIndividuals = new Set();
const seenFamilies = new Set();

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
        if (seenFamilies.has(famId)) continue; // <-- NEW
        seenFamilies.add(famId); // <-- NEW

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
