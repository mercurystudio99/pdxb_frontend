import React from "react";
// ** Next Import
import { Html, Head, Main, NextScript } from "next/document";
const CustomDocument = () => {
    return (
        <Html>
            <Head>
                <script dangerouslySetInnerHTML={{
                    __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-TH8N2TKB');`,
                    }}
                ></script>
                <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
                <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
                <script async src="https://www.googletagmanager.com/gtag/js?id=G-7KSZ2Z3CXG"></script>
                <script id="google-analytics">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-7KSZ2Z3CXG');
                    `}
                </script>
            </Head>

            <body>
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TH8N2TKB" height="0" width="0" style={{display: "none", visibility: 'hidden'}}></iframe></noscript>
                <Main />
                <NextScript />
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
            </body>
        </Html>
    );
};
export default CustomDocument;
