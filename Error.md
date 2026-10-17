[plugin:vite:oxc] Transform failed with 2 errors:

[PARSE_ERROR] `await` is only allowed within async functions and at the top levels of modules
    ╭─[ src/pages/auth/RegisterPage.jsx:86:7 ]
    │
 86 │       await register({
    │       ──┬──  
    │         ╰──── 
    │ 
    │ Help: Either remove this `await` or add the `async` keyword to the enclosing function
────╯

[PARSE_ERROR] Adjacent JSX elements must be wrapped in an enclosing tag.
     ╭─[ src/pages/auth/RegisterPage.jsx:470:7 ]
     │
 470 │       </div>
     │       ┬  
     │       ╰── 
     │ 
     │ Help: Did you want a JSX fragment `<>...</>`?
─────╯
C:/Users/hanzc/Documents/CAMPUSTA/frontend/src/pages/auth/RegisterPage.jsx
    at transformWithOxc (file:///C:/Users/hanzc/Documents/CAMPUSTA/frontend/node_modules/vite/dist/node/chunks/node.js:7581:19)
    at TransformPluginContext.transform (file:///C:/Users/hanzc/Documents/CAMPUSTA/frontend/node_modules/vite/dist/node/chunks/node.js:7653:26)
    at EnvironmentPluginContainer.transform (file:///C:/Users/hanzc/Documents/CAMPUSTA/frontend/node_modules/vite/dist/node/chunks/node.js:8545:51)
    at async loadAndTransform (file:///C:/Users/hanzc/Documents/CAMPUSTA/frontend/node_modules/vite/dist/node/chunks/node.js:20184:26)
    at async viteTransformMiddleware (file:///C:/Users/hanzc/Documents/CAMPUSTA/frontend/node_modules/vite/dist/node/chunks/node.js:20404:20)