"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Circle, CircleCheck, CircleX } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircle from "@mui/icons-material/CheckCircle";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6 ", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

type LoadingState = {
  progress: {
    text: string;
    desc: string;
  };
  success: {
    text: string;
    desc: string;
  };
};

const LoaderCore = ({
  loadingStates,
  value = 0,
  status,
  statusInfo,
}: {
  loadingStates: LoadingState[];
  value?: number;
  status: string;
  statusInfo: { text: string; desc: string };
}) => {
  const { theme } = useTheme();
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0); // Minimum opacity is 0, keep it 0.2 if you're sane.

        return (
          <motion.div
            key={index}
            className={cn("text-left flex gap-2 mb-4 w-80")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >

            {/* Done */}
            {index < value && (
              <>
                <CheckCircleIcon className="dark:text-white text-black" />
                <div className={`flex flex-col`}>
                  <span
                    className={cn(
                      "text-black dark:text-white"
                    )}
                  >
                    {loadingState.success.text}
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-300 text-sm">
                    {loadingState.success.desc}
                  </span>
                </div>
              </>
            )}

            {/* Current */}
            {index === value && (
              <>
                {status === 'success' ? (
                  <CheckCircle className="text-lime-500" />
                ) : status === 'error' ? (<CancelIcon className="text-pink-600" />) : (
                  <div className="mx-0.5" role="status">
                    <svg aria-hidden="true" className="inline w-5 h-5 text-zinc-300 dark:text-zinc-600 animate-spin fill-black dark:fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                <div className={`flex flex-col`}>
                  <span
                    className={cn(
                      status === 'success' ? "text-black dark:text-lime-500" : status === 'error' ? " text-pink-600" : "text-black dark:text-white"
                    )}
                  >
                    {status === 'success' ? loadingState.success.text : status === 'error' ? statusInfo.text : loadingState.progress.text}
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-300 text-sm">
                    {status === 'success' ? loadingState.success.desc : status === 'error' ? statusInfo.desc : loadingState.progress.desc}
                  </span>
                </div>
              </>
            )}

            {index > value && (
              // <CheckIcon className="text-black dark:text-white" />
              <>
                <div className="mx-0.5" role="status">
                  <svg aria-hidden="true" className="inline w-5 h-5 text-zinc-300 dark:text-zinc-600 animate-spin fill-transparent" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
                <div className={`flex flex-col opacity-50`}>
                  <span
                    className={cn(
                      "text-black dark:text-white"
                    )}
                  >
                    {loadingState.progress.text}
                  </span>
                  <span className="text-zinc-800 dark:text-zinc-300 text-sm">
                    {loadingState.progress.desc}
                  </span>
                </div>
              </>
            )}

          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  status,
  setStatus,
  statusInfo,
  setStatusInfo,
  duration = 10000,
  loop = true,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  status: string;
  setStatus: (status: string) => void;
  statusInfo: { text: string; desc: string };
  setStatusInfo: (statusInfo: { text: string; desc: string }) => void;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    // const timeout = setTimeout(() => {
    //   setCurrentState((prevState) =>
    //     loop
    //       ? prevState === loadingStates.length - 1
    //         ? 0
    //         : prevState + 1
    //       : Math.min(prevState + 1, loadingStates.length - 1)
    //   );
    // }, duration);

    // return () => clearTimeout(timeout);
    if (status === 'success') {
      setTimeout(() => {
        setCurrentState(prevState => prevState + 1);
        setStatus('loading');
      }, 500);
    }
  }, [status, loading, setStatus]);
  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          className="w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-2xl"
        >
          <div className="h-96  relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} status={status} statusInfo={statusInfo} />
          </div>

          <div className="bg-gradient-to-t inset-x-0 z-20 bottom-0 bg-white dark:bg-black h-full absolute [mask-image:radial-gradient(900px_at_center,transparent_30%,white)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};