#include "http.h" /* the HTTP facil.io extension */
#include <sqlite3.h>

// We'll use this callback in `http_listen`, to handles HTTP requests
void on_request(http_s *request);

// These will contain pre-allocated values that we will use often
FIOBJ HTTP_X_DATA;

int database_opened = 0;

// Listen to HTTP requests and start facil.io
int main(int argc, char const **argv) {

  printf("%s\n", sqlite3_libversion());

  // allocating values we use often
  HTTP_X_DATA = fiobj_str_new("X-Data", 6);
  // listen on port 3000 and any available network binding (NULL == 0.0.0.0)
  http_listen("1336", NULL, .on_request = on_request, .log = 1);
  // start the server
  fio_start(.threads = 1);
  // deallocating the common values
  fiobj_free(HTTP_X_DATA);
}

// Easy HTTP handling
void on_request(http_s *request) {
  http_set_cookie(request, .name = "my_cookie", .name_len = 9, .value = "data",
                  .value_len = 4);
  http_set_header(request, HTTP_HEADER_CONTENT_TYPE,
                  http_mimetype_find("txt", 3));
  http_set_header(request, HTTP_X_DATA, fiobj_str_new("my data", 7));

  //if(database_opened > 0){
  //  http_send_body(request, "Database opened/closed!\r\n", 24);
  //}
  //else{
    http_send_body(request, "heehee\r\n", 8);
  //}
}




