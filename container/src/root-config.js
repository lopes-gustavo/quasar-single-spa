import { registerApplication, start } from "single-spa";

registerApplication({
  name: "@my/application",
  app: () => System.import('@my/application'),
  activeWhen: "/app",
});

registerApplication({
  name: "@estrategiahq/bo-accounts",
  app: () => System.import('@estrategiahq/bo-accounts'),
  activeWhen: "/accounts",
});

start();
