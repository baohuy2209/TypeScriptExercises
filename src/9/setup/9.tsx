// Định nghĩa interface User
interface User {
  type: "user";
  name: string;
  age: number;
  occupation: string;
}
// Định nghĩa interface Admin
interface Admin {
  type: "admin";
  name: string;
  age: number;
  role: string;
}
// định nghĩa kiểu union được tổng hợp từ 2 kiểu User và Admin
type Person = User | Admin;
// khởi tạo một mảng kiểu Admin bao gồm các admin
const admins: Admin[] = [
  { type: "admin", name: "Jane Doe", age: 32, role: "Administrator" },
  { type: "admin", name: "Bruce Willis", age: 64, role: "World saver" },
];
// khởi tạo một mảng kiểu User bao gồm các user
const users: User[] = [
  {
    type: "user",
    name: "Max Mustermann",
    age: 25,
    occupation: "Chimney sweep",
  },
  { type: "user", name: "Kate Müller", age: 23, occupation: "Astronaut" },
];

// ! Định nghĩa ra một kiểu ApiResponse có hai trạng thái
// - Trạng thái: thành công, xuất ra database
// - Trạng thái: lỗi, xuất ra lỗi đó.
export type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };
// ! Hàm requestAdmins nhận một hàm làm đối số
// ! Hàm callback lại nhận một trạng thái Api có generic type là mảng Admin
export function requestAdmins(
  callback: (response: ApiResponse<Admin[]>) => void
) {
  // thực thi hàm đối số với đối số cụ thể
  callback({
    status: "success",
    data: admins,
  });
}
export function requestUsers(
  callback: (response: ApiResponse<User[]>) => void
) {
  callback({
    status: "success",
    data: users,
  });
}
export function requestCurrentServerTime(
  callback: (response: ApiResponse<number>) => void
) {
  callback({
    status: "success",
    data: Date.now(),
  });
}
export function requestCoffeeMachineQueueLength(
  callback: (response: ApiResponse<number>) => void
) {
  callback({
    status: "error",
    error: "Numeric value has exceeded Number.MAX_SAFE_INTEGER.",
  });
}
function logPerson(person: Person) {
  console.log(
    `- ${person.name}, ${person.age}, ${
      person.type === "admin" ? person.role : person.occupation
    }`
  );
}
function startTheApp(callback: (error: Error | null) => void) {
  requestAdmins((adminResponse) => {
    // lúc này adminResponse nhận đối số là một object
    console.log("Admins: ");
    if (adminResponse.status === "success") {
      adminResponse.data.forEach(logPerson); // in dữ liệu của mỗi người có kiểu Admin
    } else {
      // Xử lí nếu có lỗi. Trả lại hàm callback (hàm callback này lại là đối số khác)nhận lỗi làm đối số
      return callback(new Error(adminResponse.error));
    }
    console.log();
    requestUsers((usersResponse) => {
      console.log("Users: ");
      if (usersResponse.status === "success") {
        usersResponse.data.forEach(logPerson);
      } else {
        return callback(new Error(usersResponse.error));
      }
      console.log();
      requestCurrentServerTime((serverTimeResponse) => {
        console.log("Server time: ");
        if (serverTimeResponse.status === "success") {
          console.log(
            `   ${new Date(serverTimeResponse.data).toLocaleString()}`
          );
        } else {
          return callback(new Error(serverTimeResponse.error));
        }

        console.log();

        requestCoffeeMachineQueueLength((coffeeMachineQueueLengthResponse) => {
          console.log("Coffee machine queue length:");
          if (coffeeMachineQueueLengthResponse.status === "success") {
            console.log(`   ${coffeeMachineQueueLengthResponse.data}`);
          } else {
            return callback(new Error(coffeeMachineQueueLengthResponse.error));
          }

          callback(null);
        });
      });
    });
  });
}
startTheApp((e: Error | null) => {
  console.log();
  if (e) {
    console.log(
      `Error: "${e.message}", but it's fine, sometimes errors are inevitable.`
    );
  } else {
    console.log("All done!");
  }
});
