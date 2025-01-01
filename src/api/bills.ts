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
