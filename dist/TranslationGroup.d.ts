import React from "react";
declare type TTranslationGroupContext = {
    type: string;
    id: string;
};
export declare const initial: TTranslationGroupContext;
interface IStyleProviderProps {
    type?: TTranslationGroupContext['type'];
    id?: TTranslationGroupContext['id'];
    children?: any;
}
export declare const TranslationGroupProvider: (props: IStyleProviderProps) => JSX.Element;
export declare const useTranslationGroupContext: () => [TTranslationGroupContext, React.Dispatch<React.SetStateAction<TTranslationGroupContext>>];
export {};
