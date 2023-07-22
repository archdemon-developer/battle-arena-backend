import Server from "./main/server";
import { registerBeans } from "./start/register.beans";
import { Beans } from "./config/ioc.config";
import { container } from "./containers/ioc.container";

registerBeans(Beans);
container.resolve<Server>("serverStartup").start();
