const cron = require('node-cron');

// set up a scheduled task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    // find all documents with isChecked set to true
    const docs = await MyModel.find({ isChecked: true });

    // set isChecked to false for all matching documents
    await Promise.all(docs.map(doc => {
      doc.isChecked = false;
      return doc.save();
    }));

    console.log(`Updated ${docs.length} documents`);
  } catch (error) {
    console.error(error);
  }
});