const Agenda = require("agenda");

// mongodb+srv://debashis:<password>@cluster0.eihs8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

const dbURL ="mongodb://" +process.env.DB_USERNAME +":" +process.env.DB_PASSWORD +"@" +process.env.DB_HOST +"/" +process.env.DB_DATABASE +"?retryWrites=true&w=majority";

module.exports = async (req, res) => {
  try {
    const agenda = new Agenda({
      db: {
        address: dbURL,
        collection: "agenda",
        options: {
          auth: {
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
          },
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
      processEvery: "20 seconds",
    });
    console.log("Agenda connected successfully");

    (async function () {
      await agenda.start();
      await agenda.every("", "");
    })();
  } catch (err) {
    console.error(err);
  }
};
