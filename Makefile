all: clean package run

BUILD_FILES=.init.lua .lua/fullmoon.lua static/* views/*

clean:
	rm -f davidpineiroxyz.com

davidpineiroxyz.com: redbean-3.0.0-original.com
	cp redbean-3.0.0-original.com davidpineiroxyz.com

package: clean davidpineiroxyz.com
	zip -r davidpineiroxyz.com ${BUILD_FILES}
	chmod +x davidpineiroxyz.com

run: package
	bash -c ./davidpineiroxyz.com