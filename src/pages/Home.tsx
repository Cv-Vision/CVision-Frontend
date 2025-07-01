import { useState, useRef, useEffect } from 'react';
import { SparklesIcon, ChartBarIcon, UserGroupIcon, ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import mockupImg from '../assets/homepage_job_posting.png';
import resultsImg from '../assets/homepage_results.png';
import candidatesImg from '../assets/homepage_candidates.png';

// --- (Componente FeatureCard sin cambios) ---
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
            className={`bg-gradient-to-br from-blue-100/80 via-indigo-100/70 to-purple-100/80 backdrop-blur-xl rounded-2xl shadow-lg p-10 border border-gray-200/80 h-full flex flex-col items-center justify-center text-center relative min-h-[480px] ${className}`}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            {...props}
        >
            <div style={{ transform: "translateZ(50px)" }} className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-white/70 mb-8">
                    {icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-xl text-gray-600 leading-relaxed">{description}</p>
            </div>
        </motion.div>
    );
};

// --- (Componente FeatureConnectivity sin cambios) ---
const FeatureConnectivity = ({ hoveredItem }: { hoveredItem: string | null }) => {
    const { scrollYProgress } = useScroll();
    const pathLength = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);
    const paths = {
        card1: "M 500 350 C 400 300, 250 150, 150 100",
        img1: "M 500 350 C 600 300, 750 150, 850 100",
        card2: "M 500 350 C 600 400, 750 500, 850 550",
        img2: "M 500 350 C 400 485, 250 590, 150 640",
    };
    return (
        <div aria-hidden="true" className="hidden md:block absolute inset-0 z-0">
            <svg width="100%" height="100%" viewBox="0 0 1000 700" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A5B4FC" />
                        <stop offset="100%" stopColor="#C4B5FD" />
                    </linearGradient>
                </defs>
                {Object.entries(paths).map(([key, path]) => (
                    <motion.path key={key} d={path} stroke="url(#line-gradient)" strokeWidth={hoveredItem === key ? 4 : 2} strokeDasharray="4 4" style={{ pathLength }} transition={{ duration: 0.3 }} />
                ))}
            </svg>
        </div>
    );
};

// --- (Componente InteractiveBackground sin cambios) ---
const InteractiveBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => setMousePosition({ x: event.clientX, y: event.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl" animate={{ x: -mousePosition.x / 20, y: -mousePosition.y / 20 }} transition={{ type: 'spring', stiffness: 50 }} />
            <motion.div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl" animate={{ x: mousePosition.x / 20, y: mousePosition.y / 20 }} transition={{ type: 'spring', stiffness: 50, delay: 0.1 }} />
            <motion.div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl" animate={{ x: -mousePosition.x / 30, y: mousePosition.y / 30 }} transition={{ type: 'spring', stiffness: 50, delay: 0.2 }} />
        </div>
    );
};

// --- (Componente ScrollProgressBar sin cambios) ---
const ScrollProgressBar = () => {
    const { scrollYProgress } = useScroll();
    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50"
            style={{ scaleX: scrollYProgress }}
        />
    );
};

// --- (Componente FloatingTag sin cambios) ---
const FloatingTag = ({ children, className, duration = 3 }: { children: React.ReactNode; className?: string; duration?: number }) => (
    <motion.div
        className={`absolute bg-white/80 backdrop-blur-sm text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow-lg text-sm ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
    >
        <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    </motion.div>
);

// --- CORRECCIÓN: Marco de la página mucho más visible y con más presencia ---
const PageFrame = () => (
    <div
        aria-hidden="true"
        // Se usa un color más oscuro y opaco (indigo-300/50) y un grosor mayor (6px)
        // La sombra también es más notoria para darle profundidad
        className="pointer-events-none fixed inset-4 z-40 rounded-3xl border-[6px] border-indigo-300/50 shadow-2xl shadow-indigo-500/20"
    />
);


const Home = () => {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 font-sans relative overflow-x-hidden">
            <PageFrame />
            <ScrollProgressBar />
            <InteractiveBackground />

            <main className="relative">
                <div className="container mx-auto px-6 pt-20 pb-10 md:pt-28 md:pb-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 font-semibold px-4 py-1 rounded-full text-sm mb-4">
                                <SparklesIcon className="h-5 w-5" />
                                Reclutamiento Inteligente
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                                Bienvenido a{' '}
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
                            <img
                                src={mockupImg}
                                alt="Vista previa de la app CVision"
                                className="w-full max-w-2xl rounded-2xl shadow-2xl transition-transform duration-500 ease-in-out hover:scale-105"
                            />
                            <FloatingTag className="hidden md:block top-1/4 -left-16" duration={2.8}>AI Scoring</FloatingTag>
                            <FloatingTag className="hidden md:block bottom-1/4 -right-16" duration={3.2}>Análisis de CVs</FloatingTag>
                            <FloatingTag className="hidden md:block top-12 -right-24" duration={3.5}>Filtro Inteligente</FloatingTag>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDownIcon className="h-8 w-8 text-indigo-300" />
                    </motion.div>
                </div>
            </main>

            <section id="features" className="relative py-20 md:py-28">
                <div className="container mx-auto px-6">
                    {/* --- Título de sección flanqueado por líneas --- */}
                    <div className="text-center max-w-4xl mx-auto mb-20">
                        <div className="flex items-center gap-6 mb-4">
                            <div className="flex-grow h-px bg-gradient-to-r from-transparent via-indigo-300 to-indigo-300"></div>
                            <h2 className="flex-shrink-0 text-3xl md:text-4xl font-extrabold text-gray-900">
                                Un proceso de selección, reinventado
                            </h2>
                            <div className="flex-grow h-px bg-gradient-to-l from-transparent via-indigo-300 to-indigo-300"></div>
                        </div>
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
                                    icon={<ChartBarIcon className="h-10 w-10 text-blue-600" />}
                                    title="Análisis Inteligente"
                                    description="Nuestra IA no solo lee, sino que comprende cada CV. Evalúa y puntúa automáticamente a los candidatos, destacando las habilidades y el potencial que realmente importan para el puesto."
                                />
                            </div>
                            <motion.div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('img1')} onMouseLeave={() => setHoveredItem(null)} variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}>
                                <img src={resultsImg} alt="Resultados de análisis" className="w-full max-w-lg mx-auto rounded-2xl shadow-xl transition-transform duration-500 ease-in-out hover:scale-105" />
                            </motion.div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-12 relative z-10">
                            <motion.div
                                className="w-full md:w-5/12"
                                onMouseEnter={() => setHoveredItem('img2')}
                                onMouseLeave={() => setHoveredItem(null)}
                                variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }}
                            >
                                <img src={candidatesImg} alt="Gestión de candidatos" className="w-full max-w-lg mx-auto rounded-2xl shadow-xl transition-transform duration-500 ease-in-out hover:scale-105" />
                            </motion.div>
                            <div className="w-full md:w-5/12" onMouseEnter={() => setHoveredItem('card2')} onMouseLeave={() => setHoveredItem(null)}>
                                <FeatureCard
                                    icon={<UserGroupIcon className="h-10 w-10 text-indigo-600" />}
                                    title="Gestión Centralizada"
                                    description="Olvídate de las hojas de cálculo y los correos interminables. Organiza, filtra y compara perfiles en un panel de control intuitivo, colaborando con tu equipo para tomar decisiones más rápidas y acertadas."
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <footer className="relative mt-16">
                <div className="container mx-auto px-6">
                    <div className="relative flex items-center justify-center mb-12">
                        <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-300 to-transparent"></div>
                        <div className="absolute p-2 bg-indigo-100 rounded-full">
                            <SparklesIcon className="h-6 w-6 text-indigo-500" />
                        </div>
                    </div>
                </div>

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