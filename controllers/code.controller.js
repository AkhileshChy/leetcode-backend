import { codeQueue } from '../util/codeQueue.js'; // BullMQ queue
import { v4 as uuidv4 } from 'uuid';

export const codeSubmit = async (req, res) => {
    try {
        const { userId, problemId, language, code } = req.body;

        if (!userId || !problemId || !language || !code) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Unique submission ID (use UUID or Mongo ID)
        const submissionId = uuidv4();

        // Push the job to Redis queue for async processing
        await codeQueue.add('code:evaluate', {
            submissionId,
            userId,
            problemId,
            language,
            code
        });

        // Respond to client immediately with submissionId
        res.status(202).json({ submissionId, message: 'Submission received' });
    } catch (error) {
        console.error('Error submitting code:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
