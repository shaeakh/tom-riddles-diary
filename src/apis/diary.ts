// @/apis/diary.ts

export interface DiaryRequest {
  message: string;
}

export interface DiaryResponse {
  reply: string;
}

export const askTomRiddleAPI = async (payload: DiaryRequest): Promise<DiaryResponse> => {
  const response = await fetch('http://localhost:5000/api/ask-tom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('The diary rejects your magic. Failed to connect.');
  }

  return response.json();
};
