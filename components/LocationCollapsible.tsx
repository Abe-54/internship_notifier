import { Internship } from "@/types/Internship";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";

type LocationCollapsibleProps = {
  row: Row<Internship>;
};

const LocationCollapsible = ({ row }: LocationCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { locations } = row.original;
  const showMore = locations.length > 3;

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-[350px] space-y-2"
    >
      <div className="flex text-sm items-center justify-between space-x-4">
        {locations.slice(0, 3).map((location) => (
          <React.Fragment key={location}>{location}</React.Fragment>
        ))}
        {showMore && (
          <>
            {!isOpen && <span> +{locations.length - 3} more</span>}
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-9 p-0">
                <ChevronsUpDown className="h-4 w-4" />
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </>
        )}
      </div>
      <CollapsibleContent className="space-y-2">
        {locations.slice(3).map((location) => (
          <div key={location}>{location}</div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default LocationCollapsible;
