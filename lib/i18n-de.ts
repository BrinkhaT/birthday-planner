/**
 * German localization strings for Birthday Planner
 * All UI text must be in German per Constitution Principle VI
 */

export const i18nDE = {
  // Modal titles
  modal: {
    addTitle: "Geburtstag hinzufügen",
    editTitle: "Geburtstag bearbeiten",
    deleteTitle: "Geburtstag löschen?",
  },

  // Form labels
  form: {
    nameLabel: "Name",
    namePlaceholder: "Name eingeben",
    birthdateLabel: "Geburtsdatum",
    birthdatePlaceholder: "TT.MM. oder TT.MM.JJJJ",
  },

  // Buttons
  buttons: {
    save: "Speichern",
    cancel: "Abbrechen",
    delete: "Löschen",
    add: "Hinzufügen",
    edit: "Bearbeiten",
    confirm: "Bestätigen",
  },

  // Tooltips
  tooltips: {
    addBirthday: "Geburtstag hinzufügen",
    editBirthday: "Geburtstag bearbeiten",
    deleteBirthday: "Geburtstag löschen",
  },

  // Validation messages
  validation: {
    nameRequired: "Name ist erforderlich",
    nameMaxLength: "Name darf maximal 100 Zeichen lang sein",
    birthdateRequired: "Geburtsdatum ist erforderlich",
    birthdateInvalid: "Ungültiges Datum",
    birthdateFuture: "Geburtsdatum kann nicht in der Zukunft liegen",
    birthdateUnrealistic: "Geburtsdatum ist unrealistisch",
  },

  // Confirmation messages
  confirmation: {
    deleteMessage: "Möchten Sie diesen Geburtstag wirklich löschen?",
    deleteWarning: "Diese Aktion kann nicht rückgängig gemacht werden.",
    deleteName: (name: string) => `Geburtstag von ${name} löschen`,
  },

  // Success messages
  success: {
    added: "Geburtstag erfolgreich hinzugefügt",
    updated: "Geburtstag erfolgreich aktualisiert",
    deleted: "Geburtstag erfolgreich gelöscht",
  },

  // Error messages
  error: {
    saveFailed: "Fehler beim Speichern",
    deleteFailed: "Fehler beim Löschen",
    loadFailed: "Fehler beim Laden",
    notFound: "Geburtstag nicht gefunden",
    generic: "Ein Fehler ist aufgetreten",
  },

  // Loading states
  loading: {
    saving: "Wird gespeichert...",
    deleting: "Wird gelöscht...",
    loading: "Lädt...",
  },

  // Theme switcher
  theme: {
    toggleLight: "Zu hellem Modus wechseln",
    toggleDark: "Zu dunklem Modus wechseln",
    themeLabel: "Theme",
    lightMode: "Heller Modus",
    darkMode: "Dunkler Modus",
    systemMode: "System",
  },
} as const;

export type I18nDE = typeof i18nDE;
