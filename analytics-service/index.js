const express = require('express');
const cors = require('cors');
const { createClient } = require('@clickhouse/client');

const app = express();
app.use(express.text({ type: '*/*' })); 
app.use(cors());

const clickhouseClient = createClient({
    host: 'http://clickhouse.default:8123',
    database: 'lugx_gaming',
    // --- ADD THESE TWO LINES ---
    username: 'default',
    password: 'password',
    // ---------------------------
});

//change
app.post('/track', async (req, res) => {
    try {
        const event = JSON.parse(req.body);

        if (!event.eventType || !event.sessionId || !event.pageUrl) {
            return res.status(400).send({ message: 'Missing required event fields.' });
        }

        await clickhouseClient.insert({
            table: 'web_analytics',
            values: [{
                event_type: event.eventType,
                session_id: event.sessionId,
                page_url: event.pageUrl,
                user_agent: req.headers['user-agent'],
                scroll_depth: event.scrollDepth || null,
                clicked_element_id: event.clickedElementId || null,
            }],
            format: 'JSONEachRow',
        });

        console.log('Tracked event:', event.eventType);
        res.status(202).send({ message: 'Event tracked.' });

    } catch (error) {
        console.error('Error tracking event:', error);
        if (error instanceof SyntaxError) {
            return res.status(400).send({ message: 'Invalid JSON format.' });
        }
        res.status(500).send({ message: 'Internal Server Error' });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Analytics service listening on port ${port}`);
});