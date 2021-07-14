import { graphql } from "relay-runtime";

const GetLeaderBoardQuery = graphql`
  query GetLeaderBoardQuery {
    getLeaderBoard {
      name
      username
      questionAttempted
    }
  }
`;

export default GetLeaderBoardQuery;
