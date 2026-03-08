import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    dashboard: 'Dashboard',
    academics: 'Academics',
    students: 'Students',
    finance: 'Finance',
    incidents: 'Incidents',
    assets: 'Assets',
    requests: 'Requests',
    messaging: 'Messaging',
    logout: 'Logout',
    welcome: 'Welcome back to the administration portal.',
    search: 'Search',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    add: 'Add',
    record_incident: 'Record Incident',
    enter_results: 'Enter Results',
    bulk_upload: 'Bulk Upload',
    print_pdf: 'Print PDF',
    report_card: 'Report Card',
    student_id: 'Student ID',
    student_name: 'Student Name',
    class: 'Class',
    enrolment: 'Enrolment',
    export_csv: 'Export CSV',
    print_records: 'Print Records',
    total_revenue: 'Total Revenue',
    outstanding: 'Outstanding',
    collection_rate: 'Collection Rate',
    new_request: 'New Request',
    register_asset: 'Register Asset',
    messages: 'Messages',
    online: 'Online',
    type_message: 'Type a message...',
    select_contact: 'Select a contact',
    critical_warning: 'CRITICAL WARNING',
    occurrence: 'Occurrence',
    subject: 'Subject',
    mark: 'Mark',
    subject_average: 'Subject Average',
    class_position: 'Position in Class',
    teacher_comment: 'Teacher Comment',
    detention_count: 'No. of Detention',
    absent_count: 'No. of Absent',
    overall_percentage: 'Overall %',
    overall_position: 'Overall Position',
    gpa_score: 'GPA Score',
    overall_grade: 'Overall Grade',
    overall_comment: 'Overall Comment',
    class_teacher_comment: 'Class Teacher\'s Comment',
    principal_comment: 'Principal\'s Comment',
    signature: 'Signature',
    select_class: 'Select Class',
    select_student: 'Select Student',
    student_list: 'Student List',
    enter_scores: 'Enter Scores',
    next_student: 'Next Student',
    previous_student: 'Previous Student',
    save_and_next: 'Save & Next',
    all_classes: 'All Classes',
    attendance: 'Attendance',
    gpa: 'GPA',
    percentage: 'Percentage',
    grade: 'Grade',
    summary: 'Summary',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    parent_portal: 'Parent Portal',
    download_report: 'Download Report',
    enter_student_id: 'Enter Student ID',
  },
  fr: {
    dashboard: 'Tableau de bord',
    academics: 'Académique',
    students: 'Étudiants',
    finance: 'Finance',
    incidents: 'Incidents',
    assets: 'Actifs',
    requests: 'Demandes',
    messaging: 'Messagerie',
    logout: 'Déconnexion',
    welcome: 'Bon retour sur le portail d\'administration.',
    search: 'Rechercher',
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    add: 'Ajouter',
    record_incident: 'Enregistrer un incident',
    enter_results: 'Saisir les résultats',
    bulk_upload: 'Téléchargement en masse',
    print_pdf: 'Imprimer en PDF',
    report_card: 'Bulletin Scolaire',
    student_id: 'ID Étudiant',
    student_name: 'Nom de l\'Étudiant',
    class: 'Classe',
    enrolment: 'Effectif',
    export_csv: 'Exporter en CSV',
    print_records: 'Imprimer les dossiers',
    total_revenue: 'Revenu total',
    outstanding: 'Impayés',
    collection_rate: 'Taux de recouvrement',
    new_request: 'Nouvelle demande',
    register_asset: 'Enregistrer un actif',
    messages: 'Messages',
    online: 'En ligne',
    type_message: 'Tapez un message...',
    select_contact: 'Sélectionnez un contact',
    critical_warning: 'AVERTISSEMENT CRITIQUE',
    occurrence: 'Occurrence',
    subject: 'Matière',
    mark: 'Note',
    subject_average: 'Moyenne de la matière',
    class_position: 'Rang dans la classe',
    teacher_comment: 'Commentaire de l\'enseignant',
    detention_count: 'Nombre de retenues',
    absent_count: 'Nombre d\'absences',
    overall_percentage: 'Moyenne générale %',
    overall_position: 'Rang général',
    gpa_score: 'Score GPA',
    overall_grade: 'Mention générale',
    overall_comment: 'Commentaire général',
    class_teacher_comment: 'Commentaire du titulaire',
    principal_comment: 'Commentaire du Principal',
    signature: 'Signature',
    select_class: 'Sélectionner une classe',
    select_student: 'Sélectionner un étudiant',
    student_list: 'Liste des étudiants',
    enter_scores: 'Saisir les notes',
    next_student: 'Étudiant suivant',
    previous_student: 'Étudiant précédent',
    save_and_next: 'Enregistrer et suivant',
    all_classes: 'Toutes les classes',
    attendance: 'Présence',
    gpa: 'GPA',
    percentage: 'Pourcentage',
    grade: 'Note',
    summary: 'Résumé',
    daily: 'Quotidien',
    weekly: 'Hebdomadaire',
    monthly: 'Mensuel',
    quarterly: 'Trimestriel',
    yearly: 'Annuel',
    parent_portal: 'Portail Parent',
    download_report: 'Télécharger le bulletin',
    enter_student_id: 'Entrer l\'ID Étudiant',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
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
