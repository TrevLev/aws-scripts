import fs from "fs";
import * as R from "ramda";
import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient({ region: "us-west-1" });

export const writeData = async () => {
  const allCards = JSON.parse(fs.readFileSync("./cah-cards-full.json", "utf8"));
  const allWhiteCards = allCards[0].white;

  const dataSegments = R.splitEvery(25, allWhiteCards);
  const TABLE_NAME = "WhiteCard-7uw7ijzeirafrlmv43c3nmtm54-dev";
  try {
    for (let i = 0; i < 10; i++) {
      const segment = dataSegments[i];
      for (let j = 0; j < 25; j++) {
        const params = {
          RequestItems: {
            [TABLE_NAME]: [
              {
                PutRequest: {
                  Item: {
                    text: segment[j].text,
                  },
                },
              },
            ],
          },
        };
        ddbClient.send(new BatchWriteItemCommand(params));
      }
      console.log("Success, table updated.");
    }
  } catch (error) {
    console.log("Error", error);
  }
};
writeData();
