---
sidebar_position: 180
title: Webserver SSL
---

Apache SSL configuration
========================

Certificate Authority
---------------------

CA key with password: 

	openssl genrsa -des3 -out CA.key 2048

CA certificate:

	openssl req -x509 -new -nodes -key CA.key -sha256 -days 365 -out CA.crt

Optionaly you can exported the certificate in PKCS#12 format:

	openssl pkcs12 -export -inkey CA.key -in CA.crt -out CA.p12

Server
------

Web server key and certificate request:

	openssl req -nodes -sha256 -newkey rsa:2048 -keyout server.key -out server.csr

Signed by CA: 

	openssl ca -days 365 -in server.csr -cert CA.crt -keyfile CA.key -out server.crt

Or self-signed: 

	openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
	
You can use this procedure to create either single host or wildcard certificate.

> **Note**: It is also possible to create a certificate for **both** host and wilcard by appending an appropriate "SAN" (`subjectAltName`) configuration to your `openssl.cnf` file, see [this document](http://wiki.cacert.org/FAQ/subjectAltName))

Client
------

User key and certificate request :

	openssl req -nodes -sha512 -newkey rsa:2048 -keyout user.key -out user.csr

Signed by CA : 

	openssl ca -days 365 -in $1.csr -cert CA.crt -keyfile CA.key -out user.crt

Or self signed :

	openssl x509 -req -days 365 -in user.csr -signkey user.key -out user.crt

User certificate exported in PKCS#12 format (for windows) :

	openssl pkcs12 -export -inkey user.key -in user.crt -out user.p12

### NGINX configuration example

Example of an HTTPS configuration for NGINX for `https://www.mydomain.com/` with client certificate authentication on reverse proxy on `/`:

```nginx
server {
	listen 443 ssl;
	server_name www.mydomain.com;
	ssl_trusted_certificate /etc/ssl/CA.crt;
	ssl_certificate /etc/ssl/server.crt;
	ssl_certificate_key /etc/ssl/server.key;
	# Client certificate auth
	ssl_client_certificate /etc/ssl/CA.crt;
	ssl_verify_client optional;
	location / {
		# Pass DN and verification status as HTTP headers
		proxy_set_header X-SSL-Client-S-DN  $ssl_client_s_dn;
		proxy_set_header X-SSL-Client-Verify $ssl_client_verify;
		(...)
	}
	(...)
}
```

> **Note**: With NGNIX it is not possible to configure client certificate authentication per location

### Apache configuration example

Example of an HTTPS configuration for Apache for `https://www.mydomain.com/` with client certificate authentication for `/secure`:

```apache
<VirtualHost *:443>
	ServerName www.mydomain.com
	SSLEngine on
	SSLCACertificateFile /etc/ssl/CA.crt
	SSLCertificateFile /etc/ssl/server.crt
	SSLCertificateKeyFile /etc/ssl/server.key
	<Location /secure>
		# Client certificate auth
		SSLVerifyClient required
		SSLVerifyDepth 1
		# Advanced certificate check
		#SSLRequire %{SSL_CLIENT_S_DN_O} eq "My Organization"
		# Pass DN and verification status as HTTP headers
		RequestHeader set X-SSL-Client-S-DN "%{SSL_CLIENT_S_DN}s"
		RequestHeader set X-SSL-Client-Verify "%{SSL_CLIENT_VERIFY}s"
		(...)
	</Location>
</VirtualHost>
```

### Client calls on client certificate secured URL

For the above examples, the typical `curl` call would be something like:

	curl --cacert CA.crt --cert user.crt --key user.key https://www.mydomain.com/secure/	

### Using client certificate authentication on Simplicité side

See [this document](/docs/authentication/customauth) for details on how to use client certificate on Simplicité side;

Using LetsEncrypt&reg; service
------------------------------

Install the **CertBot** tool:

	yum install epel-release
	yum install certbot

Generate initial certficates:
```shell
sudo certbot certonly --webroot -w <document root, e.g. /var/www/html> -d <server name, e.g. www.example.com>
```
> **Note**: the CertBot tool needs to have **HTTP** access to the `/.well-known/` URI where the validation files are generated

The certificates are generated in `/etc/letsencrypt/live/<server name>/` they need to be configured

NGINX:

```nginx
ssl_certificate /etc/letsencrypt/live/<server name>/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/<server name>/privkey.pem;
```

Apache:

```apache
SSLCertificateFile /etc/letsencrypt/live/<server name>/fullchain.pem
SSLCertificateKeyFile etc/letsencrypt/live/<server name>/privkey.pem
```

The certificates **must** be renewed **regularly** by:

	sudo certbot renew

It is recommended to configure the `root` user's crontable task:

	crontab -e

With

```plaintext
0 4 * * * certbot renew 2>&1
```

> **Note**: To generate a **wildcard** certificate the command is:
> `sudo certbot certonly --manual --preferred-challenges dns-01 --server https://acme-v02.api.letsencrypt.org/directory --domain <server name> --domain *.<server name>`.
> This will require `TXT` DNS entries to be created.