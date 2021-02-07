# React Configurator

React components for building application on top of Configit Ace configure module.

## Getting started

```jsx
import {Configurator, Choice} = from "@configit/react-configure";

function App(){
  return (
    <Configurator apiUrl=""  apiKey="">
      <MyConfiguratorApp/>
    <Configurator>
  );
}

function MyConfiguratorApp( ){
  const { sections } = useConfigurator( {
    packagePath: '/my-package',
    productId: 'my-product'
  } );

  return (
    <div>
      {sections.map(section => <Section section={section}/>)}
    </div>
  )
}

function Section( {section} ) {
  return (
    <div>
       <h1>{section.name}</h1>
       {section.sections.map(subSection => <Section section={subSection}/>)}
       {section.variables.map(variable => <Choice variable={variable}/>)}
    </div>
  )
}
```

## Not using React

We have

- Types
- Utility functions
