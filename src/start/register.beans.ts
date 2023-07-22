import { container } from "../containers/ioc.container";

export const registerBeans = (beansConfig: { [key: string]: any }): void => {
  Object.keys(beansConfig).forEach((serviceKey) => {
    const ServiceClass = beansConfig[serviceKey];
    container.register(serviceKey, new ServiceClass());
  });
};
