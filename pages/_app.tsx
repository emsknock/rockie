import type { AppProps } from "next/app";
import Head from "next/head";
import { SWRConfig } from "swr";
import { FC } from "react";

import { LiveLayout } from "components/live-layout";

const watcherUrl = process.env.LIVE_API_WATCHER_URL;
if (!watcherUrl) throw Error("Please specify LIVE_API_WATCHER_URL in .env");

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
