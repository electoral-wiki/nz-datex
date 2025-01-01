import express from "express";

import parliament from "./api/parliament";
import bills from "./api/bills";

const app = express();
const port = process.env["DATEX_PORT"] ?? 3000;

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/parliaments", parliament);
app.use("/bills", bills);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
