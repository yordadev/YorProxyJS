const fs = require("fs");

exports.writeHistory = function writeHistory(file, data, callback) {
  if (fs.existsSync(file) == false) {
    fs.writeFile(file, "", function (err, file) {
      if (err) throw err;
      console.log("[YorProxy] Watcher Log File Created\n");
    });
  }

  try {
    fs.appendFileSync(file, data, () => {});
  } catch (err) {
    console.log("[YorProxy] Watcher Error\n");
    console.log(err);
  }
};
