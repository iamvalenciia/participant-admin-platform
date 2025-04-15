# Overview

As a software engineer, I developed a web application to manage participants in a church activity called PFJ (Para la Fortaleza de la Juventud/For the Strength of Youth). This solution addresses the challenge of maintaining consistent participant data across multiple church units, providing staff with an efficient management interface.

The application integrates with Supabase cloud database services to store and retrieve participant information securely. Users can search for participants, view detailed information, make updates to assignments (groups, companies, room assignments), and track medical information when necessary.

This project was created to streamline the administrative process for church staff managing youth activities, eliminating paper-based systems and reducing errors in participant information management.

[Link of the Website](https://pfj-admin.netlify.app/)

# Cloud Database

The application utilizes Supabase as its cloud database solution. Supabase provides a PostgreSQL database with real-time capabilities, authentication services, and a comprehensive API.

The database structure consists of two primary tables:

- **participants**: Stores information about each youth attending the event including personal details, assignments, and medical information.
- **users**: Contains authenticated staff members who can access and modify the participant data.

The database implements row-level security to ensure proper access controls are in place for sensitive participant information.

# Development Environment

The development environment for this project included:

- Visual Studio Code as the primary IDE
- Git for version control
- Node.js and npm for package management
- Vue.js CLI for project scaffolding and building

The application was built using:

- TypeScript as the primary programming language
- Vue.js 3 with Composition API for the frontend framework
- Pinia for state management
- Vue Router for application routing
- Vue I18n for internationalization (supporting English and Spanish)
- Supabase JavaScript client for database interactions
  -Tailwind CSS for styling

# Useful Websites

The following resources were invaluable during development:

- [Supabase Documentation](https://supabase.com/docs)
- [Vue.js Documentation](https://vuejs.org/guide/introduction)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue I18n Documentation](https://vue-i18n.intlify.dev/)

# Future Work

Items to implement in future iterations:

- Add reporting functionality to generate participant lists and statistics
- Resolve TypeScript strict mode errors throughout the codebase
- Improve routing with proper guards and transitions
- Implement bulk import/export functionality for participant data
- Add offline capability with data synchronization
- Create a mobile-optimized interface for on-site registration
