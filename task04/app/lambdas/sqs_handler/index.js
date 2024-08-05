exports.handler = async (event) => {
  for (const message of event.Records) {
    await processMessageAsync(message);
  }
  console.info('done');
};

async function processMessageAsync(message) {
  try {
    console.log(`Processed message ${message.body}`);
  } catch (err) {
    console.error('An error occurred');
    throw err;
  }
}
