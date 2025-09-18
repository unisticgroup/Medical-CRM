# 🏥 Medical CRM

A comprehensive Customer Relationship Management system designed specifically for medical practices and healthcare providers. Built with modern web technologies to streamline patient management, appointment scheduling, and medical workflows.

![Medical CRM](https://img.shields.io/badge/Medical-CRM-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-purple?style=for-the-badge&logo=vite)

## ✨ Features

### 📊 Dashboard & Analytics
- **Real-time Statistics**: Live updates on leads, appointments, and conversions
- **Performance Metrics**: Track conversion rates, no-show rates, and doctor utilization
- **Today's Schedule**: Quick overview of daily appointments and activities
- **Visual Charts**: Comprehensive analytics with charts and graphs

### 👥 Lead Management
- **Complete CRUD Operations**: Create, Read, Update, Delete leads
- **Lead Stages**: Track progress from initial contact to treatment completion
- **Smart Filtering**: Search by name, email, phone, city, or symptoms
- **Condition Detection**: Automatic medical condition recognition from symptoms
- **Multi-language Support**: Manage patient preferred languages
- **Source Tracking**: Monitor lead sources and campaign effectiveness

### 📅 Appointment Booking System
- **Intelligent Scheduling**: Book appointments with available doctors
- **Real-time Availability**: Check doctor schedules and time slots
- **Appointment Management**: Edit, reschedule, or cancel appointments
- **Status Tracking**: Monitor scheduled, completed, cancelled, and no-show appointments
- **Treatment Plans**: Add notes and treatment recommendations
- **Follow-up Management**: Track required follow-up appointments

### 🩺 Doctor Management
- **Comprehensive Profiles**: Manage doctor information, specialties, and credentials
- **Specialty Mapping**: Link doctors to medical specialties and conditions
- **Availability Management**: Set working hours and appointment slots
- **Language Support**: Track doctor language capabilities
- **Insurance Integration**: Manage accepted insurance plans
- **Performance Tracking**: Monitor patient ratings and experience metrics
- **Telehealth Support**: Enable virtual consultation options

### 👤 Patient Management
- **Patient Records**: Convert leads to comprehensive patient profiles
- **Medical History**: Track treatment history and appointment records
- **Progress Monitoring**: Follow patient journey from initial contact to treatment
- **Communication Tracking**: Log all patient interactions and communications
- **Document Management**: Store and organize patient documents

### 🔬 Medical Conditions Database
- **Condition Library**: Comprehensive database of medical conditions
- **Keyword Mapping**: Intelligent symptom-to-condition matching
- **Specialty Integration**: Link conditions to appropriate medical specialties
- **Search Functionality**: Quick condition lookup and filtering
- **Custom Conditions**: Add practice-specific conditions and treatments

### ⚙️ Settings & Configuration
- **General Settings**: Organization details, timezone, and localization
- **User Management**: Profile management and role-based access
- **Notification Settings**: Customize email, SMS, and system notifications
- **Security Settings**: Password management and access controls
- **Data Management**: Import/export functionality and backup settings
- **Appearance Customization**: Theme selection and UI preferences

### 📤 Export & Reporting
- **CSV Export**: Export data in standard CSV format
- **JSON Export**: Export for system integrations
- **Filtered Exports**: Export only selected/filtered data
- **Comprehensive Reports**: Generate detailed analytics reports
- **Bulk Operations**: Mass data management capabilities

### 🎨 User Experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Orange Theme**: Professional medical-themed color scheme
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Real-time Notifications**: Toast notifications for all actions
- **Search Everything**: Global search across all data types
- **Keyboard Shortcuts**: Efficient navigation and operations

## 🛠️ Tech Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7.1.6
- **UI Library**: Shadcn/ui components
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State Management**: React Context API
- **Form Handling**: React Hook Form (built-in)
- **Date Handling**: Native JavaScript Date APIs
- **Development**: ESLint, TypeScript strict mode

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 8.0 or higher (or yarn/pnpm equivalent)
- **Git**: For version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/unisticgroup/Medical-CRM.git
   cd Medical-CRM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 📦 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks
- `npm run type-check` - Run TypeScript type checking

## 🏗️ Project Structure

```
medical-crm/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── layout/        # Layout components (Header, Sidebar)
│   │   ├── modals/        # Modal dialogs for CRUD operations
│   │   └── ui/            # Shadcn/ui base components
│   ├── contexts/          # React Context providers
│   ├── pages/             # Main application pages
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions and helpers
│   ├── lib/               # Library configurations
│   └── assets/            # Images and static files
├── package.json           # Dependencies and scripts
├── tailwind.config.cjs    # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite build configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application Settings
VITE_APP_NAME="Medical CRM"
VITE_APP_VERSION="1.0.0"

# API Configuration (if integrating with backend)
VITE_API_URL="http://localhost:3000/api"

# Feature Flags
VITE_ENABLE_ANALYTICS="true"
VITE_ENABLE_NOTIFICATIONS="true"
```

### Customization

- **Theme Colors**: Edit `tailwind.config.cjs` to customize the orange theme
- **Components**: Modify components in `src/components/ui/` for custom styling
- **Data Structure**: Update types in `src/types/index.ts` for your specific needs
- **Mock Data**: Edit `src/utils/mock-data.ts` to customize sample data

## 🔒 Security Features

- **Type Safety**: Full TypeScript implementation prevents runtime errors
- **Input Validation**: Form validation on all user inputs
- **Secure Authentication**: Ready for integration with authentication providers
- **Data Sanitization**: Clean data handling throughout the application
- **HIPAA Considerations**: Structure supports medical data compliance requirements

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join discussions for questions and ideas

## 🎯 Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications with WebSocket
- [ ] Mobile app (React Native)
- [ ] Advanced reporting dashboard
- [ ] Integration with medical billing systems
- [ ] HIPAA compliance certification
- [ ] Multi-tenant support
- [ ] Advanced search with Elasticsearch
- [ ] Automated appointment reminders
- [ ] Telehealth video integration

## 👏 Acknowledgments

- **Shadcn/ui** - For the excellent component library
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icons
- **React Team** - For the amazing React framework
- **Vite Team** - For the lightning-fast build tool

---

**Built with ❤️ for the healthcare community**

🤖 *Generated with [Claude Code](https://claude.ai/code)*