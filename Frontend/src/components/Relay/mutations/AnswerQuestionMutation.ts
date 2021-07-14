import { graphql, commitMutation } from "relay-hooks";

import {
  UserUpdateInput,
  UpdateUserMutationResponse,
} from "../../../__generated__/UpdateUserMutation.graphql";
import { Environment, RecordSourceSelectorProxy } from "relay-runtime";
import {
  AnswerQuestionInput,
  AnswerQuestionMutationResponse,
} from "../../../__generated__/AnswerQuestionMutation.graphql";

export const mutation = graphql`
  mutation AnswerQuestionMutation($answerInput: AnswerQuestionInput!) {
    answerQuestion(input: $answerInput) {
      successful
    }
  }
`;

interface Callbacks {
  onError(err: Error): void;
  onCompleted(response: AnswerQuestionMutationResponse): void;
}

const commit = (
  environment: any,
  answerInfo: AnswerQuestionInput,
  // userId: string,
  { onCompleted, onError }: Callbacks
) => {
  return commitMutation(environment, {
    mutation,
    variables: {
      answerInput: answerInfo,
    },
    onCompleted: (response, error) => {
      if (error) return;
      onCompleted(response as AnswerQuestionMutationResponse);
    },
    onError,
  });
};

export default commit;
