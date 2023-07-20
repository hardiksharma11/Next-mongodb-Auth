import formidable from 'formidable-serverless';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {

  const form = new formidable.IncomingForm();
  form.uploadDir = path.join(process.cwd(), 'public/uploads');

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error uploading photo' });
    }

    const photoFile = files.photo;
    const photoPath = photoFile.path;
    const photoName = photoFile.name;

    // Generate a unique name for the photo
    const uniqueName = `${Date.now()}-${photoName}`;

    try {
      // Rename the photo file to the unique name and move it to the public/uploads directory
      fs.renameSync(photoPath, path.join(form.uploadDir, uniqueName));

      return res.status(200).json({ photoName: uniqueName });
    } catch (error) {
      return res.status(500).json({ error: 'Error saving photo' });
    }
  });
}
