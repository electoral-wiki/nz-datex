import { type Request } from "express";

export function getPageOffset(req: Request<unknown>, pageSize: number): number {
  const queryParameter = req.query["page"] ?? "1";
  if (typeof queryParameter != "string") {
    // no fancy string things, we just want the simple parameter
    return 0;
  }

  const page = parseInt(queryParameter);
  if (Number.isNaN(page)) {
    return 0;
  }

  return (page - 1) * pageSize;
}
