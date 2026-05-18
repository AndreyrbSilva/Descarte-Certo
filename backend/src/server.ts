import { setDefaultResultOrder } from 'dns'
setDefaultResultOrder('ipv4first')

import { app } from "./app";

const PORT = Number(process.env.PORT) || 3333;
app.listen({ port: PORT, host: "::" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});