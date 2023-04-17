import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";

export default async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("nextjs-mongodb-demo");

    const { method, body, query } = req;

    res.setHeader("Content-Type", "application/json");

    switch (method) {
      case "GET":
        const getData = await db.collection("posts").findOne({
          _id: new ObjectId(query.id),
        });

        res.status(200).json(getData);
        break;

      case "PUT":
        const updateData = await db
          .collection("posts")
          .updateOne({ _id: new ObjectId(query.id) }, { $set: body });

        res.status(200).json(updateData);
        break;

      case "DELETE":
        const deleteData = await db
          .collection("posts")
          .deleteOne({ _id: new ObjectId(query.id) });

        res.status(200).json(deleteData);
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
