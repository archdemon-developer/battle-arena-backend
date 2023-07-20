import path from "path";
import { db } from "../config/postgres.config";
import fs from "fs";

export const executeStartupScripts = async () => {
  try {
    const scriptFiles = ["schema.sql", "data.sql"]; // Add more script files here if needed

    await db.tx(async (t) => {
      for (const scriptFile of scriptFiles) {
        const scriptPath = path.join(__dirname, `../sql/${scriptFile}`);
        const script = fs.readFileSync(scriptPath, "utf-8");
        await t.none(script);
        console.log(`${scriptFile} executed successfully.`);
      }
    });
  } catch (error) {
    console.error("Error executing scripts within the transaction:", error);
  }
};
