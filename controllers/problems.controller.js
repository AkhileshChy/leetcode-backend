import sql from "../util/db.js";

export const listProblems = async (req, res) => {
    try {
        const result = await sql`
            SELECT id, title, difficulty, tags
            FROM problems
            ORDER BY id ASC
        `;
        
        res.status(200).json({ problems: result });
    } catch (error) {
        console.error('Error listing problems:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProblem = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ message: 'Invalid problem ID' });
        }

        const result = await sql`
            SELECT id, title, description, difficulty, tags
            FROM problems
            WHERE id = ${id}
            LIMIT 1
        `;

        if (result.length === 0) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProblem = async (req, res) => {
    try {
        const {
            title,
            slug,
            description,
            difficulty,
            tags = [],
            constraints = ''
        } = req.body;

        if (!title || !slug || !description || !difficulty) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Insert the problem into the DB
        const result = await sql`
            INSERT INTO problems (title, slug, description, difficulty, tags, constraints)
            VALUES (${title}, ${slug}, ${description}, ${difficulty}, ${tags}, ${constraints})
            RETURNING *;
        `;

        res.status(201).json({
            message: 'Problem created successfully',
            problem: result[0]
        });
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProblem = async (req, res) => {
    try {
        const { problemId } = req.params;

        if (!problemId) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }

        // Check if the problem exists
        const existing = await sql`SELECT * FROM problems WHERE id = ${problemId}`;
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Delete the problem
        await sql`DELETE FROM problems WHERE id = ${problemId}`;

        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProblem = async (req, res) => {
    try {
        const { problemId } = req.params;
        const {
            title,
            slug,
            description,
            difficulty,
            constraints,
            tags,
            inputFormat,
            outputFormat,
        } = req.body;

        if (!problemId) {
            return res.status(400).json({ message: 'Problem ID is required' });
        }

        // Check if problem exists
        const existing = await sql`SELECT * FROM problems WHERE id = ${problemId}`;
        if (existing.length === 0) {
            return res.status(404).json({ message: 'Problem not found' });
        }

        // Update the problem
        const updated = await sql`
            UPDATE problems
            SET 
                title = ${title},
                slug = ${slug},
                description = ${description},
                difficulty = ${difficulty},
                constraints = ${constraints},
                tags = ${tags},
                input_format = ${inputFormat},
                output_format = ${outputFormat}
            WHERE id = ${problemId}
            RETURNING *;
        `;

        res.status(200).json({
            message: 'Problem updated successfully',
            problem: updated[0]
        });

    } catch (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
