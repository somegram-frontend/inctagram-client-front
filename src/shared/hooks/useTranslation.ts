import {en, ru} from "@/locales";
import {Translation} from "@/locales/type";
import {useRouter} from "next/router";

// Перегрузка для случая, когда ключ не передан: возвращаем весь объект перевода
export function useTranslation(): Translation;
// Перегрузка для случая, когда ключ передан: возвращаем значение перевода по этому ключу
export function useTranslation<K extends keyof Translation>(key: K): Translation[K];
/**
 * Хук для получения переводов.
 *
 * Данный хук возвращает объект переводов для выбранного языка.
 * Если передать опциональный параметр `key`, то возвращается конкретное значение перевода по этому ключу,
 * что позволяет избежать избыточной вложенности при работе с объектом переводов.
 *
 * @example
 * // Пример 1: получение полного объекта переводов
 * const t = useTranslation();
 * t.home; // возвращает весь объект t который находится в хуке
 *
 * @example
 * // Пример 2: получение конкретного перевода по ключу "home"
 * const homeTranslation = useTranslation("home");
 * homeTranslation; // если бы не передали ключ home, было бы как в первом примере t.home.homeTranslation
 *
 * @template K - ключ из объекта Translation
 * @param {K} [key] - Опциональный ключ для доступа к конкретному переводу.
 * @returns {K extends keyof Translation ? Translation[K] : Translation} Если ключ указан, возвращает значение перевода по этому ключу, иначе – полный объект переводов.
 */
export function useTranslation<K extends keyof Translation>(key?: K): Translation | Translation[K] {

  const router = useRouter();
  const t = router.locale === 'en' ? en : ru;


  return key ? t[key] : t;
}
