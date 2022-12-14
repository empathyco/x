# Security Policy

## Reporting a Vulnerability

Please **do NOT** raise a GitHub Issue to report a security vulnerability. This kind of issues must
be communicated in a private manner. If you believe you have found a security vulnerability, report
it to our dedicated email address
[security_champions@empathy.co](mailto:security_champions@empathy.co). We ask that you do not use
other channels or contact project contributors directly. Non-vulnerability related security issues
such as new great new ideas for security features are welcome on GitHub Issues.

On top of that, if you would like to provide a patch, please **do not open a pull request** as it is
another public way to discover the vulnerability. Instead, create a commit on your fork of
**empathyco/x** and run this command:

```bash
git format-patch -1 HEAD --stdout > x_security_patch.txt
```

This command will create a file called `x_security_patch` with the content of your last commit.

As a summary, send an email with:

- Subject: Interface X Security Alert
- Content: Description of the vulnerability
- Attach the `x_security_patch` file if you have created one.

Thanks for your contribution.
