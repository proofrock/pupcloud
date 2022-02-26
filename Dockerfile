# docker build -t pupcloud .

FROM alpine:edge AS build

RUN apk update
RUN apk upgrade
RUN apk add --update go gcc g++ git nodejs npm
WORKDIR /app
ENV GOPATH /app
RUN git clone https://github.com/proofrock/pupcloud
WORKDIR /app/pupcloud/src
RUN go build

FROM alpine:latest

COPY --from=build /app/pupcloud/src/pupcloud /

EXPOSE 12321
VOLUME /data

ENTRYPOINT ["/pupcloud", "-r", "/data"]
