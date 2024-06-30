import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Table from "../../../models/Table";
import User from "../../../models/User";
import dbConnect from "../../../util/dbConnect";

dbConnect();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        fullName: { label: "Full Name", type: "text", placeholder: "John Doe" },
        tableName: { label: "Table Name", type: "text", placeholder: "1" },
      },
      async authorize(credentials) {
        const { fullName, tableName } = credentials;
        const table = await Table.findOne({ tableName });

        if (!table) {
          throw new Error("Table not found!");
        }

        if (table.status === "deactive") {
          const user = await User.create({
            fullName,
            tableName,
            loginTime: new Date(),
          });

          await Table.findByIdAndUpdate(table._id, { status: "active" });

          return {
            id: user._id,
            fullName: user.fullName,
            tableName: table.tableName,
          };
        } else {
          throw new Error("Table is already active!");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.fullName = token.fullName;
      session.user.tableName = token.tableName;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.fullName = user.fullName;
        token.tableName = user.tableName;
      }
      return token;
    },
  },
  database: process.env.MONGODB_URI,
  secret: "secret",
});
