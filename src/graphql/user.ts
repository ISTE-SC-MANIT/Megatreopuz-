import {
  Resolver,
  Field,
  Mutation,
  Ctx,
  InputType,
  Arg,
  ObjectType,
  Int,
  Query,
} from "type-graphql";
import { Empty as grpcEmpty } from "../protos/utils_pb";
import moment from "moment";
import { makeRPCCall } from "../utils/handleUnaryGrpc";
import { ContextType } from ".";
import {
  CreateLocalPlayerRequest,
  UpdateLocalPlayerRequest,
  getPlayerResponse,
  AnswerQuestion,
  GetNextQuestionRespone,
  CreateQuestionRequest,
  GetLeaderBoardResponse,
} from "../protos/user_pb";
import { MinLength, Min } from "class-validator";
import { Empty } from "./empty";

@InputType()
class UserCreateInput {
  @Field()
  @MinLength(1)
  name: string;

  @Field()
  @MinLength(1)
  username: string;

  @Field()
  @MinLength(1)
  college: string;

  @Field()
  @MinLength(1)
  country: string;

  @Field()
  @MinLength(1)
  phone: string;

  @Field()
  @Min(1)
  year: number;
}

@InputType()
class CreateQuestionInput {
  @Field()
  @MinLength(1)
  answer: string;

  @Field()
  @MinLength(1)
  imgUrl: string;

  @Field()
  @MinLength(1)
  question: string;

  @Field()
  @Min(1)
  questionNo: number;
}

@InputType()
class UserUpdateInput {
  @Field({ nullable: true })
  @MinLength(1)
  name: string;

  @Field({ nullable: true })
  @MinLength(1)
  userName: string;

  @Field({ nullable: true })
  @MinLength(1)
  college: string;

  @Field({ nullable: true })
  @MinLength(1)
  country: string;

  @Field({ nullable: true })
  @MinLength(1)
  phone: string;

  @Field({ nullable: true })
  @Min(1)
  year: number;
}

@InputType()
class AnswerQuestionInput {
  @Field()
  @MinLength(1)
  answer: string;

  @Field({ nullable: true })
  @Min(1)
  questionNo: number;

  @Field()
  id: string;
}

@InputType()
class GetMyProfileInput {
  @Field()
  @MinLength(1)
  userId: string;
}

@ObjectType()
export class Users {
  constructor(
    name: string,
    questionAttempted: number,
    username: string,
    lastAnsweredQuestionTime
  ) {
    this.username = username;
    this.name = name;
    this.questionAttempted = questionAttempted;
    this.lastAnsweredQuestionTime = lastAnsweredQuestionTime;
  }
  @Field()
  name: string;

  @Field()
  questionAttempted: number;

  @Field()
  username: string;

  @Field()
  lastAnsweredQuestionTime: string;
}

@ObjectType()
export class RankInfo {
  constructor(rank: number, totalParticipants: number) {
    (this.rank = rank), (this.totalParticipants = totalParticipants);
  }

  @Field()
  rank: number;

  @Field()
  totalParticipants: number;
}

@ObjectType()
export class User {
  constructor(
    id: string,
    username: string,
    name: string,
    phone: string,
    year: number,
    email: string,
    college: string,
    country: string,
    attempts: number,
    solvedQuestions: number
  ) {
    this.id = id;
    this.userName = username;
    this.name = name;
    this.phone = phone;
    this.year = year;
    this.email = email;
    this.college = college;
    this.country = country;
    this.solvedQuestions = solvedQuestions;
    this.totalAttempts = attempts;
  }

  @Field()
  id: string;

  @Field()
  userName: string;

  @Field()
  name: string;

  @Field()
  phone: string;

  @Field()
  college: string;

  @Field()
  email: string;

  @Field()
  country: string;

  @Field((type) => Int)
  year: number;

  @Field((type) => Int)
  totalAttempts: number;

  @Field((type) => Int)
  solvedQuestions: number;
}

@ObjectType()
export class Question {
  constructor(question: string, questionNo: number, id: string) {
    this.question = question;
    this.questionNo = questionNo;
    this.id = id;
  }

  @Field()
  question: string;

  @Field((type) => Int)
  questionNo: number;

  @Field()
  id: string;
}
@Resolver()
export class UserClass {
  @Query((returns) => User)
  async getPlayer(
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<User> {
    try {
      const empty = new grpcEmpty();
      const result = await makeRPCCall<getPlayerResponse, grpcEmpty>(
        userClient,
        userClient.getPlayer,
        empty,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );

      return new User(
        result.getId(),
        result.getUsername(),
        result.getName(),
        result.getPhone(),
        result.getYear(),
        result.getEmail(),
        result.getCollege(),
        result.getCountry(),
        result.getAttempts(),
        result.getTotalsolvedquestions()
      );
    } catch (e) {
      console.log(e);
      throw new Error(`Could not check database`);
    }
  }

  @Query((returns) => Question)
  async getQuestion(
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<Question> {
    try {
      const empty = new grpcEmpty();
      const result = await makeRPCCall<GetNextQuestionRespone, grpcEmpty>(
        userClient,
        userClient.getNextQuestion,
        empty,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );

      return new Question(
        result.getQuestion(),
        result.getQuestionno(),
        result.getQuestionid()
      );
    } catch (e) {
      console.log(e);
      throw new Error(`Could not check database`);
    }
  }

  @Mutation((returns) => Empty)
  async createLocalUser(
    @Arg("input") payload: UserCreateInput,
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<Empty> {
    //if (!authToken) throw new Error(`User is not logged in`);

    try {
      const input = new CreateLocalPlayerRequest();
      input.setName(payload.name);
      input.setCountry(payload.country);
      input.setCollege(payload.college);
      input.setPhone(payload.phone);
      input.setUsername(payload.username);
      input.setYear(payload.year);
      await makeRPCCall<grpcEmpty, CreateLocalPlayerRequest>(
        userClient,
        userClient.createLocalPlayer,
        input,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );
      return new Empty();
    } catch (e) {
      console.log(e);
      throw new Error(`Could not create user. Please try again`);
    }
  }

  // @Mutation((returns) => Empty)
  // async createQuestion(
  //   @Arg("input") payload: CreateQuestionInput,
  //   @Ctx() { userClient, authToken, req }: ContextType
  // ): Promise<Empty> {
  //   //if (!authToken) throw new Error(`User is not logged in`);

  //   try {
  //     const input = new CreateQuestionRequest();
  //     input.setAnswer(payload.answer);
  //     input.setImgurl(payload.imgUrl);
  //     input.setQuestion(payload.question);
  //     input.setQuestionno(payload.questionNo);

  //     await makeRPCCall<grpcEmpty, CreateQuestionRequest>(
  //       userClient,
  //       userClient.createQuestion,
  //       input,
  //       {
  //         //@ts-ignore
  //         authorization: req.header("authorization"),
  //       }
  //     );
  //     return new Empty();
  //   } catch (e) {
  //     console.log(e);
  //     throw new Error(`Could not create user. Please try again`);
  //   }
  // }

  @Mutation((returns) => Empty)
  async updateLocalUser(
    @Arg("input") payload: UserUpdateInput,
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<Empty> {
    // if (!authToken) throw new Error(`User is not logged in`);

    try {
      const input = new UpdateLocalPlayerRequest();

      if (payload.userName && payload.userName.length > 0)
        input.setUsername(payload.userName);
      if (payload.name && payload.name.length > 0) input.setName(payload.name);
      if (payload.country && payload.country.length > 0)
        input.setCountry(payload.country);
      if (payload.college && payload.college.length > 0)
        input.setCollege(payload.college);
      if (payload.phone && payload.phone.length > 0)
        input.setPhone(payload.phone);
      if (payload.year && payload.year > 0) input.setYear(payload.year);
      await makeRPCCall<grpcEmpty, UpdateLocalPlayerRequest>(
        userClient,
        userClient.updateLocalPlayer,
        input,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );
      return new Empty();
    } catch (e) {
      throw new Error(`Could not update user. Please try again`);
    }
  }
  @Mutation((returns) => Empty)
  async answerQuestion(
    @Arg("input") payload: AnswerQuestionInput,
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<Empty> {
    // if (!authToken) throw new Error(`User is not logged in`);

    try {
      const input = new AnswerQuestion();
      input.setId(payload.id);
      input.setAnswer(payload.answer);
      // input.setEmail(payload.email);
      input.setQuestionno(payload.questionNo);
      await makeRPCCall<grpcEmpty, AnswerQuestion>(
        userClient,
        userClient.answerQuestion,
        input,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );
      return new Empty();
    } catch (e) {
      console.log(e);
      throw new Error(`Could not update user. Please try again`);
    }
  }

  @Query((returns) => [Users])
  async getLeaderBoard(
    @Ctx() { userClient, authToken, req }: ContextType
  ): Promise<Users[]> {
    try {
      const empty = new grpcEmpty();
      const result = await makeRPCCall<GetLeaderBoardResponse, grpcEmpty>(
        userClient,
        userClient.getLeaderBoard,
        empty,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );

      const users = result
        .getUsersList()
        .filter((a) => a.getQuestionsattempted() != 0)
        .map(
          (a) =>
            new Users(
              a.getName(),
              a.getQuestionsattempted(),
              a.getUsername(),
              a.getLastansweredquestiontime()
            )
        );

      const a = users.sort((a, b) => {
        const n = a.questionAttempted - b.questionAttempted;
        if (n !== 0) return b.questionAttempted - a.questionAttempted;
        const aTime = moment(a.lastAnsweredQuestionTime);
        const bTime = moment(b.lastAnsweredQuestionTime);
        // console.log(`aTime ${aTime}, bTime ${bTime}`);
        if (aTime.isAfter(bTime)) return 1;
        return -1;
      });
      // console.log(a);
      return a;
    } catch (e) {
      console.log(e);
      throw new Error(`Could not check database`);
    }
  }

  @Query((returns) => RankInfo)
  async getMyProfileInfo(
    @Ctx() { userClient, authToken, req }: ContextType,
    @Arg("input") payload: GetMyProfileInput
  ): Promise<RankInfo> {
    try {
      const empty = new grpcEmpty();
      const result = await makeRPCCall<GetLeaderBoardResponse, grpcEmpty>(
        userClient,
        userClient.getLeaderBoard,
        empty,
        {
          //@ts-ignore
          authorization: req.header("authorization"),
        }
      );

      const users = result
        .getUsersList()
        .filter((a) => a.getQuestionsattempted() != 0)
        .map((a) => {
          return {
            questionAttempted: a.getQuestionsattempted(),
            lastAnsweredQuestionTime: a.getLastansweredquestiontime(),
            userId: a.getUserid(),
          };
        });

      const a = users.sort((a, b) => {
        const n = a.questionAttempted - b.questionAttempted;
        if (n !== 0) return b.questionAttempted - a.questionAttempted;
        const aTime = moment(a.lastAnsweredQuestionTime);
        const bTime = moment(b.lastAnsweredQuestionTime);
        if (aTime.isAfter(bTime)) return 1;
        return -1;
      });

      const rank = a.findIndex((b) => b.userId === payload.userId);
      const totalStrength = a.length;

      return new RankInfo(rank, totalStrength);
    } catch (e) {
      console.log(e);
      throw new Error(`Could not check database`);
    }
  }
}
