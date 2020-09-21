# activeClassName example

ReactRouter has a convenience property on the `Link` element to allow an author to set the _active_ className on a link. This example replicates that functionality using Next's own `Link`.

## Deploy

You can see the deployment in firebase [here](https://product-hunt-b8cc2.web.app/).

Or check it in netlify [here](https://productnext-react-tuto.netlify.app/).

## How to use

### Using `create-next-app`

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example active-class-name active-class-name-app
# or
yarn create next-app --example active-class-name active-class-name-app
```

### Download manually

Download the example:

```bash
curl https://codeload.github.com/vercel/next.js/tar.gz/canary | tar -xz --strip=2 next.js-canary/examples/active-class-name
cd active-class-name
```

Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/import?filter=next.js&utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
