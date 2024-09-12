export interface User {
  name: string;
  age: number;
  occupation: string;
}
export const users: User[] = [
  {
    name: "Nguyen Bao Huy",
    age: 23,
    occupation: "Chimney sweep",
  },
  {
    name: "Nguyen Ha Thu Lan",
    age: 23,
    occupation: "Astronaut",
  },
];
export function logPerson(user: User) {
  console.log(`- ${user.name}, ${user.age}`);
}
console.log("Users:");
users.forEach(logPerson);
