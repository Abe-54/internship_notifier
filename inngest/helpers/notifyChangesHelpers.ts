import { getErrorMessage } from "@/lib/utils";
import { Internship } from "@/types/Internship";
import axios from "axios";
import { diff, Diff } from "deep-diff";
import fs from "fs";
import { NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";
import { promisify } from "util";
import DifferenceEmail from "./differenceEmail";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const FILE_PATH = "./data/previous_internships.json";

const resend = new Resend(process.env.RESEND_API_KEY);

// Assuming you have an endpoint to fetch the current JSON data
export async function fetchJSONFile(): Promise<Internship[]> {
  const response = await axios.get(
    "https://raw.githubusercontent.com/SimplifyJobs/Summer2024-Internships/dev/.github/scripts/listings.json"
  );
  return response.data as Internship[];
}

// Fetch the previous JSON data (this could be from a database or a file)
export async function getPreviousJSON(): Promise<Internship[]> {
  try {
    // Try reading the file
    const data = await readFile(FILE_PATH, "utf8");
    return JSON.parse(data) as Internship[];
  } catch (error: unknown) {
    const { message, code } = getErrorMessage(error);

    console.error(`Error Message: ${message}`);
    if (code) {
      console.error(`Error Code: ${code}`);
    }

    if (code === "ENOENT") {
      await writeFile(FILE_PATH, JSON.stringify([]), "utf8");
      return [];
    }

    throw new Error(message);
  }
}

// Function to send an email
export const sendEmail = async (
  latestInternships: Internship[],
  previousInternships: Internship[]
) => {
  try {
    const data = await resend.emails.send({
      from: "Internship Updates API <onboarding@resend.dev>",
      to: ["a.rubio1224@gmail.com"],
      subject: "Internship Updates",
      react: React.createElement(DifferenceEmail, {
        addedInternships: difference(previousInternships, latestInternships)
          .added as Internship[],
        removedInternships: difference(previousInternships, latestInternships)
          .removed as Internship[],
      }),
    });

    return NextResponse.json(data);
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }
};

// Function to update the previous JSON
export async function updatePreviousJSON(data: Internship[]): Promise<void> {
  await writeFile(FILE_PATH, JSON.stringify(data), "utf8");
}

// Function to determine the difference between two JSON objects
function difference(
  obj1: Internship[],
  obj2: Internship[]
): { added: Internship[]; removed: Internship[] } {
  console.log("Starting difference function...");

  const diffs = diff(obj1, obj2);
  const added: Internship[] = [];
  const removed: Internship[] = [];

  console.log("Diffs calculated:", diffs);

  if (diffs) {
    diffs.forEach((update) => {
      if (update.kind === "A" && update.item.kind === "N") {
        if (Array.isArray(update.item.rhs)) {
          added.push(...update.item.rhs);
          console.log("New item detected:", ...update.item.rhs);
        } else {
          added.push(update.item.rhs);
          console.log("New item detected:", update.item.rhs);
        }
      } else if (update.kind === "A" && update.item.kind === "D") {
        if (Array.isArray(update.item.lhs)) {
          added.push(...update.item.lhs);
          console.log("Deleted item detected:", ...update.item.lhs);
        } else {
          added.push(update.item.lhs);
          console.log("Deleted item detected:", update.item.lhs);
        }
      }
    });
  } else {
    console.log("No diffs detected.");
  }

  console.log(
    "Difference function completed. Added:",
    added,
    "Removed:",
    removed
  );
  return { added, removed };
}
