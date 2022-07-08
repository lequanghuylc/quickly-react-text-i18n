import { useState, useEffect } from 'react';
import { ICreate, TGroup, ILanguage } from './types';
import { useEvent, emitEvent } from './utils/useEvent';
import { parseTextTemplate, parseTranslationKey } from './utils/parseTextTemplate';
import { useTranslationGroupContext, initial as defaultGroup } from './TranslationGroup';
import InstaceController from './InstaceController';
import { EVENT_NAME } from './eventName';

export const create = ({ localData, localDataGroup, defaultLang, id } : ICreate) => {

  const instanceId = id || String(Math.random()).replace('.', '');

  const isLocalDataValid = (() => {
    if (!localData) return true;
    for (let langCode in localData) {
      if (typeof localData[langCode] !== 'object') return false;
    }
    return true;
  })();
  if (!isLocalDataValid) throw Error('localData is not valid');

  const translations = localData || {};
  const translationGroups = localDataGroup || {};

  const lang : ILanguage = {
    current: defaultLang || 'en',
    setLang: (newLang : string) => {
      lang.current = newLang;
      emitEvent<string>(EVENT_NAME.UPDATE_LANG(instanceId), newLang);
    }
  }

  const getTranslation = (key : string | unknown, lang: string, group : TGroup, defaultValue: any) : string => {
    if (typeof key !== 'string') return defaultValue;
    if (group.id === defaultGroup.id && group.type === defaultGroup.type) {
      // use translations variable
      const langData = translations[lang];
      if (!langData) return defaultValue;
      return langData[key] || defaultValue;
    }
    const valueInNoGroup = getTranslation(key, lang, defaultGroup, defaultValue);
    if (!translationGroups[group.type] || !translationGroups[group.type][group.id])
      return valueInNoGroup;
    return translationGroups[group.type][group.id]?.[lang]?.[key] || valueInNoGroup;
  }

  const setTranslation = (key : string, lang: string, group : TGroup, value: string) => {
    
  };

  const useParsedTranslation = (t : string, componentName : string = '') => {
    const [group] = useTranslationGroupContext();
    const translationKey = parseTranslationKey(t);
    const { key, inputs } = translationKey;
    const initalValue = getTranslation(key, lang.current, group, t);
    const [text, setText] = useState({
      raw: initalValue,
      parsed: parseTextTemplate(initalValue, inputs, componentName),
    });

    useEvent<string>(EVENT_NAME.UPDATE_ALL, () => {
      const newValue = getTranslation(key, lang.current, group, t);
      if (newValue !== text.raw) setText({
        raw: newValue,
        parsed: parseTextTemplate(newValue, inputs, componentName),
      });
    }, [text.raw, t, componentName, getTranslation, group]);

    useEvent<string>(EVENT_NAME.UPDATE_LANG(instanceId), (newLang) => {
      const newValue = getTranslation(key, newLang, group, t);
      if (newValue !== text.raw) setText({
        raw: newValue,
        parsed: parseTextTemplate(newValue, inputs, componentName),
      });
    }, [text.raw, t, componentName, getTranslation, group]);

    useEffect(() => {
      const newValue = getTranslation(key, lang.current, group, t);
      setText({
        raw: newValue,
        parsed: parseTextTemplate(newValue, inputs, componentName),
      });
    }, [text.raw, t, componentName, getTranslation, group]);

    useEvent<string>(EVENT_NAME.UPDATE_TRANSLATION_KEY(String(key), lang.current, instanceId), (newTranslation) => {
      if (typeof key !== 'string') return;
      if (newTranslation !== text.raw) setText({
        raw: newTranslation,
        parsed: parseTextTemplate(newTranslation, inputs, componentName),
      });
    }, [text.raw, t, key, group, setTranslation]);

    return !text.parsed ? text.raw : text.parsed;
  }

  InstaceController.addNewInstance({
    id: instanceId,
    lang,
    translations,
    translationGroups,
    getTranslation,
    setTranslation,
    defaultLang,
  })

  return { lang, useTranslation: useParsedTranslation }
}