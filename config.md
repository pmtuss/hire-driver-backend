# Config Nodejs Express với Typescript

```console
mkdir express-ts
cd express-ts

npm init -y
```

```console
npm i express cors cookie-parser
```

```console
npm i -D @types/express @types/cors @types/cookie-parser nodemon typescript
```

> Create `tsconfig.json` in root dir

```json
{
  "compilerOptions": {
    "target": "ES2016",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```
