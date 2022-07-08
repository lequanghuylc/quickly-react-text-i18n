import React, {
  createContext,
  useContext,
  useState,
} from "react";

type TTranslationGroupContext = {
  type: string,
  id: string,
}

export const initial : TTranslationGroupContext = {
  type: 'no-group',
  id: 'none',
};

const TranslationGroupContext = createContext<
  [TTranslationGroupContext, React.Dispatch<React.SetStateAction<TTranslationGroupContext>>]
>([initial, () => {}]);


interface IStyleProviderProps {
  type?: TTranslationGroupContext['type'],
  id?: TTranslationGroupContext['id'],
  children?: any,
}

export const TranslationGroupProvider = (props : IStyleProviderProps) => {
  const groupInitial = !props.type || !props.id ? initial : {
    type: props.type,
    id: props.id,
  }
  const [group, setGroup] = useState<TTranslationGroupContext>(groupInitial);
  return (
    <TranslationGroupContext.Provider value={[group, setGroup]}>
      {props.children}
    </TranslationGroupContext.Provider>
  );
}

export const useTranslationGroupContext = () => {
  return useContext(TranslationGroupContext);
}