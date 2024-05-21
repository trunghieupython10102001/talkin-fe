# Frontend source code for StreamCall
This sourcecode is a frontend service that provides video call and livestream functionality. It is written in Typescript using ReactJS and the mediasoup-client library for WebRTC support.

**Main branch:** main


#### Installation
1. Clone the repository

2. Install the project dependencies:
```bash
cd stream_call-fe
yarn or npm install
```
#### Running the app
To start project , run the following command:
```bash
yarn start
```
This will start the server in development mode and listen for incoming requests
on port 3000



#### Git convention rules
**Development branch:** develop

- Branch name convention: [Jira task Id] \
Eg: STS-01
- Commit convention: [Jira task id]: commit description \
Eg: STS-01: Build code base
- Create pull request convention: create pull request with destination branch is develop. In the end of each sprint, after everything is done, create a pull request and merge develop branch to main branch 

#### Folder structure:
```
public/                             # contains all public files, all the files in this folder can be access via /{path_to_the_file}
src/
    |--- api/                       # contains all api related
    |--- assets/                    # assets files
    |--- classes/                   # contains all helper classes
    |--- components/                # components
        |--+ common                 # common comps, such as Button, Input, Modal, etc. (rarely change)
        |--+ Views                  # contains components related to only one feature in pages folders
            |--+ [page]/*.tsx       # domain/objective components, such as Wallet forms, Articles, etc (often change)
    |--- constants                  # contains enum, constants
    |--- context                    # context components
    |--- hooks                      # common hooks
    |--- interfaces                 # types, interface
    |--- layouts                    # layouts (rarely change)
    |--- pages                      # pages
    |--- routes                     # route configuration
    |--- store                      # contains all "feature" (slices of state)
        |--+ authSlice.ts           # quick access feature like authenticate
        |--+ thunks/                # app actions like show notify
    |--- themes                     # theme settings
    |--- utils                      # helpers function
    |--- App.tsx                    # The App component
    |--- index.ts                   # App entry
```

#### Naming conventions
### Naming

-   SHOULD:
    -   add "`T`" prefix if your type is gonna be exported:
    ```js
    export type TAppContext = {...}
    ```
    -   add "`I`" prefix if your interface is gonna be exported:
    ```js
    export interface IWallet {...}
    ```
    -   add "`E`" prefix if your enum is gonna be exported:
    ```js
    export enum EPaths {...}
    ```
    -   add "`rf`" prefix if your variable is a `ref`:
    ```js
    const rfIsUnmounted = useRef<boolean>(false);
    ```