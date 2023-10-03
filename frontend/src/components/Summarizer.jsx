// async function query(data) {
//     const response = await fetch(
//       "https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY",
//       {
//         headers: {
//           Authorization: "Bearer api_token",
//         },
//         method: "POST",
//         body: JSON.stringify(data),
//       }
//     );
//     const result = await response.json();
//     return result;
//   }
  
//   query({
//     inputs:
//       "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.",
//   }).then((response) => {
//     console.log(JSON.stringify(response));
//   });

import React, { useState } from 'react';

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/knkarthick/MEETING_SUMMARY",
    {
      headers: {
        Authorization: "Bearer API_TOKEN",
        'Content-Type': 'application/json', // Set content type to JSON
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function SummarizerApp({ selectedEmailContent}) {
  const [summaryText, setSummaryText] = useState('');


const handleButtonClick = () => {
    if (summaryText) {
      setSummaryText('');
    } else {
      query({
        inputs: selectedEmailContent,
      })
        .then((response) => {
       
          setSummaryText(response[0].summary_text);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <div >
      <button 
        className="generate-button"
        onClick={handleButtonClick}>Summarize</button>
      {summaryText && (
        <div className="sum-window">
          <p>{summaryText}</p>
        </div>
      )}
    </div>
  );
}

export default SummarizerApp;
