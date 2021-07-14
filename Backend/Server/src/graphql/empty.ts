import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Empty {
    @Field()
    successful: boolean = true;
}
