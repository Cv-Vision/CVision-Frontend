import { FC, ReactNode } from "react";

interface FormSectionProps {
    title: string;
    children: ReactNode;
}

const FormSection: FC<FormSectionProps> = ({ title, children }) => {
    return (
        <section className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50 shadow-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="flex flex-col gap-4">{children}</div>
        </section>
    );
};

export default FormSection;
