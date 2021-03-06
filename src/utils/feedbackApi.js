const ENDPOINT = process.env.REACT_APP_FEEDBACK_API;

export async function getAllRatings() {
  const response = await fetch(`${ENDPOINT}/ratings/`);
  return response.json();
}

export async function getRating(projectId) {
  const response = await fetch(`${ENDPOINT}/ratings/?ids=${projectId}`);
  const [rating] = await response.json();
  return rating || { rating: 0, rating_count: 0, total_ratings: 0 };
}

export async function getFeedback(projectId) {
  const response = await fetch(`${ENDPOINT}/feedback/?project_id=${projectId}`);
  return response.json();
}

export async function addFeedback(projectId, rating, comment) {
  const response = await fetch(`${ENDPOINT}/feedback/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      project_id: projectId,
      rating,
      comment,
    }),
  });
  if (response.status !== 201) throw new Error('Failed sending request.');
  return response.json();
}

export async function deleteFeedback(feedbackId) {
  const response = await fetch(`${ENDPOINT}/feedback/${feedbackId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (response.status !== 204) throw new Error('Failed sending request.');
  return true;
}
