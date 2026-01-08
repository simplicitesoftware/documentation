---
sidebar_position: 190
title: Java ssl
---

Java SSL
========

Standalone configuration
------------------------

If you want your Java application **server** to handle HTTPS you have to use a Java keystore file.

> **Note**: for all `keytool` commands below you can avoid interactive password prompting by adding `-noprompt -storepass mypassword`.

### Create a new (self-signed) SSL certificate into a keystore

You can create a new (self signed) SSL certificate directly into a keystore with
(use `mypassword` as keystore password to match application servers' described configuration below):

```shell
keytool -genkey -alias tomcat -keyalg RSA -validity 3650 -keystore mykeystore.jks
```

### Import an existing SSL certificate and key into a keystore

You can import an existing SSL certificate and its key into a keystore by first converting them in PKCS12 format and by importing it into a keystore
(use `mypassword` as passphrase og both to match application servers' described configuration below):

```shell
openssl pkcs12 -export -in mycert.crt -inkey mycert.key -out mycert.p12
keytool -importkeystore -destkeystore mykeystore.jks -srckeystore mycert.p12 -srcstoretype PKCS12
```

### Sign an unsigned certificate and import it back to a keystore

Generate a certificate request from your keystore:

```shell
keytool -certreq -alias tomcat -keyalg RSA -file mycert.csr -keystore mykeystore.jks
```

Once you get the signed certificate `mycert-signed.crt` import it with back into the keystore with:

```shell
keytool -importcert -alias tomcat -file mycert-signed.crt -keystore mykeystore.jks
```

:::note

Make sure that the Java global `cacerts` keystore contains the CA certificate that signed your certificate,
if it is not the case you need to add it with:
`keytool -keystore /etc/pki/java/cacerts -import -trustcacerts -alias <CA alias> -file <CA certificate file>.crt`

:::

### List keystore contents

You can list the certificates present in the keystore with:

```shell
keytool -list -v -keystore mykeystore.jks
```

### Tomcat HTTPS connector configuration

Applicable to Tomcat 8.x, 9.x and to TomEE

```xml
<Connector
    port="8443" protocol="org.apache.coyote.http11.Http11Protocol"
    SSLEnabled="true" scheme="https" secure="true"
    clientAuth="false" sslProtocol="TLS"
    keystoreFile="${catalina.home}/conf/mykeystore.jks" keystorePass="mypassword"
    (...)
    />
```

<!--
### Legacy JBoss HTTPS connector configuration

Applicable to Legacy JBoss 4.0 and 4.2

```xml
<Connector port="8443" protocol="HTTP/1.1"
    SSLEnabled="true" scheme="https" secure="true"
    clientAuth="false" sslProtocol="TLS"
    keystoreFile="${jboss.server.home.dir}/conf/mykeystore.jks" keystorePass="mypassword"
    (...)
/>
```
-->

Behind a reverse proxy configuration
------------------------------------

If HTTPS is handled by a reverse proxy that calls your Tomcat server on an HTTP port you need to add some
additional attributes to the connector configuration so as it understands it is publicly exposed in HTTPS:

```xml
<Connector
    (...)
    scheme="https" secure="true" <= REQUIRED
    proxyName="<public host name>" proxyPort="<public port, usually 443>" <= OPTIONAL (required if the reverse proxy does not relay the actual public host name and public port number)
    />
```

:::note

If you don't need this if you are using a reverse proxy using the AJP protocol

:::
