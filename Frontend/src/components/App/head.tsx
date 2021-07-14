import React from "react";
import Head from "next/head";

const HeadTags: React.FC<{ mainColor: string }> = ({ mainColor }) => {
    return (
        <Head>
            <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width"
            />
            <meta name="theme-color" content={mainColor} />
        </Head>
    );
};

export default HeadTags;
