import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('API Key loaded:', process.env.OPENAI_API_KEY?.substring(0, 20) + '...');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');
    const models = await openai.models.list();
    console.log('✅ OpenAI API connection successful!');
    console.log('Available models:', models.data.slice(0, 3).map(m => m.id));
    
    // Test a simple completion to make sure the key has proper permissions
    console.log('\nTesting completions...');
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello!" }],
      max_tokens: 10
    });
    console.log('✅ Completion test successful!');
    console.log('Response:', completion.choices[0].message.content);
    
  } catch (error) {
    console.error('❌ OpenAI API Error:', error.message);
    if (error.status) {
      console.error('Status:', error.status);
      console.error('Type:', error.type);
    }
  }
}

testOpenAI();
