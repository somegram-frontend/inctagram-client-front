import {useAppSelector} from "@/store";
import {selectorLanguage} from "@/appRoot/app";
import {translations} from "@/locales";
import {useEffect, useState} from "react";

export const useTranslation = () => {
  const language = useAppSelector(selectorLanguage);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
// Пока язык не определён, возвращаем английский - это нужно для SSR
  return isMounted ? translations[language] : translations["en"];
}