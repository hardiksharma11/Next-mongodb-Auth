import connectMongo from '../../../database/conn';
import Users from '../../../model/Schema'
import { hash } from 'bcryptjs';

const readFile = (
    req,
    saveLocally
  ) => {
    const options = {};
    if (saveLocally) {
      options.uploadDir = path.join(process.cwd(), "/public/images");
      options.filename = (name, ext, path, form) => {
        return Date.now().toString() + "_" + path.originalFilename;
      };
    }
    options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });
  };

export default async function handler(req, res) {
  try {
    await connectMongo();

    // Only POST method is accepted
    if (req.method === 'POST') {
      if (!req.body) return res.status(404).json({ error: "Don't have form data...!" });
      const { username, email, password } = req.body;

      // Check duplicate users
      const checkexisting = await Users.findOne({ email });
      if (checkexisting) return res.status(422).json({ message: "User Already Exists...!" });

      // Hash password and create the user
      const hashedPassword = await hash(password, 12);
      const newUser = await Users.create({ username, email, password: hashedPassword });

      res.status(201).json({ status: true, user: newUser });
    } else {
      res.status(500).json({ message: "HTTP method not valid. Only POST is accepted." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing the request." });
  }
}
