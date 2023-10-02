import React, { useState } from 'react';
import '../styles/generate.scss';

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    {
      headers: {
        Authorization: "Bearer ACCESS_TOKEN",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function Generator() {
    const [responseHtml, setResponseHtml] = useState('');
    const [prompt, setPrompt] = useState('');
  
    const handleGenerateClick = () => {
      query({
        inputs: `Compose an email to ${prompt}`,
        parameters: {
          max_length: 128,
          return_full_text: false,
          max_new_tokens: 300,
        },
      })
      .then((response) => {
        const generatedText = response[0].generated_text;
        setResponseHtml(generatedText);
      });
    };
  
    return (
      <div>
        <div>
          <label htmlFor="prompt">Enter a prompt: </label>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)} // Update the prompt state
          />
        </div>
        <button 
            className="generate-button"
            onClick={handleGenerateClick}>
                Generate
        </button>
        <div>
          <div dangerouslySetInnerHTML={{ __html: responseHtml }} />
        </div>
      </div>
    );
  }
  
  export default Generator;