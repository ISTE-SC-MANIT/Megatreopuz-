import { graphql } from "relay-runtime";

const GetQuestionQuery = graphql`
  query GetQuestionQuery {
    getQuestion {
      question
      questionNo
      id
    }
  }
`;

export default GetQuestionQuery;
