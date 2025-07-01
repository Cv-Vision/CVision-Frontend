import { useState, useRef, useEffect } from 'react';
import { SparklesIcon, ChartBarIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import mockupImg from '../assets/homepage_job_posting.png';
import resultsImg from '../assets/homepage_results.png';
import candidatesImg from '../assets/homepage_candidates.png';

// --- MEJORA 1: Tarjeta con efecto 3D Inclinable ---
const FeatureCard = ({ icon, title, description, className, ...props }: { icon: React.ReactNode; title: string; description: string; className?: string; [key: string]: any }) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const mouseY = e.clientY - top;
        const normalizedX = (mouseX / width) - 0.5;
        const normalizedY = (mouseY / height) - 0.5;
        x.set(normalizedX);
        y.set(normalizedY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className={`bg-gradient-to-br from-blue-100/80 via-indigo-100/70 to-purple-100/80 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-gray-200/80 h-full relative ${className}`}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            {...props}
        >
            <div
                style={{
                    transform: "translateZ(50px)",
                    transformStyle: "preserve-3d",
                }}
                className="absolute inset-4 flex flex-col items-center justify-center"
            >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white/70 mb-6">
                    {icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
                <p className="text-lg text-gray-600 text-center">{description}</p>
            </div>
        </motion.div>
    );
};

const FeatureConnectivity = ({ hoveredItem }: { hoveredItem: string | null }) => {
    const { scrollYProgress } = useScroll();
    const pathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

    const paths = {
        card1: "M 500 350 C 400 300, 250 150, 150 100",
        img1: "M 500 350 C 600 300, 750 150, 850 100",
        card2: "M 500 350 C 600 400, 750 550, 850 600",
        img2: "M 500 350 C 400 400, 250 550, 150 600",
    };

    return (
        <div aria-hidden="true" className="hidden md:block absolute inset-0 z-0">
            <svg width="100%" height="100%" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A5B4FC" />
                        <stop offset="100%" stopColor="#C4B5FD" />
                    </linearGradient>
                </defs>
                {Object.entries(paths).map(([key, path]) => (
                    <motion.path
                        key={key}
                        d={path}
                        stroke="url(#line-gradient)"
                        strokeWidth={hoveredItem === key ? 4 : 2}
                        strokeDasharray="4 4"
                        style={{ pathLength }}
                        transition={{ duration: 0.3 }}
                    />
                ))}
            </svg>
        </div>
    );
};

// --- MEJORA 2: Componente para el fondo interactivo ---
const InteractiveBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setMousePosition({ x: event.clientX, y: event.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
                animate={{ x: -mousePosition.x / 20, y: -mousePosition.y / 20 }}
                transition={{ type: 'spring', stiffness: 50 }}
            />
            <motion.div
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl"
                animate={{ x: mousePosition.x / 20, y: mousePosition.y / 20 }}
                transition={{ type: 'spring', stiffness: 50, delay: 0.1 }}
            />
            <motion.div
                className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl"
                animate={{ x: -mousePosition.x / 30, y: mousePosition.y / 30 }}
                transition={{ type: 'spring', stiffness: 50, delay: 0.2 }}
            />
        </div>
    );
};

const Home = () => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans relative overflow-x-hidden">
            <InteractiveBackground />

            <main className="relative">
                <div className="container mx-auto px-6 py-20 md:py-28">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">
                                <SparklesIcon className="h-5 w-5" />
                                Reclutamiento Inteligente
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Bienvenido a{' '}
                                {/* --- MEJORA 3: Span con animación de brillo --- */}
                                <motion.span
                                    className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                    style={{ backgroundSize: "200% auto" }}
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 5, ease: "linear", repeat: Infinity }}
                                >
                                    CVision
                                </motion.span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0 mb-8">
                                Tu plataforma que revoluciona la forma de encontrar y evaluar talento usando el poder de la IA.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a href="#" className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                                    Empezar Ahora
                                    <ArrowRightIcon className="h-5 w-5" />
                                </a>
                                <a href="#" className="inline-flex items-center justify-center bg-transparent text-indigo-600 font-bold text-lg px-8 py-4 rounded-lg hover:bg-indigo-100/50 transition-colors duration-300">
                                    Ver Demo
                                </a>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-center h-full">
                            <img src={mockupImg} alt="Vista previa de la app CVision" className="w-full max-w-2xl rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out hover:scale-105" />
                        </div>
                    </div>
                </div>
            </main>

            <section id="features" className="relative py-20 md:py-28">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Un proceso de selección, reinventado</h2>
                        <p className="text-lg text-gray-600">
                            Sigue el flujo de cómo CVision transforma tu manera de contratar, paso a paso.
                        </p>
                    </div>

                    <motion.div
                        className="relative"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ staggerChildren: 0.2 }}
                    >
                        <FeatureConnectivity hoveredItem={hoveredItem} />

                        <div className="hidden md:flex absolute inset-0 items-center justify-center z-10 pointer-events-none">
                            <motion.div
                                className="text-lg font-semibold text-indigo-600 bg-indigo-100/70 px-6 py-2.5 rounded-full shadow-md backdrop-blur-sm"
                                variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.5, duration: 0.5 } } }}
                            >
                                La IA impulsa cada paso
                            </motion.div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12 relative z-10 mb-16 md:mb-32">
                            <div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('card1')} onMouseLeave={() => setHoveredItem(null)}>
                                <FeatureCard
                                    icon={<ChartBarIcon className="h-8 w-8 text-blue-600" />}
                                    title="Análisis Inteligente"
                                    description="Nuestra IA evalúa y puntúa automáticamente cada CV, destacando las habilidades y experiencia más relevantes."
                                />
                            </div>
                            <motion.div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('img1')} onMouseLeave={() => setHoveredItem(null)} variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}>
                                <img src={resultsImg} alt="Resultados de análisis" className="w-full max-w-lg mx-auto rounded-2xl shadow-xl transition-transform duration-500 ease-in-out hover:scale-105" />
                            </motion.div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12 relative z-10">
                            <motion.div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('img2')} onMouseLeave={() => setHoveredItem(null)} variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}>
                                <img src={candidatesImg} alt="Gestión de candidatos" className="w-full max-w-lg mx-auto rounded-2xl shadow-xl transition-transform duration-500 ease-in-out hover:scale-105" />
                            </motion.div>
                            <div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('card2')} onMouseLeave={() => setHoveredItem(null)}>
                                <FeatureCard
                                    icon={<UserGroupIcon className="h-8 w-8 text-indigo-600" />}
                                    title="Gestión Centralizada"
                                    description="Organiza, filtra y compara perfiles en un solo lugar. Colabora con tu equipo y toma decisiones basadas en datos."
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="relative mt-16">
                <div className="container mx-auto px-6 py-8 text-center text-gray-600">
                    <p className="mb-4">&copy; {new Date().getFullYear()} CVision. Todos los derechos reservados.</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center text-gray-500">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Sobre nosotros</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Contacto</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Términos y condiciones</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;