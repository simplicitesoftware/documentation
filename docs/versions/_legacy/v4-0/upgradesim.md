---
sidebar_position: 20
title: Upgrade SIM
---

Upgrade an existing SIM server to use only the **release** branches
===================================================================

Login as user `simplicite`.

Remove the **master** and **prerelease** branches
-------------------------------------------------

First check with `sim versions` which branches you actually use, then (adapt to your case) run the following commands:

	sql "delete from versions where version in ('4.0', '4.0l', '4.0p', '4.0pl')"
	sql "update versions set version='4.0' where version = '4.0r'"
	sql "update versions set version='4.0l' where version = '4.0rl'"

and

	rm -fr template-4.0 template-4.0l template-4.0p template-4.0pl
	mv template-4.0r/ template-4.0
	mv template-4.0rl/ template-4.0l

Replace the `git/template-4.0.git/hooks/post-receive` Git hook by

```bash
#!/bin/bash

gitversion=4.0
for branch in release release-light
do
        version=$gitversion
        [ $branch = 'release' ] && version=${version}
        [ $branch = 'release-light' ] && version=${version}l
        echo "Updating version $version template (branch $branch)..."
        rm -fr /var/simplicite/template-$version
        mkdir /var/simplicite/template-$version
        git --work-tree=/var/simplicite/template-$version --git-dir=/var/simplicite/git/template-$gitversion.git checkout -f $branch
        if [ $? = 0 ]
        then
                chmod +x /var/simplicite/template-$version/tools/*.sh
                date=`git --git-dir=/var/simplicite/git/template-$gitversion.git log -1 --date=iso | awk '/^Date:/ { print $2" "$3 }'`
                echo "Last commit date: $date"
                sqlite3 /var/simplicite/data/apps.db "update versions set date = '$date' where version = '$version'"
                echo "Done"
        else
                echo "${branch} not (yet) available in /var/simplicite/git/template-$gitversion.git"
        fi
done
```

And run `sim refresh` and `sim versions` to check everything is OK

Change the existing instances
-----------------------------

	sql "update instances set version='4.0' where version in ('4.0p', '4.0r')"
	sql "update instances set version='4.0l' where version in ('4.0pl', '4.0rl')"

Optional: clean the Git repository
----------------------------------

	cd git/template-4.0.git
	git branch -D master
	git branch -D master-light
	git branch -D prerelease
	git branch -D prerelease-light
	