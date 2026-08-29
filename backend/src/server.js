import express from "express";

import bodyParser from "body-parser";
import { setupPlantsApi } from "./plant-api.js";

const app = express();

const slowEnabled = process.env.USE_SLOW === "true";

app.use(bodyParser.json());

app.use((_, res, next) => {
  res.header(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,PUT,POST,PATCH,DELETE",
  );
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use((req, _res, next) => {
  if (req.query.slow !== undefined || slowEnabled) {
    const timeout = parseInt(req.query.slow) || 1200;
    console.log(`Slow down ${timeout}ms`);
    setTimeout(next, timeout);
  } else {
    next();
  }
});

setupPlantsApi(app);

const port = process.env.SERVER_PORT || 7200;

app.listen(port, () => {
  console.log(`
    📞    Reservations API Server listening on port ${port}
    👉    Try http://localhost:${port}/api/plants
`);
});
