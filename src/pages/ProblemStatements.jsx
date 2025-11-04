const ProblemStatements = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-200">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-52 h-52 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-ping"></div>
      <div className="absolute top-1/2 right-1/3 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>

      {/* Content */}
      <div className="relative text-center px-4">
        <h1 className="text-6xl md:text-7xl font-extrabold text-blue-800 drop-shadow-lg animate-bounce">
          Coming Soon
        </h1>
        <p className="mt-6 text-lg md:text-xl text-blue-600 font-medium">
          Problem Statements will be revealed soon — stay tuned! ⚡
        </p>

        {/* Optional loading line */}
        <div className="mt-10 w-48 h-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-full animate-pulse mx-auto"></div>
      </div>
    </div>
  );
};

export default ProblemStatements;
