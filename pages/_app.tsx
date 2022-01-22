import type { FC } from "react";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";

import { LiveLayout } from "components/live-layout";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const App: FC<AppProps> = ({ Component: Page, pageProps }) => (
    <SWRConfig value={{ fetcher }}>
        <LiveLayout>
            <Page {...pageProps} />
        </LiveLayout>
    </SWRConfig>
);

export default App;
