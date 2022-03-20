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

ENV PUID=0
ENV PGID=0
EXPOSE 12321
VOLUME /data

COPY --from=build /app/pupcloud/src/pupcloud /
COPY --from=build /app/pupcloud/docker/lib/gosu-1.14/gosu-amd64 /gosu
RUN chmod +x /gosu
RUN echo "Running as $PUID:$PGID"

ENTRYPOINT /gosu $PUID:$PGID /pupcloud -r /data
