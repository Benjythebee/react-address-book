# Address Book in React.

This is a simple Web3 Address Book in React that allows you to save addresses and build yourself a library of contacts.
When entering a Contact you have the ability to change the name of that contact, remove them and send that contact Ether (on rinkeby).
This App also supports multiple Local users.

<img src="https://user-images.githubusercontent.com/38708022/126053949-35eab0ed-3db2-498a-a21f-4628c5f42480.png" alt="drawing" width="500"/>
<img src="https://user-images.githubusercontent.com/38708022/126053954-6176c967-0bda-46e4-bf62-946381d5e6f5.png" alt="drawing" width="500"/>

This app was made using Ethers.js as it is a super lighweight library relative to Web3.js.

## Setup

- Clone the repo
- run `npm i`

## Available Scripts

### `npm run dev`

Run `npm run dev` to start a development server on [http://localhost:3000](http://localhost:3000).

The development server uses Concurrently to watch the `.less` files and run `react-scripts start` at the same time.

### `npm run start`

Run `npm run start` will also run a development server on [http://localhost:3000](http://localhost:3000).

The changes to `.less` will be ignored.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
