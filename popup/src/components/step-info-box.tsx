import type { StepBox } from "./step-box-types";

interface StepInfoBoxProps {
  box: StepBox;
}

export function StepInfoBox({ box }: StepInfoBoxProps) {
  return (
    <div
      className={`w-full flex gap-3 bg-[#232228] border ${box.color} rounded-lg p-4 mb-4`}
    >
      <div className="flex mt-1.5">{box.icon}</div>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-lg text-gray-100">{box.title}</span>
        <p className="text-gray-400 text-sm">{box.desc}</p>
      </div>
    </div>
  );
}
