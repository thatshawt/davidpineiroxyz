# REDBEAN=redbean-3.0.0-original.com
REDBEAN=redbean-debug.com

all: clean package run

clean:
	rm -f prod/davidpineiroxyz.com

prod/davidpineiroxyz.com: ${REDBEAN}
	mkdir -p prod
	cp ${REDBEAN} prod/davidpineiroxyz.com

package: clean prod/davidpineiroxyz.com
	cd zip; zip -r ../prod/davidpineiroxyz.com .

run: package
	chmod +x prod/davidpineiroxyz.com
# 	bash -c "./prod/davidpineiroxyz.com --assimilate"
	cd prod; exec ./davidpineiroxyz.com -p 8080 -- devmode