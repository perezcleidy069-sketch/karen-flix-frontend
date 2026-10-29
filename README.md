# GEEKRANK - PLATAFORMA GEEK DE RESEÑAS Y RANKINGS

GeekRank es una aplicación web full-stack diseñada para la comunidad geek, permitiendo a los usuarios registrar, consultar, calificar y rankear películas, animes y series de forma segura. Cuenta con un sistema avanzado de roles (Usuarios y Administradores), autenticación basada en tokens JWT, algoritmos de puntuación ponderada y un diseño responsivo optimizado para múltiples dispositivos (smartphones, tablets y escritorios).

---

## TECNOLOGÍAS Y LIBRERÍAS UTILIZADAS

### Backend (Node.js + Express)
* Node.js & Express: Entorno de ejecución y framework minimalista para la creación de rutas y controladores REST API.
* MongoDB (Driver Oficial): Conexión nativa con la base de datos y manejo de transacciones críticas.
* Autenticación y Seguridad: 
  * jsonwebtoken & passport-jwt: Emisión y validación segura de sesiones mediante JSON Web Tokens.
  * bcrypt: Encriptación robusta de contraseñas de usuario.
  * express-rate-limit: Limitador de peticiones para mitigar ataques de fuerza bruta y abuso de la API.
  * express-validator: Sanitización y validación estricta de datos en los endpoints.
* Configuración y Utilidades:
  * dotenv: Manejo seguro de variables de entorno mediante archivos .env.
  * semver: Control de versiones del API.
  * swagger-ui-express: Documentación interactiva de los endpoints.
  * cors: Configuración de recursos cruzados para la comunicación con el frontend.

### Frontend (Independiente)
* HTML5 & CSS3 (Tailwind CSS): Estructura moderna y diseño visual adaptativo con paleta de colores temática.
* JavaScript (ES6+): Lógica asíncrona mediante fetch() para consumir la API del backend, renderizado dinámico de componentes y control estricto de sesiones y permisos de usuario.

---

## ESTRUCTURA DEL PROYECTO (BACKEND & FRONTEND)

### Arquitectura del Backend (Modular)
```text
geekrank-backend/
├── src/
│   ├── config/            # Configuración de base de datos y estrategias de Passport
│   ├── controllers/       # Lógica de negocio para usuarios, películas, reseñas y categorías
│   ├── middlewares/       # Validadores de roles, rate-limit y seguridad JWT
│   ├── models/            # Esquemas y operaciones directas con el Driver de MongoDB
│   ├── routes/            # Definición de rutas del API (con versionado semver)
│   ├── services/          # Algoritmos de ranking ponderado y gestión de transacciones
│   └── utils/             # Funciones auxiliares y validadores con express-validator
├── .env                   # Variables de entorno confidenciales
├── swagger.json           # Documentación de la API
├── server.js              # Punto de entrada principal de Express
└── package.json           # Dependencias y scripts de ejecución
Arquitectura del Frontend (KAREN-FLIX-FRONTEND)PlaintextKAREN-FLIX-FRONTEND/
├── CSS/
│   └── styles.css         # Estilos personalizados y efectos visuales
├── DATA/
│   └── DATA.json          # Base de datos local consumida de forma dinámica
├── HTML/
│   └── Index.html         # Estructura principal de la interfaz adaptativa (Responsive)
├── app.js                 # Lógica principal del cliente (interacciones, fetch y renderizado)
└── README.md              # Documentación del proyecto
Enlace al Repositorio del Frontend: KAREN-FLIX-FRONTEND RepositoryPASOS PARA INSTALAR Y EJECUTAR1. Clonar los RepositoriosBash# Clonar backend
git clone [https://github.com/tu-usuario/geekrank-backend.git](https://github.com/tu-usuario/geekrank-backend.git)
cd geekrank-backend

# Instalar dependencias del backend
npm install
2. Configurar las Variables de Entorno (.env)Crea un archivo .env en la raíz del backend con los siguientes parámetros:Code snippetPORT=5000
MONGO_URI=mongodb://localhost:27017/geekrank
JWT_SECRET=tu_clave_secreta_jwt_super_segura
3. Ejecutar el Servidor en DesarrolloBashnpm run dev
4. Ejecutar el FrontendAbre la carpeta KAREN-FLIX-FRONTEND en tu editor y utiliza una extensión de servidor local como Live Server para levantar el archivo HTML/Index.html.EJEMPLOS DE ENDPOINTS DE LA APIMétodoEndpointDescripciónRestricción / RolPOST/api/v1/auth/registerRegistro de nuevo usuario en el sistema.PúblicoPOST/api/v1/auth/loginInicio de sesión y generación de Token JWT.PúblicoGET/api/v1/moviesObtiene el listado completo de películas y animes aprobados.PúblicoPOST/api/v1/moviesPropone una nueva entrada de contenido multimedia.Usuario / AdminPATCH/api/v1/movies/:id/approveAprueba una propuesta pendiente de contenido.Solo AdministradorPOST/api/v1/movies/:id/reviewsCrea una reseña y calificación numérica (1-10).Requiere Sesión ActivaPLANEACIÓN DEL PROYECTO (METODOLOGÍA SCRUM)El desarrollo del software se llevó a cabo bajo un marco de trabajo SCRUM dividido en 2 Sprints principales:Sprint 1: Configuración de la arquitectura base del backend, conexión nativa con MongoDB, esquemas de usuario, sistema de seguridad JWT, hashing con Bcrypt y estructuración inicial del frontend HTML/CSS/JS.Sprint 2: Implementación del CRUD completo de películas, algoritmos de ranking ponderado, gestión de reseñas con restricción de votación por sesión iniciada, panel de administración con edición directa y optimización responsive multidispositivo.VIDEO DE DEMOSTRACIÓN Y DEFENSAPuedes visualizar la presentación completa del proyecto y la demostración funcional a través del siguiente enlace:Enlace al Video de Presentación: Ver Video de Demostración