interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressStepper({ currentStep, totalSteps, steps }: ProgressStepperProps) {
  return (
    <div className="healthcare-card p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 sm:mb-0">New Staff Assessment</h2>
        <div className="text-sm text-slate-500">
          Step {currentStep + 1} of {totalSteps}
        </div>
      </div>
      
      {/* Desktop Progress */}
      <div className="hidden md:flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              index <= currentStep 
                ? 'bg-primary text-white' 
                : 'bg-slate-200 text-slate-600'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-3 text-sm font-medium ${
              index <= currentStep ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {step}
            </span>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 bg-slate-200 rounded ml-4 min-w-[40px]">
                <div 
                  className="h-1 bg-primary rounded transition-all duration-300" 
                  style={{ width: index < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                index <= currentStep 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {index + 1}
              </div>
              <span className={`mt-2 text-xs text-center ${
                index <= currentStep ? 'text-slate-900 font-medium' : 'text-slate-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
