import fs from "fs";
import { Pool, PoolClient } from "pg";

const runScript = async (
  client: PoolClient,
  scriptPath: string
): Promise<void> => {
  try {
    const sql = fs.readFileSync(scriptPath, "utf8");
    await client.query(sql);
    console.log(`Script ${scriptPath} executed successfully.`);
  } catch (error) {
    console.error(`Error executing script ${scriptPath}:`, error);
  }
};

export const runStartupScripts = async (
  filePaths: string[],
  pool: Pool
): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const scriptPath of filePaths) {
      await runScript(client, scriptPath);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error running startup scripts:", error);
  } finally {
    client.release();
  }
};
