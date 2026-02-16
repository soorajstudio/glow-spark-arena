import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

const GameLayout = ({ title, icon, children }: { title: string; icon: string; children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        className="mb-6 flex items-center gap-4"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 rounded-lg border border-primary/30 bg-card px-5 py-3 font-body text-lg text-primary transition-all hover:bg-primary/10"
        >
          <ArrowLeft size={24} />
          Back
        </button>
        <h1 className="font-display text-4xl font-bold text-foreground md:text-5xl">
          <span className="mr-3">{icon}</span>
          {title}
        </h1>
      </motion.div>
      {children}
    </div>
  );
};

export default GameLayout;
