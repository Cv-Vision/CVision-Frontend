import { FC, ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
    return (
        <div className="border-teal-100 border rounded-lg w-full mb-6">
            <div className="p-6">
                <h2 className="text-lg text-teal-600 font-semibold mb-4">{title}</h2>
                <div className="space-y-4">{children}</div>
            </div>
        </div>
    );
};

export default FormSection;
