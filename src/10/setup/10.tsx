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
type Person = User | Admin;
const admins: Admin[] = [
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
];

const users: User[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
];
export type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };

type CallbackBaseAsyncFunction<T> = (
  callback: (response: ApiResponse<T>) => void
) => void;
type PromiseBasedAsyncFunction<T> = () => Promise<T>;

export function promisify<T>(
  fn: CallbackBaseAsyncFunction<T>
): PromiseBasedAsyncFunction<T> {
  return () =>
    new Promise<T>((resolve, reject) => {
      fn((response) => {
        if (response.status === "success") {
          resolve(response.data);
        } else {
          reject(new Error(response.error));
        }
      });
    });
}
type SourceObject<T> = { [K in keyof T]: CallbackBaseAsyncFunction<T[K]> };
type PromisifiedObject<T> = { [K in keyof T]: PromiseBasedAsyncFunction<T[K]> };

export function promisifyAll<T extends { [key: string]: any }>(
  obj: SourceObject<T>
): PromisifiedObject<T> {
  const result: Partial<PromisifiedObject<T>> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = promisify(obj[key]);
  }
  return result as PromisifiedObject<T>;
}
const oldApi = {
  requestAdmins(callback: (response: ApiResponse<Admin[]>) => void) {
    callback({
      status: "success",
      data: admins,
    });
  },
  requestUsers(callback: (response: ApiResponse<User[]>) => void) {
    callback({
      status: "success",
      data: users,
    });
  },
  requestCurrentServerTime(callback: (response: ApiResponse<number>) => void) {
    callback({
      status: "success",
      data: Date.now(),
    });
  },
  requestCoffeeMachineQueueLength(
    callback: (response: ApiResponse<number>) => void
  ) {
    callback({
      status: "error",
      error: "Numeric value has exceeded Number.MAX_SAFE_INTEGER.",
    });
  },
};
export const api = promisifyAll(oldApi);
function logPerson(person: Person) {
  console.log(
    ` - ${person.name}, ${person.age}, ${
      person.type === "admin" ? person.role : person.occupation
    }`
  );
}
async function startTheApp() {
  console.log("Admins: ");
  (await api.requestAdmins()).forEach(logPerson);
  console.log();
  console.log("Users:");
  (await api.requestUsers()).forEach(logPerson);
  console.log();

  console.log("Server time:");
  console.log(
    `   ${new Date(await api.requestCurrentServerTime()).toLocaleString()}`
  );
  console.log();

  console.log("Coffee machine queue length:");
  console.log(`   ${await api.requestCoffeeMachineQueueLength()}`);
}
startTheApp().then(
  () => {
    console.log("Success!");
  },
  (e: Error) => {
    console.log(
      `Error: "${e.message}", but it's fine, sometimes errors are inevitable.`
    );
  }
);
