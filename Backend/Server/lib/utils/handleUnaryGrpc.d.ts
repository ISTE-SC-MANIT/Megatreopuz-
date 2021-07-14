import { Metadata, Client, requestCallback } from "grpc";
export interface MetadataInput {
    [key: string]: string;
}
export declare function makeRPCCall<Output, Input>(client: Client, rpc: (input: Input, metadata: Metadata, callback: requestCallback<Output>) => void, input: Input, metadataInput?: MetadataInput): Promise<Output>;
