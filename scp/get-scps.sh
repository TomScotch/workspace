for i in {0..9}; do \
  if [ ! -f /media/scps/scp-000$i.html ] ; then \
    wget -c -o /media/scps/scp-000$i.html http://www.scp-wiki.net/scp-00$i ; \
    echo "scp-000"$i".html downloaded"
  else
    echo "scp-000"$i".html already existing"
  fi ; \
done && \

for i in {10..99}; do \
  if [ ! -f /media/scps/scp-00$i.html ] ; then \
    wget -c -o /media/scps/scp-00$i.html http://www.scp-wiki.net/scp-00$i ; \
    echo "scp-00"$i".html downloaded"
  else
    echo "scp-00"$i".html already existing"
  fi ; \
done && \

for i in {100..999}; do \
  if [ ! -f /media/scps/scp-0$i.html ] ; then \
    wget -c -o /media/scps/scp-0$i.html http://www.scp-wiki.net/scp-0$i ; \
    echo "scp-0"$i".html downloaded"
  else
    echo "scp-0"$i".html already existing"
  fi ; \
done && \

for i in {1000..2999}; do \
  if [ ! -f /media/scps/scp-$i.html ] ; then \
    wget -c -o /media/scps/scp-$i.html http://www.scp-wiki.net/scp-$i ; \
    echo "scp-"$i".html downloaded"
  else
    echo "scp-"$i".html already existing"
  fi ; \
done
