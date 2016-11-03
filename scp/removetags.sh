sed -e s/'<[a-zA-Z\/][^>]*>'//g -i /media/scps/*.txt && \

  echo 'finished removing tags' && \

sed -e s/'rating: +58+&\#8211;x'/''/g -i /media/scps/*.txt && \
sed -e s/'&\#8230;'/''/g -i /media/scps/*.txt && \
sed -e s/'<!--'/''/g -i /media/scps/*.txt && \
sed -e s/'&nbsp;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&quot;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&lt;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&gt;'/' '/g -i /media/scps/*.txt && \

  echo 'finished 1' && \

sed -e s/'\[+]'//g -i /media/scps/*.txt && \
sed -e s/'\[-]'//g -i /media/scps/*.txt && \
sed -e s/'rating: +12+&\#8211;x'//g -i /media/scps/*.txt && \
sed -e s/'\_728x90 -->'//g -i /media/scps/*.txt && \

echo 'finished 2' && \

sed -e s/'div-gpt-ad-1410946564449-1'//g -i /media/scps/*.txt && \
sed -e s/'rating: +134+&\#8211;x'//g -i /media/scps/*.txt && \
sed -e s/'googletag.cmd.push(function()'//g -i /media/scps/*.txt && \
sed -e s/'googletag.cmd.push(function()'//g -i /media/scps/*.txt && \
sed -e s/'googletag.display'//g -i /media/scps/*.txt && \
sed -e s/'('div-gpt-ad-1410946564449-1');'//g -i /media/scps/*.txt && \
sed -e s/'{});'//g -i /media/scps/*.txt && \
sed -e s/'); });'//g -i /media/scps/*.txt && \
sed -e s/'8211;x'//g -i /media/scps/*.txt && \

  echo "removed remnants" && \

sed -e s/'<span style="text-decoration: underline;">'//g -i /media/scps/*.txt && \
sed -e s/'<table class="wiki-content-table">'//g -i /media/scps/*.txt && \

  echo 'finished removing trash' && \

sed -e s/'Show interview log'//g -i /media/scps/*.txt && \
sed -e s/'Hide interview log'//g -i /media/scps/*.txt && \
sed -e s/'Show Interview'//g -i /media/scps/*.txt && \
sed -e s/'Show Interview'//g -i /media/scps/*.txt && \
sed -e s/'Show Email'//g -i /media/scps/*.txt && \

echo 'finished 3' && \

sed -e s/'Hide Email'//g -i /media/scps/*.txt && \
sed -e s/'Screenshot of'//g -i /media/scps/*.txt && \
sed -e s/'Hide  Notes'//g -i /media/scps/*.txt && \
sed -e s/'Show  Notes'//g -i /media/scps/*.txt && \

  echo 'finished removing plain strings'

sed -e s/"  "/' '/g -i /media/scps/*.txt && \
sed -e s/'{ ('//g -i /media/scps/*.txt && \
sed -e s/'rating: +330+&#'//g -i /media/scps/*.txt && \



  echo 'Finished'
