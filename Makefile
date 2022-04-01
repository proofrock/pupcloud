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
	cd src; go build -o ../bin/pupcloud

zbuild:
	make build
	cd bin; 7zr a -mx9 -t7z pupcloud-v0.6.4-`uname -s|tr '[:upper:]' '[:lower:]'`-`uname -m`.7z pupcloud

build-static:
	make build-prepare
	cd src; go build -a -tags netgo,osusergo -ldflags '-w -extldflags "-static"' -o ../bin/pupcloud

zbuild-static:
	make build-static
	cd bin; 7zr a -mx9 -t7z pupcloud-v0.6.4-`uname -s|tr '[:upper:]' '[:lower:]'`-`uname -m`.7z pupcloud

run:
	make build-ui
	make build
	bin/pupcloud -r demo-ui/public/testFs/ --share-prefix "http://localhost:17179" --follow-symlinks

run-demo-ui:
	make cleanup-demo-ui
	cd demo-ui && npm install && npm run dev

docker:
	sudo docker build --no-cache --build-arg arch=`uname -m` -t local_pupcloud:latest .

docker-publish:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.6.4
	sudo docker push germanorizzo/pupcloud:latest
	sudo docker push germanorizzo/pupcloud:v0.6.4
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:v0.6.4

docker-publish-arm:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest-arm
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.6.4-arm
	sudo docker push germanorizzo/pupcloud:latest-arm
	sudo docker push germanorizzo/pupcloud:v0.6.4-arm
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest-arm
	sudo docker rmi germanorizzo/pupcloud:v0.6.4-arm

docker-publish-arm64:
	make docker
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:latest-arm64
	sudo docker image tag local_pupcloud:latest germanorizzo/pupcloud:v0.6.4-arm64
	sudo docker push germanorizzo/pupcloud:latest-arm64
	sudo docker push germanorizzo/pupcloud:v0.6.4-arm64
	sudo docker rmi local_pupcloud:latest
	sudo docker rmi germanorizzo/pupcloud:latest-arm64
	sudo docker rmi germanorizzo/pupcloud:v0.6.4-arm64
