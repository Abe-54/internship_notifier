"use client";

import { Internship } from "@/types/Internship";
import { useQuery } from "@tanstack/react-query";

const useInternships = () => {
  return useQuery({
    queryKey: ["internships"],
    queryFn: async () => {
      const response = await fetch(
        "https://raw.githubusercontent.com/SimplifyJobs/Summer2024-Internships/dev/.github/scripts/listings.json"
      );
      const internships = await response.json();
      console.log("CURRENT INTERNSHIP LIST: ", internships);
      return internships as Internship[];
    },
  });
};

export default useInternships;
