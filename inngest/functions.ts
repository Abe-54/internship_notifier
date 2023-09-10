import { inngest } from "@/inngest/client";
import {
  fetchJSONFile,
  getPreviousJSON,
  sendEmail,
  updatePreviousJSON,
} from "@/inngest/helpers/notifyChangesHelpers";

export const helloWorld = inngest.createFunction(
  { name: "Hello World" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("1s");
    return { event, body: "Hello, World!" };
  }
);

//create a function that will send an email to the user everytime a new internship is posted or removed
export const notifyChanges = inngest.createFunction(
  { name: "Notify JSON changes" },
  { cron: "*/1 * * * * " },
  async ({ step }) => {
    console.log("Fetching current JSON...");
    const currentJSON = await step.run("Fetch JSON", async () => {
      return await fetchJSONFile();
    });

    // console.log("Current JSON fetched:", currentJSON);

    console.log("Fetching previous JSON...");
    const previousJSON = await step.run("Get previous JSON", async () => {
      return await getPreviousJSON();
    });
    console.log("Previous JSON fetched:", previousJSON);

    if (JSON.stringify(currentJSON) !== JSON.stringify(previousJSON)) {
      console.log("Change detected between current and previous JSON.");

      console.log("Sending change email...");
      await step.run("Send change email", async () => {
        return await sendEmail(currentJSON, previousJSON);
      });
      console.log("Change email sent.");

      console.log("Updating previous JSON...");
      await step.run("Update previous JSON", async () => {
        return await updatePreviousJSON(currentJSON);
      });
      console.log("Previous JSON updated.");
    } else {
      console.log("No changes detected between current and previous JSON.");
    }
  }
);
