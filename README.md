## Cow Runner Game - React component

The trex runner game extracted from chrome offline error page, but with less dinosaurs and more Cows!

<p align="center">
  <img src="https://github.com/gnosis/cow-runner-game/raw/main/docs/demo.gif">
</p>

This project is a typescript library that provides `CowGame` as a react component.

Changes over the original:
* Broken down into smaller entities (see `src/game/model`)
* Converted into typescript project
* The game has ben wrapped into a React component
* The React component is exported as a library
* Integrated with webpack. You can build the HTML page or run it in dev mode

> 🏗 Pending to add the sprites and styles for the cow game.

# Usage
Add dependency to your project:
```bash
yarn add @gnosis.pm/cow-runner-game
```

Use the `CowGame` react component:
```tsx
import { CowGame } from '@gnosis.pm/cow-runner-game'

export default function Your () {
  return (
    <div>
      <h1>Cow Game</h1>
      <p>Try not to get 🥪</p>

      <CowGame />
    </div>
  )
}
```

# Development
## Install dependencies
```bash
yarn
```

## Run dev browser
```bash
yarn start
```

# Build library
```bash
yarn build
```


