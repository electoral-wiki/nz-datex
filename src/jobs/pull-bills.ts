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

import { prisma } from "../database";
import { DOMParser, type Element } from "@xmldom/xmldom";

interface Bill {
  uuid: string;
  name: string;
  number: string;
  parliamentNumber: number;
}

const RSS_URL = "https://bills.parliament.nz/rss?set=Bills";
const billDetailsUrl = (uuid: string) =>
  `https://bills.parliament.nz/api/data/Bill/${uuid}`;

async function main() {
  const bills = await getCurrentBills();
  writeToDatabase(bills);
}

async function getCurrentBills(): Promise<Bill[]> {
  const textBody = await fetch(RSS_URL).then((response) => response.text());
  const document = new DOMParser().parseFromString(textBody, "text/xml");

  const bills = [];
  const items = document.getElementsByTagName("item");
  for (const item of items) {
    bills.push(getBillDetails(item));
  }

  return (await Promise.all(bills)).filter((bill) => bill != null);
}

async function getBillDetails(item: Element): Promise<Bill | null> {
  const uuid = item.getElementsByTagName("guid").item(0)?.textContent;
  if (typeof uuid != "string") {
    console.log("RSS feed did not contain UUID for bill.");
    return null;
  }

  const billDetails = await fetch(billDetailsUrl(uuid));
  const body = await billDetails.json();

  return {
    uuid,
    name: body["Title"],
    number: body["BillNumber"],
    parliamentNumber: body["ParliamentNumber"],
  };
}

async function writeToDatabase(bills: Bill[]) {
  prisma.$transaction(async (prisma) => {
    for (const bill of bills) {
      const existingBill = await prisma.bill.findUnique({
        where: { number: bill.number },
      });
      if (existingBill) {
        await prisma.bill.update({
          where: { number: bill.number },
          data: bill,
        });
      } else {
        await prisma.bill.create({
          data: bill,
        });
      }
    }
  });
}

try {
  await main();
  prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
