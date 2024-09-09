.RECIPEPREFIX = +

.PHONY: setupidk clean

setupidk:
+ mkdir -p tmp out

clean:
+ rm -rf tmp out

compile: setupidk tmp/main.o
+ cp tmp/main.o out/main.o

tmp/main.o: setupidk src/main.c
+ gcc -I ./include -o tmp/main.o src/main.c

