async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
    {
      headers: {
        Authorization: `Bearer api_token`,
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

async function output(input) {
  const response = await query({ inputs: input });
  console.log(JSON.stringify(response));
  return JSON.stringify(response);
}

export default output;
