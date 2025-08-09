import { FC, ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
    return (
        <section className="bg-blue-50 p-6 rounded-xl shadow-sm w-full">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    );
};

export default FormSection;
