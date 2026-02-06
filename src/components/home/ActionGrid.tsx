import React from 'react';
import { ArrowRightLeft, UserPlus, PenLine } from 'lucide-react';

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    subLabel?: string;
    gradient: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, subLabel, gradient }) => (
    <button className={`relative flex flex-col items-center justify-center aspect-square rounded-[24px] ${gradient} p-4 text-white shadow-lg overflow-hidden active:scale-95 transition-transform w-full`}>
        <div className="mb-3">
            {icon}
        </div>
        <span className="text-xs font-medium text-center leading-tight">{label}</span>
        {subLabel && <span className="text-[10px] opacity-80 mt-0.5">{subLabel}</span>}
    </button>
);

export const ActionGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-3 gap-3 px-4 pb-8">
            <ActionButton
                icon={<ArrowRightLeft size={24} />}
                label="Send"
                subLabel="payment"
                gradient="bg-gradient-to-br from-[#7A0E46] to-[#45092A]"
            />
            <ActionButton
                icon={<UserPlus size={24} />}
                label="Add a"
                subLabel="beneficiary"
                gradient="bg-gradient-to-br from-[#9E1256] to-[#590C34]"
            />
            <ActionButton
                icon={<PenLine size={24} />}
                label="Cheque book"
                subLabel="request"
                gradient="bg-gradient-to-br from-[#7A0E46] to-[#45092A]"
            />
        </div>
    );
};
