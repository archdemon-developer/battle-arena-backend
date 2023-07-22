import { queries } from "../config/query.config";
import { QueryMap } from "../models/general.model";

class QueryResolver {
  private queryMap: QueryMap;

  constructor() {
    this.queryMap = queries;
  }

  public resolve = (
    queryKey: string,
    params: { [key: string]: any }
  ): { query: string; parameters: any[] } => {
    const queryData = this.queryMap[queryKey];

    if (!queryData) {
      throw new Error(`Query '${queryKey}' not found.`);
    }

    const { query, parameters } = queryData;

    if (parameters) {
      const parameterValues = parameters.map((param) => params[param]);
      return {
        query,
        parameters: parameterValues,
      };
    }

    return { query, parameters: [] };
  };
}

export default QueryResolver;
