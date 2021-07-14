protoc -I=megatreopuz-protos --go_out=plugins=grpc:protos --go_opt=paths=source_relative megatreopuz-protos/user.proto megatreopuz-protos/utils.proto
