import dbConnect from "../../../util/dbConnect";
import Table from "../../../models/Table";

dbConnect();

const handler = async (req, res) => {
  const { tableName } = req.body;

  if (req.method === "POST") {
    try {
      const table = await Table.findOne({ tableName });

      if (!table) {
        return res.status(404).json({ success: false, message: "Table not found" });
      }

      await Table.findByIdAndUpdate(table._id, { status: "deactive" });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
