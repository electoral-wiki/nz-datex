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
    total: (await prisma.parliament.aggregate({ _count: { id: true } }))._count
      .id,
    data: await prisma.parliament.findMany({
      select: { number: true, startDate: true, endDate: true },
      orderBy: { number: "desc" },
      take: PAGE_SIZE,
      skip: offset,
    }),
  });
});

router.get("/:number", async (req, res) => {
  const number = parseInt(req.params.number);
  if (Number.isNaN(number)) {
    res.sendStatus(404);
    return;
  }

  const parliament = await prisma.parliament.findUnique({
    where: { number },
    select: {
      number: true,
      startDate: true,
      endDate: true,
      bills: {
        select: {
          uuid: true,
          name: true,
          number: true,
        },
      },
    },
  });

  if (parliament == null) {
    res.sendStatus(404);
    return;
  }

  res.json(parliament);
});
