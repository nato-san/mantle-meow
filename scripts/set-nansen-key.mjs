import fs from "node:fs";
import readline from "node:readline";

const envPath = ".env.local";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const askHidden = (question) =>
  new Promise((resolve) => {
    const originalWrite = rl._writeToOutput;
    rl._writeToOutput = function writeToOutput(text) {
      if (rl.stdoutMuted) {
        rl.output.write("*");
      } else {
        originalWrite.call(rl, text);
      }
    };

    rl.question(question, (answer) => {
      rl._writeToOutput = originalWrite;
      rl.output.write("\n");
      resolve(answer.trim());
    });
    rl.stdoutMuted = true;
  });

const setEnvValue = (source, key, value) => {
  const line = `${key}=${value}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");
  if (pattern.test(source)) return source.replace(pattern, line);
  return `${source.trimEnd()}\n${line}\n`;
};

const apiKey = await askHidden("Paste your Nansen API key here, then press Enter: ");
rl.close();

if (!apiKey) {
  console.log("No API key was saved.");
  process.exit(1);
}

let env = "";
if (fs.existsSync(envPath)) {
  env = fs.readFileSync(envPath, "utf8");
}

env = setEnvValue(env, "NANSEN_API_KEY", apiKey);
env = setEnvValue(env, "NANSEN_SMART_MONEY_ENDPOINT", "https://api.nansen.ai/api/v1/smart-money/netflow");

fs.writeFileSync(envPath, env);
console.log("Nansen API key saved to .env.local.");
console.log("Restart the dev server so the app can read it.");
