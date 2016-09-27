curl -u 'tomscotch' https://api.github.com/user/repos -d '{"name":"projectname",$ARGV[1]:"atomatically generated"}'
git remote add origin tomscotch@github.com:tomscotch/$ARGV[1].git
git push origin master