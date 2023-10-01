async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5",
    {
      headers: {
        Authorization: "Bearer api_token",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

const rname = "dipan";
const sub = "for violating OSHA guidelines";

query({
  inputs: `<|prompter|>Compose an email to ${rname} regarding ${sub}<|endoftext>|<|assistant|>`,
  parameters: {
    max_length: 128,
    return_full_text: false,
    max_new_tokens: 300,
  },
}).then((response) => {
  console.log(JSON.stringify(response));
});
