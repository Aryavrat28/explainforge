# ExplainForge

Turn complicated text into simple explanations with local AI.

ExplainForge takes technical or academic text and explains it for a selected audience level using QVAC and a local Qwen3 0.6B model.

## Features

- Local AI inference
- No cloud AI API required
- Beginner, Student and Advanced explanation levels
- Clear explanations
- Key points
- Simple examples
- One-line takeaways
- Browser-based interface

## Tech Stack

- Node.js
- Express
- Vanilla HTML, CSS and JavaScript
- QVAC SDK 0.19.1
- Qwen3 0.6B Q4
- jsonrepair

## Installation

Clone the repository:

git clone https://github.com/Aryavrat28/explainforge.git

Enter the project:

cd explainforge

Install dependencies:

npm install

## Run

QVAC_CONFIG_PATH=./qvac.config.json npm start

Open:

http://localhost:3000

## Usage

1. Paste text into the input.
2. Select an audience level.
3. Click Explain.
4. Review the explanation, key points, example and takeaway.

## License

MIT License

EOF
