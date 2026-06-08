# InterviewIQ



InterviewIQ is a full-stack AI interview preparation platform built with React, FastAPI, SQLite, SQLAlchemy, and Ollama. The app helps users prepare for job interviews by analyzing job descriptions, generating role-specific interview questions, reviewing practice answers, saving interview sessions, tracking answer history, and producing AI-generated coaching feedback using a locally hosted open-source language model.



Unlike apps that rely on a paid cloud AI API, InterviewIQ runs AI requests through Ollama, allowing the app to use a local open-source language model.



## Screenshots



### Dashboard



[InterviewIQ dashboard](screenshots/dashboard.png)



### Job Analysis



[InterviewIQ job analysis](screenshots/job-analysis.png)



### Practice Answer



[InterviewIQ practice answer](screenshots/practice-answer.png)



### AI Feedback



[InterviewIQ AI feedback](screenshots/feedback.png)



### Saved Sessions



[InterviewIQ saved sessions](screenshots/saved-sessions.png)



## Features



* Analyze job descriptions for technical skills, soft skills, responsibilities, likely interview topics, and preparation advice

* Generate realistic interview questions from a job title, job description, interview type, and difficulty level

* Practice answering generated questions

* Receive AI-generated answer feedback with a score, strengths, weaknesses, coaching notes, and improved answer

* Save interview sessions to SQLite

* Load and delete saved sessions

* Track multiple answer attempts per session

* Reload previous answer attempts and feedback

* Copy improved answers to the clipboard

* Copy full feedback to the clipboard

* Download feedback as a `.txt` file

* Toggle between light mode and dark mode

* Use a local Ollama model instead of a paid AI service



## Tech Stack



### Frontend



* React

* Vite

* JavaScript

* Axios

* CSS



\### Backend



\* Python

\* FastAPI

\* SQLAlchemy

\* SQLite

\* Pydantic

\* Uvicorn



\### AI



\* Ollama

\* llama3.2 local language model



\## Project Structure



```text

InterviewIQ/

├── backend/

│   └── interviewiq-api/

│       ├── app/

│       │   ├── routers/

│       │   │   ├── ai.py

│       │   │   └── sessions.py

│       │   ├── services/

│       │   │   └── ollama\_service.py

│       │   ├── database.py

│       │   ├── main.py

│       │   ├── models.py

│       │   └── schemas.py

│       ├── .env.example

│       └── requirements.txt

│

├── frontend/

│   └── interviewiq-client/

│       ├── src/

│       │   ├── api/

│       │   │   └── interviewIqApi.js

│       │   ├── components/

│       │   │   ├── AnswerHistory.jsx

│       │   │   ├── AnswerPractice.jsx

│       │   │   ├── EmptyState.jsx

│       │   │   ├── FeedbackList.jsx

│       │   │   ├── FeedbackPanel.jsx

│       │   │   ├── InterviewForm.jsx

│       │   │   ├── JobAnalysisPanel.jsx

│       │   │   ├── QuestionList.jsx

│       │   │   ├── ScoreBadge.jsx

│       │   │   ├── SessionHistory.jsx

│       │   │   └── Sidebar.jsx

│       │   ├── App.css

│       │   ├── App.jsx

│       │   └── main.jsx

│       └── package.json

│

├── screenshots/

│   ├── dashboard.png

│   ├── job-analysis.png

│   ├── practice-answer.png

│   ├── feedback.png

│   └── saved-sessions.png

│

├── .gitignore

└── README.md

```



\## Prerequisites



Install the following before running the project:



\* Python

\* Node.js

\* Git

\* Ollama



Confirm Python and Node are installed:



```bash

python --version

node --version

npm --version

```



\## Ollama Setup



InterviewIQ requires Ollama to run the local AI model.



Pull the required model:



```bash

ollama pull llama3.2

```



Confirm the model is installed:



```bash

ollama list

```



You should see something like:



```text

NAME               ID              SIZE      MODIFIED

llama3.2:latest    ...             2.0 GB    ...

```



Test the model:



```bash

ollama run llama3.2

```



Example prompt:



```text

Give me three interview questions for a junior software developer.

```



Exit Ollama chat with:



```text

/bye

```



\## Backend Setup



From the project root:



```bash

cd backend\\interviewiq-api

python -m venv .venv

.venv\\Scripts\\activate

pip install -r requirements.txt

```



Create a `.env` file in:



```text

backend/interviewiq-api/.env

```



Use this content:



```env

OLLAMA\_BASE\_URL=http://localhost:11434

OLLAMA\_MODEL=llama3.2

```



Start the backend:



```bash

uvicorn app.main:app --reload

```



The backend runs at:



```text

http://127.0.0.1:8000

```



FastAPI Swagger documentation is available at:



```text

http://127.0.0.1:8000/docs

```



\## Frontend Setup



Open a second terminal from the project root:



```bash

cd frontend\\interviewiq-client

npm install

npm run dev

```



The frontend runs at:



```text

http://localhost:5173

```



\## Running the Full App



You need three things running at the same time.



\### 1. Ollama



Ollama usually runs in the background after installation. If needed, start it manually:



```bash

ollama serve

```



If the port is already in use, Ollama is probably already running.



\### 2. FastAPI Backend



```bash

cd backend\\interviewiq-api

.venv\\Scripts\\activate

uvicorn app.main:app --reload

```



\### 3. React Frontend



```bash

cd frontend\\interviewiq-client

npm run dev

```



Then open:



```text

http://localhost:5173

```



\## How to Use InterviewIQ



1\. Enter a job title.

2\. Optionally enter a company name.

3\. Select an interview type.

4\. Select a difficulty level.

5\. Paste a job description.

6\. Click \*\*Start interview prep\*\*.

7\. The app analyzes the job description and generates interview questions.

8\. Select a question.

9\. Type a practice answer.

10\. Click \*\*Review answer\*\*.

11\. Review the AI-generated score, strengths, weaknesses, coaching notes, and improved answer.

12\. Copy or download the feedback if needed.

13\. Reload previous sessions and answer attempts from the saved session panels.



\## API Endpoints



\### AI Routes



```text

POST /api/ai/analyze-job

POST /api/ai/generate-questions

POST /api/ai/review-answer

```



\### Session Routes



```text

POST /api/sessions

GET /api/sessions

GET /api/sessions/{session\_id}

POST /api/sessions/{session\_id}/answers

DELETE /api/sessions/{session\_id}

```



\## Local Database



InterviewIQ uses SQLite for local persistence.



The database file is created automatically when the backend starts:



```text

backend/interviewiq-api/interviewiq.db

```



The database stores:



\* Interview sessions

\* Generated questions

\* Answer attempts

\* AI feedback

\* Scores

\* Improved answers



The SQLite database file is ignored by Git and should not be committed.



\## Environment Variables



The backend uses:



```env

OLLAMA\_BASE\_URL=http://localhost:11434

OLLAMA\_MODEL=llama3.2

```



An example file is included at:



```text

backend/interviewiq-api/.env.example

```



\## Troubleshooting



\### Backend says it cannot connect to Ollama



Make sure Ollama is running:



```bash

ollama serve

```



Then test the Ollama API:



```bash

curl http://localhost:11434/api/tags

```



If this fails, Ollama is not running correctly.



\### Model not found



Check installed models:



```bash

ollama list

```



If `llama3.2` is missing, run:



```bash

ollama pull llama3.2

```



\### Backend returns 503 Service Unavailable



This usually means the backend could not reach Ollama or the local model failed to respond.



Test the model directly:



```bash

ollama run llama3.2

```



Then restart the backend:



```bash

uvicorn app.main:app --reload

```



\### Frontend cannot reach backend



Make sure the backend is running at:



```text

http://127.0.0.1:8000

```



Also make sure the frontend API base URL in:



```text

frontend/interviewiq-client/src/api/interviewIqApi.js

```



matches:



```js

const API\_BASE\_URL = "http://127.0.0.1:8000";

```



\### SQLite data is missing after deleting the database



The app creates a new empty database automatically. Previous saved sessions are lost if `interviewiq.db` is deleted.



\## Git Ignore Notes



The repo should not commit:



```text

.venv/

node\_modules/

.env

interviewiq.db

dist/

\_\_pycache\_\_/

```



These are excluded in `.gitignore`.



\## Current Limitations



\* No user authentication yet

\* SQLite is local only

\* Local AI response speed depends on the user's machine

\* AI output quality depends on the selected Ollama model

\* Sessions are stored locally, not in a hosted database

\* No deployment configuration yet



\## Future Improvements



\* Add user authentication

\* Add PostgreSQL support

\* Add search and filtering for saved sessions

\* Export full interview sessions as PDF

\* Add resume upload and resume-to-job matching

\* Add voice-based interview practice

\* Add more interview modes

\* Add AI prompt templates by role type

\* Add Docker support

\* Add deployment configuration

\* Add automated tests



\## Portfolio Summary



InterviewIQ demonstrates full-stack development, local AI integration, REST API design, database persistence, React component architecture, prompt-based AI workflows, and practical user-focused software design. The project uses a locally hosted open-source language model through Ollama, showing how AI can be integrated into a real application without relying on a paid cloud API.



