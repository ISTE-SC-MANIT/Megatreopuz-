import { graphql } from "relay-runtime";

const GetProfileInfoQuery = graphql`
  query GetProfileInfoQuery($profileInput: GetMyProfileInput!) {
    getMyProfileInfo(input: $profileInput) {
      rank
      totalParticipants
    }
  }
`;

export default GetProfileInfoQuery;
