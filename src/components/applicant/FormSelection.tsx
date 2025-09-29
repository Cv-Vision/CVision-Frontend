import { FC, ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
    return (
        <div className="w-full">
            <h2 className="text-lg text-gray-900 font-semibold mb-4">{title}</h2>
            <div className="space-y-4">{children}</div>
        </div>
    );
};

export default FormSection;
