export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-[-10] bg-black overflow-hidden pointer-events-none">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.1); }
          66% { transform: translate(-10px, 10px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
      
      {/* Glows */}
      <div className="absolute -top-[20%] -left-[15%] w-[40vw] h-[150%] max-w-[500px] rotate-12">
        <div className="w-full h-full bg-teal-500/80 blur-[130px] animate-blob mix-blend-screen" />
      </div>
      <div className="absolute -top-[20%] -right-[15%] w-[40vw] h-[150%] max-w-[500px] -rotate-12">
        <div className="w-full h-full bg-yellow-500/80 blur-[130px] animate-blob animation-delay-2000 mix-blend-screen" />
      </div>

      {/* Perforated Ring Overlay */}
      <div 
        className="absolute inset-0 bg-black pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle at center, black 2px, transparent 2.5px, transparent 4px, black 4.5px)`,
          maskSize: '12px 12px',
          WebkitMaskImage: `radial-gradient(circle at center, black 2px, transparent 2.5px, transparent 4px, black 4.5px)`,
          WebkitMaskSize: '12px 12px',
        }}
      />
    </div>
  );
}
