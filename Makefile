all: clean package run

BUILD_FILES=.init.lua .lua/fullmoon.lua static/* views/*

clean:
	rm -f davidpineiroxyz.com

davidpineiroxyz.com: redbean-3.0.0-original.com
	cp redbean-3.0.0-original.com davidpineiroxyz.com

package: clean davidpineiroxyz.com
	zip -r davidpineiroxyz.com ${BUILD_FILES}

run: package
	chmod +x davidpineiroxyz.com
	bash -c ./davidpineiroxyz.com