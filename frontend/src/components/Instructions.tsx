import { motion } from "framer-motion";

type InructionsProps = {
  label: string;
  instruction: string;
  setInstruction: React.Dispatch<React.SetStateAction<boolean>>;
};

const Instructions = ({
  label,
  instruction,
  setInstruction,
}: InructionsProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setInstruction(false)}
    >
      <motion.div
        className="bg-base-300 relative rounded-2xl shadow-xl px-7 py-6 w-full max-w-[360px] text-center space-y-4"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold text-primary/90">{label}</h2>
        <p className="text-md text-base-content">{instruction}</p>

        <button
          className="btn btn-primary btn-md px-5"
          onClick={() => setInstruction(false)}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Instructions;
