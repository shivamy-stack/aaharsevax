import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12 md:py-16 space-y-4 max-w-3xl mx-auto px-4"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
