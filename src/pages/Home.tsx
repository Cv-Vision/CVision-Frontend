// Using native HTML elements instead of UI components
import {
  Users,
  Star,
  ArrowRight,
  Briefcase,
  Code,
  Heart,
  GraduationCap,
  Building,
  Truck,
} from "lucide-react";
import { Link } from 'react-router-dom';

const Home = () => {
  const jobCategories = [
    { name: "Tecnología", icon: Code, color: "bg-blue-100 text-blue-700" },
    { name: "Salud", icon: Heart, color: "bg-red-100 text-red-700" },
    { name: "Educación", icon: GraduationCap, color: "bg-green-100 text-green-700" },
    { name: "Finanzas", icon: Building, color: "bg-purple-100 text-purple-700" },
    { name: "Logística", icon: Truck, color: "bg-orange-100 text-orange-700" },
    { name: "Marketing", icon: Users, color: "bg-pink-100 text-pink-700" },
  ]

  const testimonials = [
    {
      name: "María González",
      role: "Desarrolladora Frontend",
      company: "TechCorp",
      quote:
        "Encontré mi trabajo ideal en menos de una semana. La plataforma es muy intuitiva y las ofertas son de alta calidad.",
      rating: 5,
    },
    {
      name: "Carlos Rodríguez",
      role: "Gerente de Ventas",
      company: "SalesForce",
      quote:
        "CVision me conectó con oportunidades que realmente se ajustaban a mi perfil profesional. Excelente experiencia.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "Diseñadora UX",
      company: "CreativeStudio",
      quote: "La mejor plataforma de empleos que he usado. El proceso de aplicación es muy sencillo y rápido.",
      rating: 5,
    },
  ]

  const stats = [
    { number: "50,000+", label: "Empleos Activos" },
    { number: "25,000+", label: "Empresas Registradas" },
    { number: "1M+", label: "Candidatos Exitosos" },
    { number: "95%", label: "Tasa de Satisfacción" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CVision</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/applicant/positions" className="text-muted-foreground hover:text-foreground transition-colors">
              Buscar Empleos
            </Link>
            
            {/* Sección Candidatos */}
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/applicant-register">
                <button className="px-4 py-2 bg-green-500/20 text-green-700 hover:bg-green-500/30 rounded-md text-sm font-medium transition-colors border border-green-500/30">
                  Registrarse
                </button>
              </Link>
            </div>

            {/* Separador */}
            <div className="w-px h-6 bg-gray-300"></div>

            {/* Sección Empresas */}
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Iniciar Sesión
                </button>
              </Link>
              <Link to="/recruiter-register">
                <button className="px-4 py-2 bg-purple-500/20 text-purple-700 hover:bg-purple-500/30 rounded-md text-sm font-medium transition-colors border border-purple-500/30">
                  Para Empresas
                </button>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-teal-50 to-cyan-50">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Encuentra tu próximo
            <span className="text-teal-600"> empleo ideal</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Conectamos talento con oportunidades. Descubre miles de empleos que se ajustan a tu perfil profesional.
          </p>


          {/* CTA Button */}
          <div className="flex justify-center">
            <Link to="/applicant/positions">
              <button className="bg-teal-600 hover:bg-teal-700 text-white text-lg px-8 py-6 rounded-md font-medium flex items-center gap-2 transition-colors">
                Explorar Todas las Ofertas
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-teal-600">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Explora por Categorías</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra oportunidades en los sectores que más te interesan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer group p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Historias de Éxito</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre cómo CVision ha ayudado a profesionales como tú a encontrar su trabajo ideal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-gray-600 mb-6 flex-1 italic">"{testimonial.quote}"</blockquote>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role} en {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-teal-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">¿Listo para encontrar tu próximo empleo?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya han encontrado su trabajo ideal a través de CVision
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/applicant/positions">
              <button className="bg-white text-teal-600 text-lg px-8 py-6 rounded-md font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
                Buscar Empleos Ahora
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/applicant-register">
              <button className="text-lg px-8 py-6 rounded-md font-medium border-2 border-white text-white hover:bg-white hover:text-teal-600 bg-transparent transition-colors">
                Crear mi Perfil
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CVision</span>
              </div>
              <p className="text-gray-400 mb-4">
                La plataforma líder en búsqueda de empleo que conecta talento con oportunidades.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Para Candidatos</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/applicant/positions" className="hover:text-white transition-colors">
                    Buscar Empleos
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Crear CV
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Consejos de Carrera
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Alertas de Empleo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Para Empresas</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/recruiter/dashboard" className="hover:text-white transition-colors">
                    Publicar Empleos
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Buscar Candidatos
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Planes y Precios
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-white transition-colors">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link to="/recruiter/profile" className="hover:text-white transition-colors">
                    Mi Perfil
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Newsletter</h3>
              <p className="text-gray-400 mb-4">Recibe las mejores ofertas de empleo directamente en tu email.</p>
              <div className="flex gap-2">
                <input
                  placeholder="Tu email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 text-white placeholder:text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors">Suscribirse</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CVision. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
