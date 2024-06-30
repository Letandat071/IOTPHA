import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";

const handler = async (req, res) => {
  await dbConnect();
  const { method, query: { id } } = req;

  if (method === "GET") {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
