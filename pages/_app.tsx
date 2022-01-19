import type { AppProps } from "next/app";
import { FC } from "react";

import { LiveLayout } from "components/live-layout";

const App: FC<AppProps> = ({ Component: Page, pageProps }) => (
    <LiveLayout>
        <Page {...pageProps} />
    </LiveLayout>
);

export default App;
