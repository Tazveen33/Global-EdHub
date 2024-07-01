const http = require('http');
const fs = require('fs');
const getCollegeRecommendation = require('./openai'); 

const port = 8081;



const server = http.createServer(async (req, res) => {
    if (req.url === '/recommendationEndpoint' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', async () => {
            const formData = JSON.parse(body);

            try {
                
                const recommendation = await getCollegeRecommendation(
                    formData.course,
                    formData.major,
                    formData.country,
                    formData.budget,
                    formData.expense,
                    formData.weather
                );

                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Form data received successfully',
                    recommendation: recommendation 
                }));
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to get recommendation' }));
            }
        });
    } else {
        fs.readFile('person.ejs', (error, data) => {
            if (error) {
                if (!res.headersSent) {
                    res.writeHead(404);
                }
                res.end('Error: File not found');
            } else {
                if (!res.headersSent) {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                }
                res.end(data);
            }
        });
    }
});

server.listen(port, () => {
    console.log('Server is listening on port ' + port);
});
