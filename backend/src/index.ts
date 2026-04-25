import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import formsRouter from './routes/forms';
import flowsRouter from './routes/flows';
import rulesRouter from './routes/rules';
import submissionsRouter from './routes/submissions';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(cors());
app.use(express.json());

app.use('/api/forms', formsRouter);
app.use('/api/flows', flowsRouter);
app.use('/api/rules', rulesRouter);
app.use('/api/submissions', submissionsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});

export default app;
