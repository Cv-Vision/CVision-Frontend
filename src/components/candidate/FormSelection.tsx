import { FC, ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
    return (
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl shadow-lg border border-blue-100 w-full mb-8">
            <h2 className="text-xl font-bold text-blue-800 mb-6">{title}</h2>
            <div className="flex flex-col gap-6">{children}</div>
        </section>
    );
};

export default FormSection;
