import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { baseOptions } from '@/lib/layout.shared';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main className="flex w-full flex-col items-center min-h-screen relative overflow-hidden -mt-14 pt-14 bg-black">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-[#4A3D6E] via-[#2A4A6F] to-[#5F2A4A]"
            style={{ filter: 'blur(120px)' }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute top-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-40"
            style={{ filter: 'blur(80px)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 2, delay: 0.25, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30"
            style={{ filter: 'blur(100px)' }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 2, delay: 0.75, ease: 'easeOut' }}
          />
        </motion.div>

        <div className="max-w-[1080px] w-full flex flex-col items-center px-4 md:px-6 relative z-10">
          {/* Content */}
          <motion.div
            className="flex flex-col items-center justify-center min-h-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Enhanced Logo with multiple animations */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <motion.div
                animate={{
                  y: [-5, 5, -5],
                  rotate: [-1, 1, -1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ animation: 'float 3s ease-in-out infinite' }}
              >
                <motion.img
                  src="https://onramp.pingpay.io/ping-pay-logo.png"
                  alt="PingPay Logo"
                  className="w-96 h-auto drop-shadow-2xl"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Buttons with hover effects */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  asChild
                  className="px-8 py-4 text-lg font-medium bg-gradient-to-r from-[#AB9FF2] to-[#9B87F5] hover:from-[#9B87F5] hover:to-[#8B77F4] text-[#3D315E] shadow-lg hover:shadow-xl transition-all duration-300 border-0"
                >
                  <Link
                    to="/docs/$"
                    params={{
                      _splat: '',
                    }}
                  >
                    Open Docs
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-4 text-lg font-medium border-2 border-[#AB9FF2] text-[#AB9FF2] hover:bg-[#AB9FF2] hover:text-[#3D315E] shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <a href="https://demo.onramp.pingpay.io" target="_blank">
                    Use Demo
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </HomeLayout>
  );
}
