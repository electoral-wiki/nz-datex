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
