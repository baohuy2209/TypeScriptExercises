"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logPerson = exports.users = void 0;
exports.users = [
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
function logPerson(user) {
    console.log(`- ${user.name}, ${user.age}`);
}
exports.logPerson = logPerson;
console.log("Users:");
exports.users.forEach(logPerson);
