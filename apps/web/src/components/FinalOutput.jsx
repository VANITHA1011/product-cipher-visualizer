const FinalOutput = ({ text, mode }) => {
  if (!text) return null;

  const labels = {
    caesar: 'Caesar Cipher',
    railFence: 'Rail Fence Cipher',
    product: 'Product Cipher (Caesar + Rail Fence)',
  };

  return (
    <div className="mt-6 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
      <div className="bg-gray-800 px-6 py-3 text-center">
        <span className="text-gray-300 text-sm font-semibold uppercase tracking-widest">
          Final Cipher Text — {labels[mode] ?? mode}
        </span>
      </div>
      <div className="bg-gray-900 px-6 py-6 text-center">
        <p className="text-green-400 font-mono text-4xl font-bold tracking-widest break-all">
          {text.toUpperCase()}
        </p>
      </div>
    </div>
  );
};

export default FinalOutput;
