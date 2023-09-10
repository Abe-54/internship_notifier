"use client";

import { columns } from "@/components/InternshipColumns";
import { InternshipTable } from "@/components/ui/InternshipTable";
import useInternships from "@/hooks/useInternships";
import { useEffect } from "react";

export default function Home() {
  const { data: internships, isLoading } = useInternships();

  let content = <></>;
  if (internships === undefined || isLoading) {
    content = <div>Loading...</div>;
  } else {
    content = <InternshipTable columns={columns} data={internships} />;
  }

  return (
    <main className="p-5">
      <div className="flex justify-between">
        <div className=" flex-col space-y-1.5 p-6">
          <h3 className="text-4xl font-bold">Internships</h3>
          <p className="text-sm text-muted-foreground">Summer 2024</p>
        </div>
      </div>

      <div className="p-6 pt-0">{content}</div>
    </main>
  );
}
