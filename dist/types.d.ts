export declare type TGroup = {
    type: string;
    id: string;
};
export interface ILanguage {
    current: string;
    setLang(newLang: string): void;
}
export interface ITranslation {
    [langCode: string]: {
        [key: string]: string;
    };
}
export interface ITranslationGroup {
    [groupType: string]: {
        [groupId: string]: {
            [langCode: string]: {
                [key: string]: string;
            };
        };
    };
}
export declare type TSupportedLanguages = Array<{
    code: string;
    name: string;
    description?: string;
}>;
export interface ICreate {
    id?: string;
    supportedLanguages: TSupportedLanguages;
    localData?: ITranslation;
    localDataGroup?: ITranslationGroup;
    defaultLang?: string;
}
export interface ISingleInstance {
    id: string;
    lang: ILanguage;
    supportedLanguages: TSupportedLanguages;
    translations: ITranslation;
    translationGroups: ITranslationGroup;
    getTranslation: Function;
    setTranslation: Function;
    defaultLang?: string;
}
export interface IRemoteControlReceiveData {
    event: string;
    payload: any;
    instanceIndex: number;
}
