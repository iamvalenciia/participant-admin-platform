# PFJ (FSY) Participant Management Platform

## Project Overview

I had the opportunity to volunteer by creating a website for the For the Strength of Youth (FSY) Conference — a camp where young people learn more about our Savior, Jesus Christ.

I designed and delivered a fully functional platform to help the conference staff manage participant registrations and records. This solution addresses the challenge of maintaining consistent participant data across multiple church units, providing staff with an efficient management interface. The application streamlines the administrative process, eliminating paper-based systems and reducing errors in participant information management.

Although the conference has now concluded and the system is no longer actively used by the staff, you are welcome to explore and test the platform:

- **Website:** [https://lnkd.in/ekA6EtXQ](https://lnkd.in/ekA6EtXQ)
- **Login credentials:**
  - Email: `pfj2025@gmail.com`
  - Password: `pfj2025.`
- **GitHub Repository:** [https://lnkd.in/eqRE7bZr](https://lnkd.in/eqRE7bZr)

I'm grateful for this experience and excited to keep growing my skills in web development!

## 🛠️ Built With

- **Vue.js 3** with Composition API for the frontend framework
- **TypeScript** as the primary programming language
- **Supabase** JavaScript client for database interactions
- **Pinia** for state management
- **Vue Router** for application routing
- **Vue I18n** for internationalization (supporting English and Spanish)
- **Tailwind CSS** for styling

## Cloud Database

The application utilizes Supabase as its cloud database solution. Supabase provides a PostgreSQL database with real-time capabilities, authentication services, and a comprehensive API.

The database structure consists of two primary tables:

- **participants**: Stores information about each youth attending the event including personal details, assignments, and medical information.
- **users**: Contains authenticated staff members who can access and modify the participant data.

The database implements row-level security to ensure proper access controls are in place for sensitive participant information.

## Development Environment

- Visual Studio Code as the primary IDE
- Git for version control
- Node.js and npm for package management
- Vue.js CLI for project scaffolding and building

## Useful Websites

The following resources were invaluable during development:

- [Supabase Documentation](https://supabase.com/docs)
- [Vue.js Documentation](https://vuejs.org/guide/introduction)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)

## Future Work

Items to implement in future iterations:

- Add reporting functionality to generate participant lists and statistics
- Resolve TypeScript strict mode errors throughout the codebase
- Improve routing with proper guards and transitions
- Implement bulk import/export functionality for participant data
- Add offline capability with data synchronization
- Create a mobile-optimized interface for on-site registration
