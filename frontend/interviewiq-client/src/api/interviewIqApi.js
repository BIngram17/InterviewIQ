import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeJob(payload) {
  const response = await axios.post(`${API_BASE_URL}/api/ai/analyze-job`, payload);

  return response.data;
}

export async function generateQuestions(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ai/generate-questions`,
    payload
  );

  return response.data;
}

export async function reviewAnswer(payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/ai/review-answer`,
    payload
  );

  return response.data;
}

export async function createSession(payload) {
  const response = await axios.post(`${API_BASE_URL}/api/sessions`, payload);

  return response.data;
}

export async function saveAnswer(sessionId, payload) {
  const response = await axios.post(
    `${API_BASE_URL}/api/sessions/${sessionId}/answers`,
    payload
  );

  return response.data;
}

export async function getSessions() {
  const response = await axios.get(`${API_BASE_URL}/api/sessions`);

  return response.data;
}

export async function getSession(sessionId) {
  const response = await axios.get(`${API_BASE_URL}/api/sessions/${sessionId}`);

  return response.data;
}

export async function deleteSession(sessionId) {
  await axios.delete(`${API_BASE_URL}/api/sessions/${sessionId}`);
}

export function getReadableApiError(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg).join(" ");
  }

  if (error?.code === "ERR_NETWORK") {
    return "Could not reach the backend. Make sure FastAPI is running at http://127.0.0.1:8000.";
  }

  return "Something went wrong. Check that the backend and Ollama are both running.";
}