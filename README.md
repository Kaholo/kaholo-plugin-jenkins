# kaholo-plugin-jenkins
Jenkins plugin for Kaholo.

This plugin is a wrapper for Jenkins RestAPI. 
The plugin is using user's token for authenticating its requests.

Further information on user's token and authenticating requests can be found on [Jenkins documentation](https://www.jenkins.io/doc/book/system-administration/authenticating-scripted-clients/).

## Settings ##

1. Jenkins URL (String) - The URL of your Jenkins.
2. Username (String) - The username used to trigger the builds.
3. Token (Vault) - The user token item stored in Kaholo Vault.


## Method: Build job

Triggers a job build on Jenkins. [Learn More](https://www.jenkins.io/doc/pipeline/steps/pipeline-build-step/#build-build-a-job)

### Parameters

1. Job name (String) - The name of the job to build.
2. Parameters (Object) - The build parameters. Pass a key-value code object of parameters, such as ```{param1: 'paramValue'}```.
3. Wait For Build End (Boolean) - Determines if Kaholo should wait for the build to finish or not. Default value: ```false```.
4. Fail On Build Failure (Boolean) - Determines if Kaholo should fail the action in case the Jenkins build fails. This works only if `Wait for build end` parameter is marked as `true`. Default value: ```false```.
