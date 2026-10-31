// 小黑盒通知 -> Server酱 (ServerChan) 推到微信
// 需要：GitHub 仓库 Settings -> Secrets 新建 SCKEY，值填你的 SendKey
const https = require("https");

module.exports = { sendNotify };

async function sendNotify(title, content) {
  const key = process.env.SCKEY || process.env.SENDKEY || "";
  if (!key) {
    console.log("[sendNotify] 未设置 SCKEY，已跳过微信推送");
    return { success: false, message: "no SCKEY" };
  }
  const postData = new URLSearchParams({ title, desp: content || "" }).toString();
  const opts = {
    hostname: "sctapi.ftqq.com",
    path: `/推送内容/${key}.send`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };
  await new Promise((resolve, reject) => {
    const req = https.请求(opts, (res) => {
      res.on("data", () => {});
      res.on("end", () => resolve());
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });
  console.log(`[sendNotify] 已推送微信: ${title}`);
  return { success: true };
}
