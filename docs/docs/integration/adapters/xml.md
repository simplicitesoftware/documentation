---
sidebar_position: 40
title: XML -> DB
---

SAX XML Parser
====================

A SAX XML parser based adapter is provided as an abstract class to be overridden `com.simplicite.util.integration.SAXParserAdapter`.

For more information on SAX, please refer to the [standard Java tutorials](https://docs.oracle.com/javase/tutorial/jaxp/sax/index.html)

Typical usage is as follows:

```java
private class MyAdapter extends com.simplicite.util.integration.SAXParserAdapter {
	private class MyHandler extends com.simplicite.util.integration.SAXParserHandler {
		public MyHandler(OutputStream out, OutputStream err, OutputStream log) { super(out, err, log); }
			// You SAX handler implementation here...
		}

		public void process() throws InterruptedException {
			setParser(this.new MyHandler(getOutputStream(), getErrorStream(), getLogStream()));
			super.process();
		}
	}
}
```

And a simplified wrapper adapter for SAX parser based adapter is also provided as an
abstract class to be overridden: `com.simplicite.util.integration. SimpleSAXParserAdapter`.
The methods to implement are in this case (current grant is available using the `getGrant()` method).:

```java
public void startProcess()
public void startTagProcess(String uri, String localName, String qName, Attributes attributes)
public void processValue(String value)
public void endTagProcess(String uri, String localName, String qName)
public void endProcess()
```