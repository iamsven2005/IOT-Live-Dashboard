const { EventHubConsumerClient, earliestEventPosition } = require("@azure/event-hubs");

export default async function main() {
  const consumerGroup = "$Default"; // You can specify your consumer group here
  const client = new EventHubConsumerClient(
    consumerGroup,
    "Endpoint=sb://ihsuprodsgres005dednamespace.servicebus.windows.net/;SharedAccessKeyName=iothubowner;SharedAccessKey=em3GGuJtNXVXErB3bzavU0NAwy7+yzyg1PUPUbLhxBw=;EntityPath=iothub-ehub-it3681-00-25073661-9ede3c7483"
  );

  const partitionIds = await client.getPartitionIds();
  console.log("Partition IDs:", partitionIds);

  const subscription = client.subscribe(
    {
      processEvents: async (events: any, context: any) => {
        for (const event of events) {
          console.log(`Received event from partition: ${context.partitionId}`);
          console.log(`Event data: ${JSON.stringify(event.body)}`);
        }
      },
      processError: async (err: any, context:any) => {
        console.error(`Error : ${err.message}`);
      },
    },
    { startPosition: earliestEventPosition }
  );

  // Allow the subscription to run for a certain time period
  setTimeout(async () => {
    await subscription.close();
    await client.close();
    console.log("Subscription closed");
  }, 60000); // Run for 60 seconds
}

