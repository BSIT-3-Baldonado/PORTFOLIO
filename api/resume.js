import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumePathCandidates = [
  path.join(__dirname, '..', 'server', 'assets', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'src', 'assets', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'src', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'assets', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'src', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'src', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'resume.pdf'),
  path.join(__dirname, '..', 'server', 'public', 'assets', 'resume.pdf'),
];

function findResumePath() {
  for (const p of resumePathCandidates) {
    try {
      if (fs.existsSync(p)) return p;
    } catch {
      // ignore
    }
  }
  return null;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed.' });
      return;
    }

    const resumePath = findResumePath();
    if (!resumePath) {
      res.status(404).json({ error: 'Resume PDF not found on server.' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

    const stream = fs.createReadStream(resumePath);
    stream.on('error', () => {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to read resume PDF.' });
      }
    });
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to serve resume PDF.' });
  }
}

