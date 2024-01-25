import { motion } from 'framer-motion';

export function ChallengeTier() {
  // framer-motion 애니메이션 객체
  const tierAnimation = {
    initial: { scale: 1, opacity: 0.7 },
    animate: { scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] },
    transition: { duration: 1, ease: 'easeInOut', repeat: Infinity },
  };

  return (
    <motion.div
      initial={tierAnimation.initial}
      animate={tierAnimation.animate}
      transition={tierAnimation.transition}
      className="tier-mark-animation"
    >
      <img src="path_to_your_tier_mark_image.png" alt="Tier Mark" />
    </motion.div>
  );
}
