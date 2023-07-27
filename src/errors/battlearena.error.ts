export class BattleArenaError {
  private statusCode: number;
  private errorMessage: string;

  constructor(statusCode: number, errorMessage: string) {
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }

  public getMessage = (): string => {
    return this.errorMessage;
  };

  public getStatusCode = (): number => {
    return this.statusCode;
  };
}
