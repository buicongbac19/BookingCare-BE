import { PythonShell } from "python-shell";
import { spawn } from "child_process";

// let sendMessage = (question) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!question) {
//         resolve({
//           errCode: 1,
//           errMessage: "Missing required parameter",
//         });
//       } else {
//         let options = {
//           pythonPath: "C:\\Users\\Admin\\AppData\\Local\\Programs\\Python",
//           scriptPath: "NodeJS\\src\\python",
//           args: [question],
//         };
//         PythonShell.run("chatbot.py", options, function (err, result) {
//           if (err) {
//             resolve({
//               errCode: 2,
//               errMessage: "An error occurred while executing the Python script",
//             });
//           } else {
//             resolve({
//               errCode: 0,
//               errMessage: "Ok",
//               response: result[0],
//             });
//           }
//         });
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

let sendMessage = (question) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!question) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter",
        });
      } else {
        const childPython = spawn("python", [
          "src\\python\\chatbot.py",
          question,
        ]);

        childPython.stdout.on("data", (data) => {
          console.log(`stdout: ${data}`);
        });

        childPython.stderr.on("data", (data) => {
          console.error(`stderr: ${data}`);
        });

        childPython.on("close", (code) => {
          console.log(`child process exited with code ${code}`);
        });
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  sendMessage,
};
