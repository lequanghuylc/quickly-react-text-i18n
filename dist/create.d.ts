/// <reference types="react" />
import { ICreate, TGroup, ILanguage, TSupportedLanguages } from './types';
export declare const create: ({ localData, supportedLanguages, localDataGroup, defaultLang, id }: ICreate) => {
    lang: ILanguage;
    useTranslation: (t: string, componentName?: string) => string | number | true | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactFragment;
    useSupportedLanguages: () => TSupportedLanguages;
    _t: (t: string, group?: TGroup, componentName?: string) => string | number | true | import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | import("react").ReactFragment;
};
