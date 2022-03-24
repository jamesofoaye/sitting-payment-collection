import Document, {Html, Head, Main, NextScript } from 'next/document';
import { ServerStyles, createStylesServer } from '@mantine/next';

const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <ServerStyles html={initialProps.html} server={stylesServer} />
        </>
      ),
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          {
          /**<link rel="manifest" href="/manifest.json" />
             <link rel="apple-touch-icon" href="/icon.png"></link>
            <meta name="theme-color" content="#fff" />
            */
          }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}