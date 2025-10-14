---
sidebar_position: 50
title: JBoss custom JAAS module
---

JBoss specific JAAS module
==========================

A Simplicité application is a JEE application which relies on standard application server authentication methods (JAAS).

The following example applies to version 4.0 and 4.2 of JBoss application server.

By default Simplicité authenticates its users against its own database using the login and password
stored in the m_user table (and accessible at the logical level using the `User` and `UserPwd` business objects). 

For the JBoss application server the default JAAS module descriptor is packaged as a Service ARchive (SAR)
that includes the descriptor (called `login-config.xml`) of the JAAS module using, by default the one included
in the `authSimplicite-x.y.z.jar` or the specifically overridden one put in the `auth` folder.

The default descriptor is as follows:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE policy
   PUBLIC "-//JBoss//DTD JBOSS Security Config 3.0//EN"
   "http://www.jboss.org/j2ee/dtd/security_config.dtd">

<policy>
	<application-policy name="myapp">
		<authentication>
			<login-module code="org.jboss.security.auth.spi.DatabaseServerLoginModule" flag="required">
				<module-option name="dsJndiName">java:/myapp</module-option>
				<module-option name="principalsQuery">select usr_password from m_user where usr_login=? and (usr_active is null or usr_active='1')</module-option>
				<module-option name="rolesQuery">select 'simplicite', 'Roles' from m_user where usr_login=? and (usr_active is null or usr_active='1')</module-option>
			</login-module>
		</authentication>
	</application-policy>
</policy>
```

The standard JAAS module provided by JBoss is used (optionally modifiable to support MD5 encryption for passwords), or any other standard JAAS module from JBoss may be used.

For cases requiring a more specific authentication process, a custom JAAS module must be implemented. The following example is not a comprehensive JAAS tutorial but simply demonstrates an alternative JAAS module.

This example authenticates a user against a corporate LDAP and then verifies that the user exists in the m_user table with an active status:

```java
package com.simplicite.auth;

import java.security.acl.Group;
import java.security.Principal;
import javax.security.auth.login.LoginException;
import javax.sql.*;
import java.sql.*;
import java.util.Properties;
import javax.naming.*;
import javax.naming.directory.*;
import javax.naming.ldap.*;
import org.jboss.security.SimpleGroup;
import org.jboss.security.auth.spi.UsernamePasswordLoginModule;

public class MyLdapLoginModule extends UsernamePasswordLoginModule {
	public MyLdapLoginModule() {
	}

	private transient SimpleGroup userRoles = new SimpleGroup("Roles");

	protected String getUsersPassword() throws LoginException {
		return "";
	}

	protected Group[] getRoleSets() throws LoginException {
		Group[] roleSets = { userRoles };
		return roleSets;
	}

	protected boolean validatePassword(String inputPassword, String expectedPassword) {
		boolean isValid = false;

		try {
			if ((inputPassword != null) && (inputPassword.length() < 1)) throw new Exception("Missing password");
			if (!checkDBUser()) throw new Exception("User unknown in the database");
			createLdapInitContext(getUsername(), inputPassword);
			isValid = true;
		} catch (Throwable e) {
			super.setValidateError(e);
		}

		return isValid;
	}

	private boolean checkDBUser() throws Exception {
		boolean res = false;
		
		Context initContext = new InitialContext();
		Context envContext  = (Context) initContext.lookup("java:/comp/env");
		DataSource ds = (DataSource) envContext.lookup("jdbc/myapp");

		Connection conn = ds.getConnection();

		Statement stmt = conn.createStatement();
		ResultSet rs = stmt.executeQuery("select count(*) from m_user where usr_login = '" + getUsername() + "' and usr_active = '1'");
		res = (rs.next() && (rs.getInt(1) > 0));
		rs.close();
		conn.close();
		
		return res;
	}
	
	private InitialLdapContext getLdapContext(String ldapUrl, String principal, Object credential) throws Exception {
		Properties env = new Properties();

		env.setProperty(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
		env.setProperty(Context.SECURITY_AUTHENTICATION, "simple");
		env.setProperty(Context.PROVIDER_URL, ldapUrl);

		env.setProperty(Context.SECURITY_PRINCIPAL, principal);
		env.put(Context.SECURITY_CREDENTIALS, credential);

		return new InitialLdapContext(env, null);
	}

	private void createLdapInitContext(String username, Object credential) throws Exception {
		String ldapUrl = (String) options.get("ldapUrl");

		InitialLdapContext ctx = getLdapContext(ldapUrl, "", "");
		String userDN = null;

		SearchControls controls = new SearchControls();
		controls.setSearchScope(SearchControls.SUBTREE_SCOPE);
		controls.setReturningAttributes(null);
		controls.setTimeLimit(10000);
		Object[] filterArgs = { username };

		NamingEnumeration answer = ctx.search("ou=myorgunit,o=myorg", "uid={0}", filterArgs, controls);
		if (answer.hasMore()) {
			SearchResult sr = (SearchResult) answer.next();
			userDN = sr.getName().toString() + ",ou=myorgunit,o=myorg";
		}

		ctx.close();

		ctx = getLdapContext(ldapUrl, userDN, credential);

		Principal p = super.createIdentity("simplicite");
		userRoles.addMember(p);

		ctx.close();
	}
}
```

The corresponding descriptor is as follows (it provides the LDAP URL as a module parameter):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE policy PUBLIC
	"-//JBoss//DTD JBOSS Security Config 3.0//EN"
	"http://www.jboss.org/j2ee/dtd/security_config.dtd">

<policy>
<application-policy name="myapp">
	<authentication>
		<login-module code="com.simplicite.auth.MyLdapLoginModule" flag="required">
			<module-option name="ldapUrl">ldap://myldapurl:389</module-option>
		</login-module>
	</authentication>
</application-policy>
</policy>
```
