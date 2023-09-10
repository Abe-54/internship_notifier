"use client";

import { Internship } from "@/types/Internship";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import LocationCollapsible from "./LocationCollapsible";
import { Button } from "./ui/button";

export const columns: ColumnDef<Internship>[] = [
  {
    accessorKey: "company_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <span className="text-lg font-bold">Company</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "title",
    header: () => <span className="text-lg font-bold">Position</span>,
  },
  {
    accessorKey: "locations",
    header: () => <span className="text-lg font-bold">Locations</span>,
    cell: ({ row }) => {
      return <LocationCollapsible row={row} />;
    },
  },
  {
    accessorKey: "terms",
    header: () => <span className="text-lg font-bold">Terms</span>,
    cell: ({ row }) => {
      return (
        <div>
          {row.original.terms.map((term) => (
            <span key={term}>{term}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "active",
    header: () => <span className="text-lg font-bold">Active</span>,
    cell: ({ row }) => {
      return (
        <div className="text-center">
          {row.original.active ? (
            <div className="text-center">
              <Button variant="default" asChild>
                <Link
                  href={row.original.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply
                </Link>
              </Button>
            </div>
          ) : (
            <div>❌ CLOSED</div>
          )}
        </div>
      );
    },
  },
];
