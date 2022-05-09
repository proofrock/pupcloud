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

RUN apk add --update su-exec

EXPOSE 17178
EXPOSE 17179
VOLUME /data

COPY --from=build /app/pupcloud/bin/pupcloud /

ENTRYPOINT su-exec $PUID:$PGID /pupcloud -r /data
