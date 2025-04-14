export async function parseGEDCOM(filename) {
  const response = await fetch(filename);
  const text = await response.text();
  const lines = text.split('\n').map(line => line.trim());

  const individuals = {};
  const families = {};

  let currentId = null;
  let currentFam = null;

  for (const line of lines) {
    const indiMatch = line.match(/^0\s+(@I\d+@)\s+INDI/);
    const famMatch = line.match(/^0\s+(@F\d+@)\s+FAM/);

    if (indiMatch) {
      currentId = indiMatch[1];
    } else if (famMatch) {
      currentFam = famMatch[1];
    } else if (line.startsWith('1 NAME') && currentId) {
      let name = line.substring(7).replace(/\//g, '').trim();
      if (name.length > 15) name = name.substring(0, 14) + '…';
      individuals[currentId] = { name, parents: [], families: [] };
    } else if (line.startsWith('1 FAMC') && currentId) {
      const famc = line.split(' ').pop();
      individuals[currentId].parents.push(famc);
    } else if (line.startsWith('1 FAMS') && currentId) {
      const fams = line.split(' ').pop();
      individuals[currentId].families.push(fams);
    } else if (line.startsWith('1 HUSB') && currentFam) {
      families[currentFam] = families[currentFam] || {};
      families[currentFam].husb = line.split(' ').pop();
    } else if (line.startsWith('1 WIFE') && currentFam) {
      families[currentFam] = families[currentFam] || {};
      families[currentFam].wife = line.split(' ').pop();
    } else if (line.startsWith('1 CHIL') && currentFam) {
      families[currentFam] = families[currentFam] || {};
      families[currentFam].chil = families[currentFam].chil || [];
      families[currentFam].chil.push(line.split(' ').pop());
    }
  }

  return { individuals, families };
}
