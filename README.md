# Kaholo Jenkins Plugin
Jenkins is an open source automation server. It is a server-based system that runs in servlet containers such as Apache Tomcat.

This plugin extends Kaholo's functionality in include triggering Jenkins jobs. Both Build and Build with Parameters are supported.

## Plugin Installation
For download, installation, upgrade, downgrade and troubleshooting of plugins in general, see [INSTALL.md](./INSTALL.md).

## Authentication
Authentication is managed in Plugins | Settings, where the plugin's name is a blue hyperlink leading to the plugin's settings and accounts. This plugin has no settings but makes use of only accounts.

Alternately accounts may be created using the "Add New Plugin Account" drop-down feature in parameter "Account" after selecting a plugin method.

The required Account parameters include:
* Jenkins Base URL - The URL of your Jenkins dashboard, excluding the final `/`
* Jenkins Username - The Jenkins username associated with the provided token
* Jenkins API Token - The token associated with the provided username, stored in the Kaholo vault

If an account is set as the default account, all new pipeline actions created using the plugin will be preconfigured to use the account, as a convenience.

## Method: Build Now
Triggers a Jenkins job as when using "Build Now" in the Jenkins Dashboard. This method works only with jobs that have no parameters.

### Parameter: Jenkins Job Name
The name of the Job (Pipeline) in the Jenkins Dashboard. This is case insensitive.

### Parameter: Wait for Job End
If selected, the Kaholo Action will wait for the Jenkins Job to complete and return details and status of the job. Otherwise, only a Jenkins queueNumber is returned.

### Parameter: Fail on Job Failure
If selected, the Kaholo Action will end in Failure (with red status indicator) if the Jenkins job fails. This is required if the action is also configured to stop the pipeline on failure. Otherwise regardless of Jenkins job status, the Action will succeed and the Kaholo pipeline will continue. Enabling "Fail on Job Failure" implies to "Wait for Job End".

## Method: Build with Parameters
Triggers a Jenkins job as when using "Build with Parameters" in the Jenkins Dashboard. This method works only with jobs that have parameters.

### Parameter: Jenkins Job Name
The name of the Job (Pipeline) in the Jenkins Dashboard. This is case insensitive.

### Parameter: Parameters
Parameters are entered as plain text key=value pairs. For example:

    BRANCH=dev
    MODE=debug

If using the code layer instead, parameters may be provided as either a string or an object. For example:

    "BRANCH=dev\nMODE=debug"

or

    new Object({BRANCH: "dev", MODE: "debug"})

### Parameter: Wait for Job End
If selected, the Kaholo Action will wait for the Jenkins Job to complete and return details and status of the job. Otherwise, only a Jenkins queueNumber is returned.

### Parameter: Fail on Job Failure
If selected, the Kaholo Action will end in Failure (with red status indicator) if the Jenkins job fails. This is required if the action is also configured to stop the pipeline on failure. Otherwise regardless of Jenkins job status, the Action will succeed and the Kaholo pipeline will continue. Enabling "Fail on Job Failure" implies to "Wait for Job End".