** Generate keys **
============================
openssl req -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem (use for prod) 
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem

** Folders **
==============================
- Make a folder /keys to store certificates
- Make a folder /.temp to store temporary uploads
