// seed.js

const { Seeder } = require("mongo-seeding");
const path = require("path");


const SeederDatabaseConfigObjectOptions = {
  retryWrites: true,
  w: 'majority',
};

const config = {
  database: "mongodb+srv://developeraffotax:BEwjlTn0Z07sk6Co@affotaxcrm.vir9dqy.mongodb.net/CRM?retryWrites=true&w=majority",
};

// path: path.resolve('./data.json')
const seeder = new Seeder(config);

const collections = seeder.readCollectionsFromPath(
  path.resolve("./data")
);

console.log(collections);

seeder
  .import(collections)
  .then(() => {
    console.log("Data seeding complete!");
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  });
