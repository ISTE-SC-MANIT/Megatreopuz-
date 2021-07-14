import { graphql, commitMutation } from "relay-hooks";

import {
  UserUpdateInput,
  UpdateUserMutationResponse,
} from "../../../__generated__/UpdateUserMutation.graphql";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";

export const mutation = graphql`
  mutation UpdateUserMutation($user: UserUpdateInput!) {
    updateLocalUser(input: $user) {
      successful
    }
  }
`;

interface Callbacks {
  onError(err: Error): void;
  onCompleted(response: UpdateUserMutationResponse): void;
}

const updater = (
  store: RecordSourceSelectorProxy,
  input: UserUpdateInput,
  id: string
) => {
  const userProxy = store.get(id);
  if (userProxy) {
    if (input.college) {
      userProxy.setValue(input.college, "college");
    }
    if (input.year) {
      userProxy.setValue(input.year, "year");
    }
    if (input.country) {
      userProxy.setValue(input.country, "country");
    }
    if (input.phone) {
      userProxy.setValue(input.phone, "phone");
    }
  }
};

export const commit = (
  environment: any,
  userInfo: UserUpdateInput,
  userId: string,
  { onCompleted, onError }: Callbacks
) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      user: userInfo,
    },
    onCompleted: (response, error) => {
      if (error) return;
      onCompleted(response as UpdateUserMutationResponse);
    },
    onError,
    updater: (store: RecordSourceSelectorProxy) => {
      updater(store, userInfo, userId);
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy) => {
      updater(store, userInfo, userId);
    },
  });
};
