import path from "path";
import { db } from "../config/postgres.config";
import QueryResolver from "../containers/query.container";
import { container } from "../containers/ioc.container";

class DbStartup {
  private queryResolver: QueryResolver;

  constructor() {
    this.queryResolver = container.resolve<QueryResolver>("queryResolver");
  }

  runDbScripts = async () => {
    try {
      const sqlStatements = [
        this.queryResolver.resolve("startupTableCreation", {}),
        this.queryResolver.resolve("startupDataInsertion", {}),
      ];

      await db.tx(async (t) => {
        for (const sqlStatement of sqlStatements) {
          await t.none(sqlStatement.query);
          console.log(`query executed successfully.`);
        }
      });
    } catch (error) {
      console.error("Error executing scripts within the transaction:", error);
    }
  };
}

export default DbStartup;
