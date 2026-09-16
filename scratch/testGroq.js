const dotenv = require('dotenv');
dotenv.config();

async function testGroq() {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey) {
    console.log("No GROQ API KEY");
    return;
  }
  const prompt = `Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{
  "strongTopics": ["topic1", "topic2"],
  "mediumTopics": ["topic3"],
  "weakTopics": ["topic4"],
  "generalFeedback": "Your specific feedback for this assessment performance. Mention what they did well and what they need to work on."
}`;

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    });

    if (groqResponse.ok) {
      const groqData = await groqResponse.json();
      console.log("Success:", JSON.stringify(groqData.choices[0].message.content));
    } else {
      console.error("Groq API error:", await groqResponse.text());
    }
  } catch (e) {
    console.error("Fetch error:", e);
  }
}

testGroq();
