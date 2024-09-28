import React from 'react';
declare type TReactObject = {
    $$typeof: any;
    [other: string]: any;
};
declare type TUserContent = string | number | Array<string | number | TReactObject>;
export declare const parseTranslationKey: (userContent: TUserContent) => {
    key: TUserContent;
    inputs: Array<string | TReactObject>;
};
export declare const parseTextTemplate: (template: string, inputs: Array<string | TReactObject>, componentName: string) => React.ReactNode | undefined;
export {};
