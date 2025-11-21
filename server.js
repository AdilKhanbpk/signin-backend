require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initializing Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sign In Route
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Please try again.'
            });
        }

        res.json({
            success: true,
            message: 'Success! You are now signed in.',
            user: data.user
        });
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({
            success: false,
            message: 'An error occurred. Please try again.'
        });
    }
});

app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Server failed to start:', err);
});
