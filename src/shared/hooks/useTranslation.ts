import {useAppSelector} from "@/store";
import {selectorLanguage} from "@/appRoot/app";
import {translations} from "@/locales";

export const useTranslation = () => {
  const language = useAppSelector(selectorLanguage);
  return translations[language];
};
