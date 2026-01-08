---
sidebar_position: 120
title: Advanced code examples
---

Advanced code examples
======================

These examples illustrate more complex use cases for implementing business logic in Java within Simplicité. They are intended for developers
already familiar with the basics of object modeling and Java integration.

Before diving in, please refer to the [basic code examples](/docs/core/basic-code-examples) for guidelines on naming conventions and logging
strategies to ensure consistency and maintainability.

Sharing parameters
------------------

It can be useful to store parameters (or serializable objects) in the user's session (Grant) or object instances (ObjectDB)

### Object-level parameter

- Share parameters between screens in the user's navigation: a component needs to know from where it has been opened...
- Use some parameters in Action: asynchronous or recursive calls to limit the stack size (with heap memory)
- Use some parameters in External objects (not thru http parameters on each browser calls)

Examples:

Share a parameter between objects:

```java
@Override
public void initUpdate() {
    getGrant().setParameter("MYAPP_CONTEXT_ID", getRowId());
    super.initUpdate();
}

@Override
public void initList(ObjectDB parent) {
    // To use the current Id of A when a list B is displayed
    String id = getGrant().getParameter("MYAPP_CONTEXT_ID");
    if (!Tool.isEmpty(id)){
        // ...
    }
    super.initList(parent);
}

@Override
    public Object display(Parameters params) {
    // To use the current Id of A when the external object is displayed
    String id = getGrant().getParameter("MY_CONTEXT_ID");
    if (!Tool.isEmpty(id)){
        // ...
    }
}

public void myAction() {
    // To use the current Id of A when a list B is displayed
    String id = getGrant().getParameter("MY_CONTEXT_ID");
    if (!Tool.isEmpty(id)){
        // ...
    }
}
```

Store a set of data (as `org.json.JSONObject` between hooks of the same object:

```Java
@Override
public List<String> postValidate() {
    JSONObject data = new JSONObject().put("key1", "value").put("key2", 123).put("key3", new JSONArray().put(new JSONObject()/* ... */));
    getGrant().setParameter("MY_DATA", data.toString());
    return super.postValidate();
}

@Override
public String postSave() {
    JSONParser parser = new JSONParser();
    JSONObject data = (JSONObject) parser.parse(getParameter("MY_DATA"));
    AppLog.info(data.toString(),getGrant());
    String k1 = data.getString("key1");
    int k2 = data.getInt("key2");
    JSONArray k3 = data.getJSONArray("key3");
    // ...
    return super.postSave();
}
```

Etc.

### Global parameter

To make a global setting, it is necessary to use the system singleton

```java
Grant.getSystemAdmin().setParameter(name, value);
Grant.getSystemAdmin().getParameter(name);
Grant.getSystemAdmin().removeParameter(name);
```

### Session parameter

The best solution is to load the parameter depending on user in the `GrantHooks` at logon:

- To request only once any external resource (LDAP, ...) to retrieve external data, rights...
- Or read some fields added to the object User or in the local database

Example:

```java
@Override
public void postLoadGrant(Grant g) {
    try {
        String login = g.getLogin();
        String employeeId = g.simpleQuery("select ... query depending on login ...");
        g.setParameter("MYAPP_EMP_ID", Tool.isEmpty(employeeId)?"unknown" : employeeId);
        String empPhone = Tool.readUrl("http://...external REST service...");
        g.setParameter("MYAPP_EMP_PHONE", empPhone);
    } catch (IOException e) {
        AppLog.error(e, g);
    }
    super.postLoadGrant(g);
}
```

### Booby traps

- `name`: prefix the names of the grant-level parameters with your **unique** project code to prevent any conflicts
- `value`: store small values/objects in memory (parameters are in the user's session = the JVM heap)
- use the `removeParameter` to free memory when the parameter has been used (if not parameters will expire with the session)

Advanced validations
--------------------

### Phone number validations

As of version 3.1 MAINTENANCE 07, it is possible to do an advanced validation of phone numbers fields
(typically in a `preValidate` or `postValidate` hook).

**Example**:

```Java
try {
    setFieldValue("myPhoneNumber",  new PhoneNumTool("fr").getNationalNumber(getFieldValue("myPhoneNumber")));
} catch (ParamsException e) {
    AppLog.error(e, getGrant());
}
```

:::note

it is also possible to format as international number using `getInternationalNumber` instead of `getNationalNumber`

:::

Data preparation
----------------

### Dynamic list generation

In order to programmatically generate a list of values, you have to:

1. assign a non-empty static list of values to the field, as you would do for a normal list
   (this is to avoid "empty list" errors to be triggered by the platform)
2. build the dynamic list in the appropriate object's hook:
   - in the `postLoad` hook if the list is fixed for the duration of the user's session
   - in the `postSelect` hook if, for instance, the list depends on the current record
   - etc.

**Example**:

```java
@Override
public void postLoad() {
    ObjectField field = getField("myField");
    field.setList(new ObjectFieldList(field)); // Empty the configured list
    // Build list (here the next 10 years)
    ObjectFieldList list = field.getList();
    int year = Tool.parseInt(Tool.getCurrentYear(), 2000);
    for (int i = year; i <= year + 10; i++)
        list.putItem(new EnumItem(String.valueOf(i), this.getGrant().T("YEAR") + " " + i)); // enum item = (value, label)
    super.postLoad();
}
```

Data encryption
---------------

As of version 3.2 you can use the `EncryptionTool`class to encrypt/decrypt a field value.
`EncryptionTool` uses the system parameter `ENCRYPTION_ALGORITHM` (defaults to `AES`).

Encryption/decryption methods using `String` produce/consumes Base64-encoded strings.

**Example:**

```Java
public String key() {
    // ZZZ set as a system parameter (make sure to configure it as "private") ZZZ
    //return getGrant().getParameter("MY_ENCRYPTION_KEY");
    // or
    // ZZZ pass this to the JVM by -Dmy.encryption.key=...
    //return System.getProperty("my.encryption.key");
    // or
    // ZZZ set this in the JVM environment
    return System.getenv("MY_ENCRYPTION_KEY");
    // etc.
}

@Override
public String preSave() {
    // Encrypt the value before saving
    try {
        ObjectField l = getField("mySensitiveField");
        l.setValue(EncryptionTool.encrypt(l.getValue(),key()));
    } catch (EncryptionException e) {
        AppLog.error(e, getGrant());
    }
    return super.preSave();
}

@Override
public void postSelect(String rowId, boolean copy) {
    // Decrypt the value after selecting it
    ObjectField l = getField("mySensitiveField");
    try {
        l.setValue(EncryptionTool.decrypt(l.getValue(), key()));
    } catch (EncryptionException e) {
        AppLog.error(e, getGrant());
    }
    super.postSelect(rowId, copy);
}
```

:::note

An encrypted field using this method cannot be searchable except of exact values (by encrypting the search filter in the `preSearch` hook)

:::

Since version 6.0, you can use the hook `fieldEncryptDB`:

- To be called automatically on form, list (edit list...), search
- but also in more UI context: crosstab, redolog...

**Example:**

```java
private String getKey() {
    // ZZZ set as a system parameter (make sure to configure it as "private") ZZZ
    //return getGrant().getParameter("MY_ENCRYPTION_KEY");
    // or
    // ZZZ pass this to the JVM by -Dmy.encryption.key=...
    //return System.getProperty("my.encryption.key");
    // or
    // ZZZ set this in the JVM environment
    return System.getenv("MY_ENCRYPTION_KEY");
    // etc.
}

/**
 * Encrypt or decrypt the field value
 * @param f    Object Field
 * @param value Field value (encrypted or decrypted)
 * @param encrypt true to encrypt the value, false to decrypt
 * @param context create/update to encrypt, select/redolog to decrypt
 * @return encrypted or decrypted value
 */
public String fieldEncryptDB(ObjectField f, String value, boolean encrypt, String context) {
    if (f.getName().equals("mySensitiveField")) {
        return encrypt
            ? EncryptionTool.encrypt(value, getKey())
            : EncryptionTool.decrypt(value, getKey());
    }
    return super.fieldEncryptDB(f, value, encrypt, context);
}
```

Call remote URL with client certificate
---------------------------------------

In this example the object is storing the client certificate JKS file as a document field
and the certificate password as a password field.

It can be easily transposed with the JKS available as a static local file or as a (protected) resource
and with the password stored as a system parameter or a environment variable etc.

```Java
public String callAPI() {
    try {
        String url = "https://myremotehost/myservice";
        DocumentDB cert = getField("myClientCertificateField").getDocument();
        String pwd = getFieldValue("myClientCertificatePasswordField");
        AppLog.info("Calling " + url + " with client certificate " + cert.getName(),getGrant());
        return Tool.readUrlWithClientCert(url, cert.getBytes(true), pwd);
    } catch (IOException e) {
        AppLog.error(e, getGrant());
    }
    return "";
}
```

:::note

The client certificate **must** be a JKS file, if you have a PEM certificate you can convert
it to JKS format converting it first as PKCS12 using `openssl pkcs12 -export -inkey mycert.key -in mycert.pem -out mycert.p12`
and then importing it in a JKS file using `keytool -importkeystore -destkeystore mycert.jks -srckeystore mycert.p12 -srcstoretype PKCS12`
(you will be prompted to enter the passwords for the certificates)

:::

Asynchronous code
-----------------

This example to implement a monitoring of CSV exports launched in parallel.

```Java
// Launcher, example : Action button
public String myActionMethod() {
    JobQueue.push("myExport123", new Runnable() {
        @Override
        public void run() {
            ObjectDB obj = getGrant().getObject("myExportObject123", "MyObject");
            CSVTool.export(obj...);
        }
    });
```

and tracker thread, example : external object to display the counter

```Java
@Override
public String display(Parameters params) {
    // same object instance
    ObjectDB obj = getGrant().getObject("myExportObject123", "MyObject");
    return obj.getParameter(ImportExportTool.EXPORT_PROGRESS);
}
```
