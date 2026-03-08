import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard',
    students: 'Students',
    academics: 'Academics',
    incidents: 'Incidents',
    assets: 'Assets',
    messaging: 'Messaging',
    requests: 'Requests',
    finance: 'Finance',
    logout: 'Logout',
    welcome: 'Welcome',
    school_overview: 'School Overview',
    total_students: 'Total Students',
    avg_attendance: 'Avg Attendance',
    active_incidents: 'Active Incidents',
    academic_avg: 'Academic Avg',
    incident_trends: 'Incident Trends',
    attendance_rate: 'Attendance Rate',
    announcements: 'Announcements',
    language: 'Language',
  },
  fr: {
    dashboard: 'Tableau de bord',
    students: 'Étudiants',
    academics: 'Académiques',
    incidents: 'Incidents',
    assets: 'Actifs',
    messaging: 'Messagerie',
    requests: 'Demandes',
    finance: 'Finance',
    logout: 'Déconnexion',
    welcome: 'Bienvenue',
    school_overview: 'Aperçu de l\'école',
    total_students: 'Total des étudiants',
    avg_attendance: 'Présence moyenne',
    active_incidents: 'Incidents actifs',
    academic_avg: 'Moyenne académique',
    incident_trends: 'Tendances des incidents',
    attendance_rate: 'Taux de présence',
    announcements: 'Annonces',
    language: 'Langue',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
