/*Pomocná funkce pro získání náhodného celého čísla včetně obou hran.
Používám ji na výběr jména, příjmení, úvazku i náhodného věku.*/

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Seznam křestních jmen, ze kterých se náhodně vybírá.
const names = [
  "Jan", "Petr", "Lukáš", "Jiří", "Tomáš",
  "Martin", "Jakub", "Marek", "Ondřej", "Karel",
  "Václav", "Roman", "Daniel", "Michal", "Josef",
  "Filip", "Radek", "Zdeněk", "Adam", "David",
  "Jaroslav", "Aleš", "Stanislav", "Dominik", "Erik",
  "Štěpán", "Matěj", "Richard", "Patrik", "Robert",

  "Hana", "Lucie", "Eva", "Petra", "Tereza",
  "Jana", "Kristýna", "Kateřina", "Barbora", "Adéla",
  "Alena", "Veronika", "Eliška", "Markéta", "Magdaléna",
  "Natálie", "Denisa", "Karolína", "Nikola", "Sabina"
];

// Seznam příjmení pro generování zaměstnanců.
const surnames = [
  "Novák", "Svoboda", "Dvořák", "Černý", "Procházka",
  "Kuřil", "Pokorný", "Veselý", "Krejčí", "Horák",
  "Němec", "Malý", "Urban", "Beneš", "Kučera",
  "Říha", "Vaněk", "Král", "Fiala", "Sedláček",
  "Kolář", "Růžička", "Bartoš", "Martínek", "Kadlec",
  "Bláha", "Šimek", "Vlček", "Musil", "Šťastný",
  "Ševčík", "Kříž", "Doležal", "Mach", "Holub",
  "Zeman", "Tomek", "Pavlík", "Straka", "Kopecký",
  "Pospíšil", "Mašek", "Hájek", "Pavelka", "Sýkora",
  "Tichý", "Vacek", "Havlíček", "Ptáček", "Hruška"
];

// Pomocné zaokrouhlení na 1 desetinné místo
function roundTo1Decimal(value) {
  return Math.round(value * 10) / 10;
}

// Výpočet věku v letech jako desetinné číslo.
function getAgeInYears(birthdateIso, now = new Date()) {
  const birth = new Date(birthdateIso);
  const msPerYear = 365.25 * 24 * 60 * 60 * 1000;
  return (now.getTime() - birth.getTime()) / msPerYear;
}

function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid];
  return (sorted[mid - 1] + sorted[mid]) / 2;
}

function isValidDtoIn(dtoIn) {
  if (!dtoIn || typeof dtoIn !== "object") return false;
  if (typeof dtoIn.count !== "number" || dtoIn.count < 1) return false;
  if (!dtoIn.age || typeof dtoIn.age !== "object") return false;
  if (typeof dtoIn.age.min !== "number" || typeof dtoIn.age.max !== "number") return false;
  if (dtoIn.age.min < 0 || dtoIn.age.max < 0) return false;
  if (dtoIn.age.min > dtoIn.age.max) return false;
  return true;
}

// Generování zaměstnanců jako samostatná funkce (dle zadání domácího úkolu 4)
export function generateEmployeeData(dtoIn) {
  const employees = [];

  // Základní validace vstupu
  if (!isValidDtoIn(dtoIn)) return employees;
  const now = new Date();
  for (let i = 0; i < dtoIn.count; i++) {

    /*Pohlaví generujeme náhodně (male/female).
    Křestní jméno vybíráme z pole "names" podle pohlaví:
    prvních 30 položek jsou mužská jména, zbytek jsou ženská.*/
    const gender = Math.random() < 0.5 ? "male" : "female";

    const maleNameCount = 30;
    let name;
    if (gender === "male") {
      name = names[randomInt(0, maleNameCount - 1)];
    } else {
      name = names[randomInt(maleNameCount, names.length - 1)];
    }

    // Příjmení generujeme náhodně ze seznamu "surnames" (bez úpravy podle pohlaví).
    const surname = surnames[randomInt(0, surnames.length - 1)];

    // Náhodně generovaný pracovní úvazek.
    const workloads = [10, 20, 30, 40];
    const workload = workloads[randomInt(0, workloads.length - 1)];

    // Generování data narození v ISO formátu v zadaném rozsahu min - max.
    const oldestBirth = new Date(now);
    oldestBirth.setUTCFullYear(now.getUTCFullYear() - dtoIn.age.max);

    const youngestBirth = new Date(now);
    youngestBirth.setUTCFullYear(now.getUTCFullYear() - dtoIn.age.min);

    const minTime = oldestBirth.getTime();
    const maxTime = youngestBirth.getTime();
    let birthTime = minTime + Math.random() * (maxTime - minTime);

    // Unikátní datum pro každého zaměstnance.
    let birthTime = minTime + Math.random() * (maxTime - minTime);
    const birthdate = new Date(birthTime).toISOString();


    employees.push({
      gender,
      birthdate,
      name,
      surname,
      workload,
    });
  }

  return employees;
}

//Jádro domácího úkolu 4. Spočítá příslušné statistiky a vrátí nám dtoOut.
export function getEmployeeStatistics(employees) {
  const safeEmployees = Array.isArray(employees) ? employees : [];
  const now = new Date();

  const total = safeEmployees.length;

  const workload10 = safeEmployees.filter((e) => e.workload === 10).length;
  const workload20 = safeEmployees.filter((e) => e.workload === 20).length;
  const workload30 = safeEmployees.filter((e) => e.workload === 30).length;
  const workload40 = safeEmployees.filter((e) => e.workload === 40).length;

  const ages = safeEmployees.map((e) => getAgeInYears(e.birthdate, now));
  const workloads = safeEmployees.map((e) => e.workload);

  const averageAge = total ? roundTo1Decimal(ages.reduce((s, a) => s + a, 0) / total) : 0;
  const minAge = total ? Math.floor(Math.min(...ages)) : 0;
  const maxAge = total ? Math.floor(Math.max(...ages)) : 0;

  // Medián věku
  const medianAge = total ? Math.round(median(ages)) : 0;

  // Medián úvazku
  const medianWorkload = total ? Math.round(median(workloads)) : 0;

  const women = safeEmployees.filter((e) => e.gender === "female");
  const averageWomenWorkload = women.length
    ? roundTo1Decimal(women.reduce((s, e) => s + e.workload, 0) / women.length)
    : 0;

  const sortedByWorkload = [...safeEmployees].sort((a, b) => a.workload - b.workload);

  return {
    total,
    workload10,
    workload20,
    workload30,
    workload40,
    averageAge,
    minAge,
    maxAge,
    medianAge,
    medianWorkload,
    averageWomenWorkload,
    sortedByWorkload,
  };
}

// Hlavní funkce domácího úkolu 4. Volá generátor jmen z domácího úkolu 3.
export function main(dtoIn) {
  const employees = generateEmployeeData(dtoIn);
  return getEmployeeStatistics(employees);
}