
import React from 'react';

interface GuidancePanelProps {
  guidanceMessage: string | null;
  isLoading: boolean;
  error: string | null;
  onGetGuidance: () => void;
}

const GuidancePanel: React.FC<GuidancePanelProps> = ({ guidanceMessage, isLoading, error, onGetGuidance }) => {
  return (
    <div className="bg-card shadow-lg rounded-lg p-6 mb-6 sticky bottom-0 z-10 border-t-4 border-primary">
      <h2 className="text-2xl font-semibold text-text mb-4">Smart Guidance: Pay Same Day?</h2>
      <button
        onClick={onGetGuidance}
        disabled={isLoading}
        className="w-full bg-accent hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Getting Guidance...' : 'Get Smart Guidance'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-danger-100 border border-danger text-danger rounded-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {guidanceMessage && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-textLight">
          <p className="font-semibold text-primary mb-2">Gemini Says:</p>
          <p className="whitespace-pre-wrap">{guidanceMessage}</p>
        </div>
      )}

      {!guidanceMessage && !isLoading && !error && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md text-textLight text-center">
          <p>Click "Get Smart Guidance" to receive personalized advice on managing your credit.</p>
        </div>
      )}
    </div>
  );
};

export default GuidancePanel;
