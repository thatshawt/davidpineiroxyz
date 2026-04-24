# REDBEAN=redbean-3.0.0-original.com
REDBEAN=redbean-debug.com

all: clean package run

clean:
	rm -f prod/davidpineiroxyz.com
	rm -rf prod/copyparty/stuff/.hist

prod/davidpineiroxyz.com: ${REDBEAN}
	mkdir -p prod
	cp ${REDBEAN} prod/davidpineiroxyz.com

package: clean prod/davidpineiroxyz.com
	cd zip; zip -r ../prod/davidpineiroxyz.com .

run: package
	chmod +x prod/davidpineiroxyz.com
# 	bash -c "./prod/davidpineiroxyz.com --assimilate"
	cd prod; exec ./davidpineiroxyz.com -p 8080 -- --devmode

hehe: rmhehe zip/hehe.tar.gz.gpg

rmhehe:
	rm -f zip/hehe.tar.gz.gpg

dehehe:
	bash -c "cd zip; gpg -d hehe.tar.gz.gpg | tar -xzf -"

zip/hehe.tar.gz.gpg:
	tar -czf - hehe | gpg -e -r server@davidpineiro.xyz > zip/hehe.tar.gz.gpg