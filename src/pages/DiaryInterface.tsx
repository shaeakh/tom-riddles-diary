// @/pages/DiaryInterface.tsx
import { useTomRiddle } from '@/hooks/useTomRiddle';
import { AnimatePresence, motion } from 'framer-motion';

import type { Variants } from 'framer-motion';
import React, { useRef } from 'react';
import { LuHistory, LuSparkles } from 'react-icons/lu';

export const DiaryInterface: React.FC = () => {
  const { currentState, userText, tomReply, error, setUserText, submitMessage, resetToIdle } =
    useTomRiddle();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handlePageClick = () => {
    if (currentState === 'idle') {
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitMessage();
    }
  };

  // explicit টাইপ 'Variants' ডিফাইন করা হলো এবং ease কনফিগারেশন ফিক্স করা হলো
  const inkAbsorbVariants: Variants = {
    initial: { opacity: 1, filter: 'blur(0px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: {
      opacity: 0,
      filter: 'blur(8px)',
      transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] }, // cubic-bezier format for standard easeInOut
    },
  };

  const inkBleedVariants: Variants = {
    hidden: { opacity: 0, filter: 'blur(4px)' },
    visible: (i: number) => ({
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        delay: i * 0.05,
        duration: 0.8,
        ease: [0, 0, 0.2, 1], // cubic-bezier format for standard easeOut
      },
    }),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1e1a13] p-4 text-stone-800 selection:bg-amber-900/20 selection:text-amber-900">
      {/* ডায়েরি কন্টেইনার */}
      <div
        onClick={handlePageClick}
        className="relative min-h-[600px] w-full max-w-2xl cursor-text overflow-hidden rounded-md border border-stone-800/20 bg-[#f4ebd0] p-12 shadow-[inset_0_0_60px_rgba(139,115,85,0.3),0_20px_40px_rgba(0,0,0,0.6)] md:p-16"
        style={{
          backgroundImage: 'linear-gradient(#c2b59b 1px, transparent 1px)',
          backgroundSize: '100% 3rem',
          lineHeight: '3rem',
          paddingTop: '3.4rem',
        }}
      >
        {/* Tailwind v4 Canonical Class: bg-gradient-to-b -> bg-linear-to-b, via-amber-900/[0.02] -> via-amber-900/2 */}
        <div className="absolute inset-0 pointer-events-none bg-linear-to-b from-transparent via-amber-900/2 to-transparent" />

        {/* এরর মেসেজ হ্যান্ডলিং */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-xs text-red-800/80 bg-red-900/10 px-3 py-1 rounded">
            {error}
          </div>
        )}

        {/* ১. WRITING & ABSORBING STATE */}
        <AnimatePresence mode="wait">
          {currentState === 'idle' || currentState === 'fading-out' ? (
            <motion.div
              key="writing-area"
              variants={inkAbsorbVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full"
            >
              <textarea
                ref={inputRef}
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={currentState === 'fading-out'}
                placeholder="Write something to Tom Riddle..."
                className="w-full resize-none bg-transparent font-cursive text-3xl md:text-4xl text-stone-800 focus:outline-none placeholder:text-stone-400/50 min-h-[400px]"
                style={{ lineHeight: '3rem' }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* ২. LOADING STATE */}
        {currentState === 'loading' && (
          <div className="flex items-center justify-center h-[300px]">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="font-mono text-sm tracking-widest text-stone-500/70 italic flex items-center gap-2"
            >
              <LuSparkles className="animate-spin text-amber-800/40" />
              The diary is thinking...
            </motion.div>
          </div>
        )}

        {/* ৩. BLEEDING STATE */}
        {/* Tailwind v4 Canonical Class: leading-[3rem] -> leading-12 */}
        {currentState === 'fading-in' && (
          <div className="w-full min-h-[400px] font-cursive text-3xl md:text-4xl text-red-950/90 leading-12">
            {tomReply.split('').map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={inkBleedVariants}
                initial="hidden"
                animate="visible"
              >
                {char}
              </motion.span>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: tomReply.length * 0.05 + 1 }}
              className="mt-8 flex justify-end"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetToIdle();
                }}
                className="flex items-center gap-2 font-mono text-xs tracking-wider text-stone-500 hover:text-stone-800 transition-colors uppercase border border-stone-400/30 rounded px-3 py-1.5 bg-stone-200/20"
              >
                <LuHistory size={14} /> Continue Writing
              </button>
            </motion.div>
          </div>
        )}
      </div>

      <div className="mt-4 font-mono text-[10px] text-stone-500 tracking-wider uppercase opacity-60">
        Press <kbd className="bg-stone-800 p-1 rounded text-stone-300">Enter</kbd> to speak with the
        Dark Lord.
      </div>
    </div>
  );
};
