require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Load credentials and custom object schema ID from environment variables
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE || '2-269100577';

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
};

// ROUTE 1: Homepage - Fetch and list custom object records (Books)
app.get('/', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}?properties=name,author,description`;
    try {
        const response = await axios.get(url, { headers });
        res.render('homepage', {
            title: 'Custom Objects List | Integrating With HubSpot I Practicum',
            data: response.data.results
        });
    } catch (error) {
        console.error('Error fetching custom objects:', error.response ? error.response.data : error.message);
        res.status(500).send('Error retrieving custom objects');
    }
});

// ROUTE 2: Render Form - Display form to create new custom object record
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});

// ROUTE 3: Handle Form Submission - Create new CRM custom object record
app.post('/update-cobj', async (req, res) => {
    const url = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
    const payload = {
        properties: {
            name: req.body.name,
            author: req.body.author,
            description: req.body.description
        }
    };
    try {
        await axios.post(url, payload, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creating custom object record:', error.response ? error.response.data : error.message);
        res.status(500).send('Error creating custom object record');
    }
});

// Localhost listener
app.listen(3000, () => console.log('Listening on http://localhost:3000'));