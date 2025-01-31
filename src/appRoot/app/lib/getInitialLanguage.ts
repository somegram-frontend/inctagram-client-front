export type Language = 'en' | 'ru'

/**
 * Utility function to retrieve the user's saved language from the previous session.
 * Ensures safe access to `localStorage` only in the browser environment.
 *
 * @returns {Language} The saved language or 'en' as the default.
 */
export const getInitialLanguage = (): Language => {
  // Безопасно получаем язык из localStorage (если браузер)

  if (typeof window !== "undefined") {
    return (localStorage.getItem("language") as Language) || "en";
  }
  return "en"; // Если SSR, используем язык по умолчанию
};