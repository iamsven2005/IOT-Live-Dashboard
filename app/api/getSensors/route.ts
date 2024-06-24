//Sets a cron job to get IOT sensor data
import { EventHubConsumerClient, earliestEventPosition } from "@azure/event-hubs";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const consumerGroup = "$Default";
  const client = new EventHubConsumerClient(
    consumerGroup,
    process.env.GG_COM!
  );

  const partitionIds = await client.getPartitionIds();
  console.log("Partition IDs:", partitionIds);

  const eventsData: { partitionId: string; data: any; }[] = [];

  const subscription = client.subscribe(
    {
      processEvents: async (events, context) => {
        for (const event of events) {
          console.log(`Received event from partition: ${context.partitionId}`);
          eventsData.push({ partitionId: context.partitionId, data: event.body });
        }
      },
      processError: async (err, context) => {
        console.error(`Error : ${err.message}`);
      },
    },
    { startPosition: earliestEventPosition }
  );

  // Allow the subscription to run for a certain time period before returning the collected data
  await new Promise(resolve => setTimeout(resolve, 6000)); // Wait for 60 seconds

  await subscription.close();
  await client.close();
  console.log("Subscription closed");

  return NextResponse.json(eventsData);
}
