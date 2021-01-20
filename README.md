# kaholo-plugin-jenkins
Jenkins plugin for Kaholo

This plugin is a wrapper for Jenkins RestAPI. 
The plugin is using user's token for authenticating its requests.

Further information on user's token and authenticating requests can be found on [Jenkins documentation](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/).

## Settings ##

* Jenkins Url - The url of your jenkins
* Username - The user to trigger the builds
* Token - The user token item in Kaholo's vault


## Method: Build job

**Description**

Triggers a job build on Jenkins.

**Parameters**

* Job name - The name of the job to build.
* Parameters (Object) - The build parameters. A key-value object refrenced from code layer. 
* Wait for build end - Determine if Kaholo should wait for the build to finish or not. Default: false
* Fail on build failure - Determines if Kaholo should fail the action in case the jenkins build fails. This works only if `Wait for build end` parameter is marked as `treu`. Default: false
