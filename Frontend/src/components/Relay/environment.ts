// import cookie from "js-cookie";

// import {
//   RelayNetworkLayer,
//   urlMiddleware,
//   authMiddleware,
// } from "react-relay-network-modern";
// import { Environment, RecordSource, Store } from "relay-runtime";

// const token = cookie.get("authorization");

// const network = new RelayNetworkLayer([
//   urlMiddleware({
//     url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
//   }),
//   authMiddleware({
//     token: token,
//     prefix: "",
//     // default
//     header: "authorization",
//   }),
//   (next) => async (req) => {
//     // req.fetchOpts.method = 'GET'; // change default POST request method to GET
//     // req.fetchOpts.headers['X-Request-ID'] = uuid.v4(); // add `X-Request-ID` to request headers
//     req.fetchOpts.credentials = "same-origin"; // allow to send cookies (sending credentials to same domains)
//     //req.fetchOpts.credentials = "include"; // allow to send cookies for CORS (sending credentials to other domains)

//     console.log("RelayRequest", req);

//     const res = await next(req);
//     console.log("RelayResponse", res);

//     return res;
//   },
// ]);

// export const getEnvironment = (): Environment => {
//   const source = new RecordSource();
//   const store = new Store(source);

//   return new Environment({ network, store });
// };
import cookie from "js-cookie";

import { Environment, RecordSource, Store } from "relay-runtime";
import {
  RelayNetworkLayer,
  urlMiddleware,
  authMiddleware,
  errorMiddleware,
} from "react-relay-network-modern";

export const makeEnvironment = () => {
  const token = cookie.get("authorization");

  const network = new RelayNetworkLayer([
    urlMiddleware({
      url: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
    }),
    authMiddleware({
      token: token,
      prefix: "",
      // default
      header: "authorization",
    }),
    errorMiddleware({
      logger: console.error,
      prefix: "[Relay Network]: ",
    }),
  ]);
  return new Environment({
    network: network,
    store: new Store(new RecordSource()),
  });
};
