
### Install

```
yarn add quickly-react-text-i18n
```

### Usage

```tsx

import { create } from 'quickly-react-text-i18n';
const { TranslationGroup, useTranslation } = create({
  localData: {
    en: {
      'Hello World': 'Hello World'
    },
    vi: {
      'Hello World': 'Xin chào thế giới'
    }}
  },
});

<TranslationGroup type="screen" id="y">
  <ScreenContainer>
    <Col flex1 middle>
      <Text>Hello World</Text>
    </Col>
  </ScreenContainer>
</TranslationGroup>

// or

const SomeTextComponent = ({ children }) => {
  const [text] = useTranslation(children);
  return <h1>{text}</h1>
}

<TranslationGroup type="screen" id="y">
  <div>
    <SomeTextComponent>Hello World</SomeTextComponent>
  </div>
</TranslationGroup>
```

### Example

Comming soon

### Road maps

- [ ] Nice & friendly interface to update translations
- [x] Has the option to download as local data
- [x] Change language and update real-time via Iframe

