# REDBEAN=redbean-3.0.0-original.com
REDBEAN=redbean-debug.com

all: clean package run

clean:
	rm -f prod/davidpineiroxyz.com
	rm -rf prod/copyparty/stuff/.hist
	rm -f hehe.tar.gz

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

dehehe:
	cd zip; gpg -o hehe.tar.gz -d hehe.tar.gz.gpg && tar -xzf hehe.tar.gz

zip/hehe.tar.gz.gpg:
	rm -f hehe.tar.gz
	cd hehe; tar -czf ../hehe.tar.gz .
	gpg -e -r server@davidpineiro.xyz -r david@davidpineiro.xyz -o zip/hehe.tar.gz.gpg hehe.tar.gz
# 	gpg -e -r david@davidpineiro.xyz -o zip/hehe.tar.gz.gpg hehe.tar.gz
	rm -f hehe.tar.gz

rmhehe:
	rm -f zip/hehe.tar.gz.gpg
	rm -f zip/hehe.tar.gz