import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "../public/locales/uz/translation.json";
import ru from "../public/locales/ru/translation.json";

const savedLang = localStorage.getItem("lang") || "uz";

i18n.use(initReactI18next).init({
  lng: savedLang,
  fallbackLng: "uz",
  interpolation: { escapeValue: false },
  resources: {
    uz: { translation: uz },
    ru: { translation: ru },
  },
});

export default i18n;
