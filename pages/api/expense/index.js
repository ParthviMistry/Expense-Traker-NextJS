import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-mongodb-demo");

    const { method, body } = req;

    res.setHeader("Content-Type", "application/json");

    switch (method) {
      case "GET":
        const getAllData = await db.collection("posts").find({}).toArray();

        res.status(200).json(getAllData);
        break;

      case "POST":
        if (!body) {
          const error = {
            statusCode: 400,
            message: `Request body is required.`,
          };

          res.status(400).json(error);
          return;
        }

        const createData = await db.collection("posts").insertOne(req.body);

        res.status(201).json(createData);
        break;

      default:
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (e) {
    const error = {
      statusCode: 500,
      message: `Internal server error. ${e}`,
    };

    res.status(500).json(error);
  }
};
