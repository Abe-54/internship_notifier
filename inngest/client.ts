import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({
  name: "Internship Notifier",
  key: process.env.INNGEST_EVENT_KEY,
});
