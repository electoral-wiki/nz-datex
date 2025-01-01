import { prisma } from "../database";
import { DOMParser, type Element } from "@xmldom/xmldom";

const SEARCH_URL = "https://bills.parliament.nz/api/data/v1/search";
const BASE_SEARCH_PARAMS = {
  id: null,
  documentPreset: 12,
  keyword: null,
  selectCommittee: null,
  itemType: null,
  itemSubType: null,
  status: [],
  documentTypes: [],
  beforeCommittee: null,
  billStage: null,
  billStages: [],
  billTab: null,
  includeBillStages: null,
  subject: null,
  person: null,
  parliament: null,
  dateFrom: null,
  dateTo: null,
  datePeriod: null,
  restrictedFrom: null,
  restrictedTo: null,
  terminatedReason: null,
  terminatedReasons: [],
  column: 4,
  direction: 1,
  pageSize: 10,
  page: 1,
};

const hansardUrl = (docId: string) =>
  `https://www.parliament.nz/en/pb/hansard-debates/rhr/combined/${docId}`;

interface SearchResponse {
  results: { id: string; title: string }[];
  pageSize: number;
  page: number;
  totalResults: number;
}

async function main() {
  const billUuids = await getBillsWithUnfinishedHansards();
  console.log(billUuids);
  for (const billUuid of billUuids) {
    const hansards = await getHansardsOfBill(billUuid);
  }
}

async function getBillsWithUnfinishedHansards(): Promise<string[]> {
  const noHansardBills = prisma.bill.findMany({
    where: { hansards: { none: {} } },
  });

  const draftHansardsBill = prisma.bill.findMany({
    where: { hansards: { some: { status: { equals: "draft" } } } },
  });

  return Promise.all([noHansardBills, draftHansardsBill]).then((bills) =>
    bills.flat().map((bill) => bill.uuid)
  );
}

async function getHansardsOfBill(uuid: string): Promise<SearchResponse[]> {
  let currentPage = 1;
  let totalItems = +Infinity;
  const items: SearchResponse[] = [];

  while (items.length < totalItems) {
    const params = { ...BASE_SEARCH_PARAMS, billId: uuid, page: currentPage };
    const page: SearchResponse = await fetch(SEARCH_URL, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify(params),
    }).then((response) => response.json());

    if (page.pageSize == 0) break;

    totalItems = page.totalResults;
    currentPage = page.page + 1;
    items.push(page);
  }

  return items;
}

async function getHansardBody(docId: string) {
  const body = await fetch(hansardUrl(docId)).then((res) => res.text());
  const document = new DOMParser().parseFromString(body, "text/html");

  const hansardNode = document.getElementsByClassName("body-text--hansard");
}

try {
  await main();
  prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}
