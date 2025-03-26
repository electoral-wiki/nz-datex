/**
 * electoral.wiki - NZ Data Extractor
 * Copyright (C) 2025 Raresh Nistor
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
