import fetch from "node-fetch";
async function query(data) {
	const response = await fetch(
		"https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
		{
			headers: { Authorization: "Bearer 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" },
			method: "POST",
			body: JSON.stringify(data),
		}
	);
	const result = await response.json();
	return result;
}

query({"inputs": "This was below expectations"}).then((response) => {
	console.log(JSON.stringify(response));
});

