interface Container {
  register: (name: string, dependency: any) => void;
  resolve: <T>(name: string) => T;
}

class IoCContainer implements Container {
  private dependencies: { [key: string]: any } = {};

  public register(name: string, dependency: any): void {
    this.dependencies[name] = dependency;
  }

  public resolve<T>(name: string): T {
    return this.dependencies[name];
  }
}

export const container = new IoCContainer();
