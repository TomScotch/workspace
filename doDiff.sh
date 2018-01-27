for x in $(ls ../save/ -d -1 */) ; do diff -q ../save/$x $x ; done
