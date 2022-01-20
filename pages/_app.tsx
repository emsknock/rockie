import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import { FC } from "react";

import { watcherUrl } from "utils/constants";
import { LiveLayout } from "components/live-layout";

const App: FC<AppProps> = ({ Component: Page, pageProps }) => (
    <SWRConfig
        value={{
            fetcher: (url: string) => fetch(url).then((res) => res.json()),
        }}
    >
        <Head>
            <link
                rel="preload"
                href={watcherUrl}
                as="fetch"
                crossOrigin="anonymous"
            />
        </Head>
        <LiveLayout>
            <Page {...pageProps} />
        </LiveLayout>
    </SWRConfig>
);

export default App;
