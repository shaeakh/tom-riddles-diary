// @/hooks/useTomRiddle.ts
import { useState, useCallback } from 'react';
import { askTomRiddleAPI } from '@/apis/diary';

export type DiaryState = 'idle' | 'fading-out' | 'loading' | 'fading-in';

interface UseTomRiddleReturn {
  currentState: DiaryState;
  userText: string;
  tomReply: string;
  error: string | null;
  setUserText: (text: string) => void;
  submitMessage: () => Promise<void>;
  resetToIdle: () => void;
}

export const useTomRiddle = (): UseTomRiddleReturn => {
  const [currentState, setCurrentState] = useState<DiaryState>('idle');
  const [userText, setUserText] = useState<string>('');
  const [tomReply, setTomReply] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const submitMessage = useCallback(async () => {
    if (!userText.trim() || currentState !== 'idle') return;

    setError(null);
    // ১. Absorbing State শুরু (Fade-out)
    setCurrentState('fading-out');

    // অ্যানিমেশন ফিল করার জন্য একটি কৃত্রিম ডিলে (যেমন: 1200ms) এর পর API কল করা
    setTimeout(async () => {
      setCurrentState('loading');

      try {
        const response = await askTomRiddleAPI({ message: userText });
        setTomReply(response.reply);

        // ২. Bleeding State শুরু (Fade-in)
        setCurrentState('fading-in');
        setUserText('');
      } catch (err: any) {
        setError(err.message || 'Something went wrong.');
        setCurrentState('idle');
      }
    }, 1200);
  }, [userText, currentState]);

  const resetToIdle = useCallback(() => {
    setTomReply('');
    setCurrentState('idle');
  }, []);

  return {
    currentState,
    userText,
    tomReply,
    error,
    setUserText,
    submitMessage,
    resetToIdle,
  };
};
