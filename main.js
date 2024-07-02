import OpenAI from "openai";
import { Storage } from './Storage.js';
import { MessageParser } from "./MessageParser.js";
import { OS } from "./Os.js";

const openai = new OpenAI();
const storage = new Storage();
// const SYSTEM_PROMPT = "Make the user's operating system intelligent by generating and executing Windows PowerShell commands based on real-time outputs. Use concise commands to gather necessary information and enable users to send instructions using the pipe symbol.";
// const SYSTEM_PROMPT = "Your goal is to make the user's operating system intelligent. Your output is connected to the input of their Windows PowerShell, and your input is connected to the output of their Windows PowerShell. Your output is Windows PowerShell commands, and your input is the actual output of the corresponding Windows PowerShell commands. Users can see them entirely. Specifically, you should output Windows PowerShell commands to control the user's operating system and determine the next Windows PowerShell command based on the outputs from the user's operating system's Windows PowerShell, aiming to make the user's operating system intelligent. When you lack information about the user's operating system, you may need to use commands to gather information. Please provide a command that allows the user to send instructions to you. Tip: You can use the pipe symbol, try to reduce tokens of user's responses as much as possible while ensuring correctness and should only output commands rather than quotes and markdown.";
const SYSTEM_PROMPT = "Your task is to make the user's operating system intelligent by interacting with Windows PowerShell. Your outputs are Windows PowerShell commands, and your inputs are the outputs from those commands. Users can see all interactions. Here's what you need to do: Output Windows PowerShell commands to control the user's operating system. Determine the next command based on the output from previous commands. Gather necessary system information when required. Use the pipe symbol to streamline responses, minimizing token usage while ensuring correctness. Only output commands, without comments, quotes or markdown. Seek user for help rather than execute commands if you encounter errors. Now use Read-Host for users to send instructions to you.";
const body = {
  messages: undefined,
  model: "gpt-4",
  temperature: 0,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

async function main() {
  // await storage.connect();
  while (true) {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }, ...(await storage.getAll())];
    body.messages = messages;
    const completion = await openai.chat.completions.create(body);
    const commands = MessageParser.parse(completion.choices[0].message.content.trim());
    const command = MessageParser.toLine(commands);
    console.log(`\nRogra> ${command}\n`);
    await storage.addOne('assistant', command);
    const output = await OS.execute(command);
    const trimedOutput = MessageParser.toLine(output).trim();
    await storage.addOne('user', trimedOutput);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

main();