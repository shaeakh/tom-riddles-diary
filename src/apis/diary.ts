// src/apis/diary.ts
import axios from 'axios';
import EnvConstants from '@/utils/envConstants';

export interface DiaryRequest {
  message: string;
}

export interface DiaryResponse {
  reply: string;
}

export const askTomRiddleAPI = async (payload: DiaryRequest): Promise<DiaryResponse> => {
  try {
    const response = await axios.post<DiaryResponse>(
      `${EnvConstants.BACKEND_URL}/api/ask-tom`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || 'The diary rejects your magic. Failed to connect.';
    // eslint-disable-next-line preserve-caught-error
    throw new Error(errorMessage);
  }
};
