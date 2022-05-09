FROM alpine:edge AS build

RUN apk update
RUN apk upgrade
RUN apk add --update go git make
WORKDIR /app
ENV GOPATH /app
RUN git clone https://github.com/proofrock/pupcloud
WORKDIR /app/pupcloud
RUN make build-static

FROM alpine:latest

ENV PUID=1000
ENV PGID=1000
EXPOSE 12321
VOLUME /data

COPY --from=build /app/pupcloud/bin/pupcloud /

RUN addgroup -g $PGID pup
RUN adduser -u $PUID -G pup -D pup

USER pup:pup

ENTRYPOINT ["/pupcloud", "-r", "/data"]
