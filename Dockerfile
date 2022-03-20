FROM alpine:edge AS build

RUN apk update
RUN apk upgrade
RUN apk add --update go gcc g++ git nodejs npm
WORKDIR /app
ENV GOPATH /app
RUN git clone -b develop https://github.com/proofrock/pupcloud
WORKDIR /app/pupcloud/src
RUN go build

FROM alpine:latest

ARG arch

ENV PUID=0
ENV PGID=0
EXPOSE 12321
VOLUME /data

COPY --from=build /app/pupcloud/src/pupcloud /
COPY --from=build /app/pupcloud/docker/lib/gosu-1.14/gosu-$arch /gosu
RUN chmod +x /gosu

ENTRYPOINT /gosu $PUID:$PGID /pupcloud -r /data
