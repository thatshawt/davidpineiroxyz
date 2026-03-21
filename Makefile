all: clean package run

clean:
	rm -f davidpineiroxyz.com

davidpineiroxyz.com: redbean-3.0.0-original.com
	cp redbean-3.0.0-original.com davidpineiroxyz.com

package: clean davidpineiroxyz.com
	cd zip; zip -r  ../davidpineiroxyz.com .

run: package
	chmod +x davidpineiroxyz.com
	bash -c "./davidpineiroxyz.com -p 8080"