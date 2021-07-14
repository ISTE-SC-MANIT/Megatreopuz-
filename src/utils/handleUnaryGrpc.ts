import { Metadata, Client, requestCallback } from "grpc";

export interface MetadataInput {
  [key: string]: string;
}

function makeMetadata(input: MetadataInput): Metadata {
  const m = new Metadata();

  for (const key in input) m.set(key, input[key]);
  return m;
}

export function makeRPCCall<Output, Input>(
  client: Client,
  rpc: (
    input: Input,
    metadata: Metadata,
    callback: requestCallback<Output>
  ) => void,
  input: Input,
  metadataInput: MetadataInput = {}
): Promise<Output> {
  return new Promise<Output>((resolve, reject) => {
    const metadata = makeMetadata(metadataInput);
    rpc.call(client, input, metadata, (err, value) => {
      if (err) reject(new Error(err.details));
      if (!value) reject(new Error(`Server did not send any response`));
      resolve(value!);
    });
  });
}
