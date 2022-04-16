.PHONY: list docker
list:
	@LC_ALL=C $(MAKE) -pRrq -f $(lastword $(MAKEFILE_LIST)) : 2>/dev/null | awk -v RS= -F: '/^# File/,/^# Finished Make data base/ {if ($$1 !~ "^[#.]") {print $$1}}' | sort | egrep -v -e '^[^[:alnum:]]' -e '^$@$$'

cleanup-ui:
	- rm -r web-ui/node_modules
	- rm -r web-ui/public/build

cleanup-demo-ui:
	- rm -r demo-ui/node_modules

cleanup-build:
	- rm -r bin
	- rm src/pupcloud

cleanup:
	- make cleanup-ui
	- make cleanup-demo-ui
	- make cleanup-build

build-ui:
	make cleanup-ui
	cd web-ui && npm install && npm run build
	- rm -r src/static/*
	cp -r web-ui/public/* src/static/

build-demo-ui:
	make cleanup-demo-ui
	- rm -r demo-ui/node_modules
	- rm -r demo-ui/public/build
	cd demo-ui && npm install && npm run build

build-prepare:
	make cleanup
	mkdir bin

build:
	make build-prepare
	cd src; CGO=0 go build -o ../bin/pupcloud

zbuild:
	make build
	cd bin; 7zr a -mx9 -t7z pupcloud-v0.7.1-`uname -s|tr '[:upper:]' '[:lower:]'`-`uname -m`.7z pupcloud

build-static:
	make build-prepare
	cd src; CGO=0 go build -a -tags netgo,osusergo -ldflags '-w -extldflags "-static"' -o ../bin/pupcloud

zbuild-static:
	make build-static
	cd bin; 7zr a -mx9 -t7z pupcloud-v0.7.1-`uname -s|tr '[:upper:]' '[:lower:]'`-`uname -m`.7z pupcloud

zbuild-all:
	make build-prepare
	make build-ui
	cd src; CGO=0 GOOS=linux GOARCH=amd64 go build -a -tags netgo,osusergo -ldflags '-w -extldflags "-static"'
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-linux-amd64.7z pupcloud
	rm src/pupcloud
	cd src; CGO=0 GOOS=linux GOARCH=arm go build -a -tags netgo,osusergo -ldflags '-w -extldflags "-static"'
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-linux-arm.7z pupcloud
	rm src/pupcloud
	cd src; CGO=0 GOOS=linux GOARCH=arm64 go build -a -tags netgo,osusergo -ldflags '-w -extldflags "-static"'
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-linux-arm64.7z pupcloud
	rm src/pupcloud
	cd src; CGO=0 GOOS=darwin GOARCH=amd64 go build
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-darwin-amd64.7z pupcloud
	rm src/pupcloud
	cd src; CGO=0 GOOS=darwin GOARCH=arm64 go build
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-darwin-arm64.7z pupcloud
	rm src/pupcloud
	cd src; CGO=0 GOOS=windows GOARCH=amd64 go build
	cd src; 7zr a -mx9 -t7z ../bin/pupcloud-v0.7.1-win-amd64.7z pupcloud.exe
	rm src/pupcloud.exe

run:
	make build-ui
	make build
	bin/pupcloud -r demo-ui/public/testFs/

run-demo-ui:
	make cleanup-demo-ui
	cd demo-ui && npm install && npm run dev

docker:
	sudo docker build --no-cache -t local_pupcloud:latest .

docker-publish:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.7.1
	sudo docker push germanorizzo/pupcloud:latest
	sudo docker push germanorizzo/pupcloud:v0.7.1
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:v0.7.1

docker-publish-arm:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest-arm
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.7.1-arm
	sudo docker push germanorizzo/pupcloud:latest-arm
	sudo docker push germanorizzo/pupcloud:v0.7.1-arm
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest-arm
	sudo docker rmi germanorizzo/pupcloud:v0.7.1-arm

docker-publish-arm64:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest-arm64
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.7.1-arm64
	sudo docker push germanorizzo/pupcloud:latest-arm64
	sudo docker push germanorizzo/pupcloud:v0.7.1-arm64
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest-arm64
	sudo docker rmi germanorizzo/pupcloud:v0.7.1-arm64
