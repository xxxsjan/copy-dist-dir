const path = require("path");
const fs = require("fs");

const prompts = require("prompts");

async function main() {
  const response = await prompts({
    type: "text",
    name: "value",
    message: "打包的文件夹名",
  });

  if (!response.value) {
    return;
  }
  const dirName = response.value;
  const frontEndProjectPath = "D:\\dateeye\\adxray-v2";
  const backEndProjectPath = "D:\\dateeye\\adx-web";

  const originDir = path.join(frontEndProjectPath, "assets-dist", dirName);

  const targetDir = path.join(
    backEndProjectPath,
    "src/main/resources/static/assets-dist",
    dirName
  );

  const originHtml = path.join(frontEndProjectPath, "home.html");
  const targetHtml = path.join(
    backEndProjectPath,
    "src/main/resources/templates/home.html"
  );
  // const originDate = getHtmlFileDate(originHtml);
  const originDate = dirName
  const targetDate = getHtmlFileDate(targetHtml);
  console.log(originDate, targetDate);

  if (!checkDirExists(originDir)) {
    console.log("打包文件夹不存在", originDir);
    return;
  }
  copyFolder(originDir, targetDir);

  if (originDate !== targetDate) {
    try {
      moveFile(originHtml, targetHtml);
      console.log("home.html文件拷贝成功", originDate, "==>", targetDate, "✅");
    } catch (error) {
      console.log("error: ", error);
    }
  } else {
    console.log("❌home.html内指纹一致，不操作");
  }
}
setInterval(() => {
}, 1000);
main();

function checkDirExists(dirPath) {
  try {
    fs.accessSync(dirPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
function copyFolder(sourcePath, targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      console.error(targetPath, "目标路径已存在，无法复制文件夹！");
      return;
    }
    fs.cpSync(sourcePath, targetPath, { recursive: true });
    console.log(targetPath + "文件夹已成功复制！");
  } catch (err) {
    console.error("复制文件夹失败！", err);
  }
}
function moveFile(sourcePath, targetPath) {
  try {
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }
    fs.copyFileSync(sourcePath, targetPath);
  } catch (err) {
    console.error("移动home.html文件失败！", err);
  }
}
function getHtmlFileDate(filePath) {
  const data = fs.readFileSync(filePath, "utf-8");
  const regex = /\/assets-dist\/(\d+)\//;
  const match = data.match(regex);

  if (match) {
    return match[1];
  } else {
    return "";
  }
}
