all: clean package run

BUILD_FILES=.init.lua .lua/fullmoon.lua static/* views/*

clean:
	echo "fake clean"
#	zip -dr redbean-3.0.0.com -x ${BUILD_FILES}

package:
	zip -r redbean-3.0.0.com ${BUILD_FILES}

run:
	chmod +x redbean-3.0.0.com
	bash -c ./redbean-3.0.0.com