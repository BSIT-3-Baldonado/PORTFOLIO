import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resumePathCandidates = [
  path.join(__dirname, '..', 'assets', 'resume.pdf'),
  path.join(__dirname, 'resume.pdf'),
  path.join(__dirname, '..', 'public', 'assets', 'resume.pdf'),
  path.join(__dirname, '..', 'public', 'resume.pdf'),
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

export function serveResumePdf(req, res) {
  const resumePath = findResumePath();
  if (!resumePath) {
    res.status(404).json({ error: 'Resume PDF not found on server.' });
    return;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="resume.pdf"');

  const stream = fs.createReadStream(resumePath);
  stream.on('error', () => {
    res.status(500).json({ error: 'Failed to read resume PDF.' });
  });
  stream.pipe(res);
}

