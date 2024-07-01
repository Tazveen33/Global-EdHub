const OpenAI = require('openai');
const apiKey = 'your API key'; 
const openai = new OpenAI({ apiKey });

async function getCollegeRecommendation(course, major, country, budget, expense, weather) {
    // Construct the prompt
    const prompt = `Recommend a number of colleges for a student interested in ${course} with a major in ${major}, looking to study in ${country}, with a budget of ${budget}, expected living expenses around ${expense}, and prefers ${weather} weather. Order the colleges based on their adherance with the given conditions. Provide an overview of the fee structure and academic expenses of the colleges in dollars. Highlight the name of the college. Give high preferance to the budget ranges fixed by the user. Provide a detailed overview of the college. If the User has given Low as the budget suggest the colleges with out-of-state student's tution fee less than $6000, for medium budget suggest the colleges with out-of-state student's tution fee less between $6500 - $18000 and for high budget suggest the colleges with out-of-state student's tution fee more than $18000. Abide by these conditions stictly. Do not hallucinate.`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        });
        console.log(JSON.stringify({ message: 'Form data received successfully' }));
        return response.choices[0].message.content;
    } catch (error) {
        throw error; 
    }
}

module.exports = getCollegeRecommendation;
