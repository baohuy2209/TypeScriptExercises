interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}
interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}
export type Person = User | Admin;
export const persons: Person[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
  { type: "user", name: "Wilson", age: 23, occupation: "Ball" },
  { type: "admin", name: "Agent Smith", age: 23, role: "Anti-virus engineer" },
];
export function logPerson(person: Person) {
  console.log(
    ` - ${person.name}, ${person.age}, ${
      person.type === "admin" ? person.role : person.occupation
    }`
  );
}
const getObjectKeys = <T>(obj: T) => Object.keys(obj) as (keyof T)[];
export function filterPersons(
  persons: Person[],
  personType: string,
  criteria: Partial<Person>
): Person[] {
  return persons
    .filter((person) => person.type === personType)
    .filter((person) => {
      let criteriaKeys = getObjectKeys(criteria);
      return criteriaKeys.every((fieldName) => {
        return person[fieldName] === criteria[fieldName];
      });
    });
}
export const userOfAge23 = filterPersons(persons, "user", { age: 23 });
export const adminOfAge23 = filterPersons(persons, "admin", { age: 23 });
console.log("User of age 23: ");
userOfAge23.forEach(logPerson);

console.log("Admins of age 23: ");
adminOfAge23.forEach(logPerson);
