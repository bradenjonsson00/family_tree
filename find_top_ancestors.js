export function findTopAncestors(individuals, families, startId) {
  const visited = new Set();
  const ancestors = new Set();

  function climb(id) {
    if (!id || visited.has(id)) return;
    visited.add(id);

    const person = individuals[id];
    if (!person) return;

    if (person.parents.length === 0) {
      ancestors.add(id);
    } else {
      for (const famId of person.parents) {
        const fam = families[famId];
        if (fam) {
          if (fam.husb) climb(fam.husb);
          if (fam.wife) climb(fam.wife);
        }
      }
    }
  }

  climb(startId);
  return Array.from(ancestors);
}
