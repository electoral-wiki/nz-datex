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

import { Router } from "express";
import { getPageOffset } from "./utils";
import { prisma } from "../database";

const router = Router();
export default router;

const PAGE_SIZE = 20;

router.get("/", async (req, res) => {
  const offset = getPageOffset(req, PAGE_SIZE);

  res.json({
    offset,
    count: PAGE_SIZE,
    total: (await prisma.bill.aggregate({ _count: { id: true } }))._count.id,
    data: await prisma.bill.findMany({
      take: PAGE_SIZE,
      skip: offset,
    }),
  });
});

router.get("/:number", async (req, res) => {
  const { number } = req.params;
  const bill = await prisma.bill.findUnique({
    where: { number },
    select: { uuid: true, name: true, number: true, parliamentNumber: true },
  });
  if (bill == null) {
    res.sendStatus(404);
    return;
  }

  res.json(bill);
});

router.get("/:number/hansards/:id", async (req, res) => {
  const { number, id } = req.params;
  const hansard = await prisma.hansard.findUnique({
    where: { documentId: id, billNumber: number },
  });
  if (hansard == null) {
    res.sendStatus(404);
    return;
  }

  res.json(hansard);
});
