Resolving tags conflicts when running `lerna publish`
----
```
$ git tag
v0.0.1
v0.0.4
```
- remove the tag locally
```
$ git tag -d v0.0.4
Deleted tag 'v0.0.4' (was c34157b)
$ git tag -d v0.0.1
Deleted tag 'v0.0.1' (was edfaa93)
```
- remove the tag remotely
```
$ git push origin :refs/tags/v0.0.4
To https://github.com/cdmbase/ide-stack.git
 - [deleted]         v0.0.4
$ git push origin :refs/tags/v0.0.1
To https://github.com/cdmbase/ide-stack.git
 - [deleted]         v0.0.1
```

