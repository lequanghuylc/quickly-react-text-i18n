import React from 'react';

/*
parse user generated text to translation key and input
example: 'Edit _%src/App.js%_ and save to reload.'
will turn to:
[object Object] {
  inputs: ["src/App.js"],
  key: "Edit %s and save to reload."
}
*/
type TReactObject = { $$typeof: any, [other: string]: any }
type TUserContent = string | number | Array<string | number | TReactObject>
export const parseTranslationKey = (userContent: TUserContent) : { key: TUserContent, inputs: Array<string | TReactObject> } => {
  // case 1: 'Edit _%src/App.js%_ and save to reload.'
  // case 2: ['Edit _%', 'src/App.js', '%_ and save to reload.']
  // case 3: ['Edit _%', {$$typeof: Symbol(react.element)}, '%_ and save to reload.']
  // case 4: [mix of case2 and case3]
  // case 4 example: ['Pure string: Edit _%src/App.js%_ and save to reload. and Tsx _%', <code>src/App.js</code> ,'%_ another here']

  if (typeof userContent === 'number') return { key: userContent, inputs: [] };
  // case 1
  if (typeof userContent === 'string') {
    const text = userContent;
    const parts = text.match(/_%((.(?!_%))+?)%_/g);
    if (!parts) return { key: text, inputs: [] };
    let key = '';
    let inputs : any = [];
    let lastIndex = 0;
    parts.forEach((val, partIndex) => {
      const index = text.indexOf(val);
      key += text.slice(lastIndex, index);
      const input = val.replace('_%', '').replace('%_', '')
      key += '%s';
      lastIndex = index + val.length;
      inputs.push(input);
    })
    if (lastIndex < text.length - 1) {
      key += text.slice(lastIndex, text.length);
    }
  
    return { key, inputs }
  }

  // handle case 2:
  // check iteratible using .filter instead of checking array Array.isArray
  if (typeof userContent !== 'string' && !!userContent.filter) {
    const isAllString = userContent.filter(val => typeof val === 'string' || typeof val === 'number').length === userContent.length;
    if (isAllString) {
      const textContent = userContent.join('');
      return parseTranslationKey(textContent);
    }
  }

  // handle case 3 & 4
  interface IInputIndex {
    [index: string]: any,
  }
  const inputIndex : IInputIndex = {};
  let allInputs : Array<string | TReactObject> = [];
  const resultContent = userContent.slice();
  resultContent.forEach((val, valIndex) => {
    if (typeof val === 'string') {
      const parsePart = parseTranslationKey(val);
      if (val === parsePart.key) return;
      resultContent[valIndex] = parsePart.key as string;
      inputIndex[valIndex] = parsePart.inputs;
      allInputs = [
        ...allInputs,
        ...parsePart.inputs,
      ];
    }
    if (typeof val === 'object' && !!val.$$typeof) {
      if (valIndex === 0 || valIndex === resultContent.length - 1) return;
      if (
        typeof resultContent[valIndex - 1] === 'string' && (resultContent[valIndex - 1] as string).endsWith('_%')
        && typeof resultContent[valIndex + 1] === 'string' && (resultContent[valIndex + 1] as string).startsWith('%_')
      ) {
        resultContent[valIndex - 1] = (resultContent[valIndex - 1] as string).slice(0, (resultContent[valIndex - 1] as string).length - 2);
        resultContent[valIndex + 1] = (resultContent[valIndex + 1] as string).replace('%_', '');
        resultContent[valIndex] = '%s';
        inputIndex[valIndex] = val;
        allInputs = [
          ...allInputs,
          val,
        ]
      }
    }
  });
  const isAllString = resultContent.filter(val => typeof val === 'string' || typeof val === 'number').length === resultContent.length;
  if (isAllString) {
    const textContent = resultContent.join('');
    return {
      key: textContent,
      inputs: allInputs,
    }
  }
  return {
    key: userContent,
    inputs: [],
  }
}

export const parseTextTemplate = (template: string, inputs: Array<string | TReactObject>, componentName : string) : React.ReactNode | undefined => {
  if (typeof template !== 'string'){
    console.warn('parseTextTemplate needs to be used with string');
    return template;
  }
  const regexp = /%s/g;
  const match = template.match(regexp);
  if (!match) return undefined;

  let output : any = [];
  let lastIndex = 0;
  let stringNode = template;
  inputs.forEach(val => {
    const index = stringNode.indexOf('%s');
    output.push(stringNode.slice(lastIndex, index));
    lastIndex = index + '%s'.length;
    const element = componentName ? componentName : React.Fragment
    output.push(
      React.createElement(element, { key: 'number-'+index }, val as React.ReactNode)
    );
  });
  if (lastIndex < stringNode.length) {
    output.push(stringNode.slice(lastIndex, stringNode.length));
  }
  return <>{output}</>;
};