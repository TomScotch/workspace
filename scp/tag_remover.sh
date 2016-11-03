sed -e s/'fractal-Jan19_1.jpg//g -i /media/scps/*.txt
sed -e s/'aliveeuclidfeaturedscpstructuretransfiguration//g -i /media/scps/*.txt
sed -e s/'black.png'//g -i /media/scps/*.txt
sed -e s/'humanoidneutralizedreanimationsafesapientscpsentient'/''/g -i /media/scps/*.txt && \
sed -e s/'animalautonomousdocumentelectroniceuclidfelineleporinepitch-havenprometheus'/''/g -i /media/scps/*.txt && \
sed -e s/'Next iteration --->'/''/g -i /media/scps/*.txt && \
sed -e s/'animalautonomousdocumentelectroniceuclidfelineleporinepitch-havenprometheussapientscpsentientskeletal'/''/g -i /media/scps/*.txt && \
sed -e s/'euclidextraterrestrialinfohazardmetascptransmission'/''/g -i /media/scps/*.txt && \
sed -e s/'euclidmind-affectingneurologicalscpsensoryvisual'/''/g -i /media/scps/*.txt && \
sed -e s/'global-occult-coalitionhistoricalhumanoidsafescpvehicleweapon'/''/g -i /media/scps/*.txt && \
sed -e s/'autonomouseuclidlightmobilesapientscpsentient'/''/g -i /media/scps/*.txt && \
sed -e s/'biohazardcontagionhumanoidneurologicalsafesapientscpsentienttransfiguration'/''/g -i /media/scps/*.txt && \
sed -e s/'audioautonomouseuclidextraterrestrialmind-affectingsapientscpsentient'/''/g -i /media/scps/*.txt && \
sed -e s/'series.pngSeries III (2000-2999)'/''/g -i /media/scps/*.txt && \

sed -e s/'<[a-zA-Z\/][^>]*>'//g -i /media/scps/*.txt && \

  echo 'finished removing tags' && \

sed -e s/'rating: +58+&\#8211;x'/''/g -i /media/scps/*.txt && \
sed -e s/'&\#8230;'/''/g -i /media/scps/*.txt && \
sed -e s/'<!--'/''/g -i /media/scps/*.txt && \
sed -e s/'&nbsp;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&quot;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&lt;'/' '/g -i /media/scps/*.txt && \
sed -e s/'&gt;'/' '/g -i /media/scps/*.txt && \
sed -e s/'+&#'/' '/g -i /media/scps/*.txt && \

  echo 'finished 1' && \

sed -e s/'\[+]'//g -i /media/scps/*.txt && \
sed -e s/'\[-]'//g -i /media/scps/*.txt && \
sed -e s/'rating: -'//g -i /media/scps/*.txt && \
sed -e s/'rating: +'//g -i /media/scps/*.txt && \
sed -e s/'\_728x90 -->'//g -i /media/scps/*.txt && \

echo 'finished 2' && \

sed -e s/'div-gpt-ad-1410946564449-1'//g -i /media/scps/*.txt && \
sed -e s/'rating: '//g -i /media/scps/*.txt && \
sed -e s/'&\#8211;x'//g -i /media/scps/*.txt && \
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
sed -e s/'<div>'//g -i /media/scps/*.txt && \
sed -e s/'<\/div>'//g -i /media/scps/*.txt && \
sed -e s/'<p>'//g -i /media/scps/*.txt && \
sed -e s/'<strong>'//g -i /media/scps/*.txt && \
sed -e s/'<\/strong>'//g -i /media/scps/*.txt && \
sed -e s/'<\/p>'//g -i /media/scps/*.txt && \
sed -e s/'<em>'//g -i /media/scps/*.txt && \
sed -e s/'<\/em>'//g -i /media/scps/*.txt && \
sed -e s/'<tt>'//g -i /media/scps/*.txt && \
sed -e s/'<\/tt>'//g -i /media/scps/*.txt && \
sed -e s/'<tr>'//g -i /media/scps/*.txt && \
sed -e s/'<\/tr>'//g -i /media/scps/*.txt && \
sed -e s/'<td>'//g -i /media/scps/*.txt && \
sed -e s/'<\/td>'//g -i /media/scps/*.txt && \
sed -e s/'<span>'//g -i /media/scps/*.txt && \
sed -e s/'<\/span>'//g -i /media/scps/*.txt && \
sed -e s/'<blockquote>'//g -i /media/scps/*.txt && \
sed -e s/'<\/blockquote>'//g -i /media/scps/*.txt && \
echo 'finished removing tags' && \
sed -e s/'&quot;'//g -i /media/scps/*.txt && \
sed -e s/'&lt;'//g -i /media/scps/*.txt && \
sed -e s/'&gt;'//g -i /media/scps/*.txt && \
sed -e s/'<span style="text-decoration: underline;">'//g -i /media/scps/*.txt && \
sed -e s/'<table class="wiki-content-table">'//g -i /media/scps/*.txt && \
echo 'finished removing trash' && \
sed -e s/'Show Interview'//g -i /media/scps/*.txt && \
sed -e s/'Show Interview'//g -i /media/scps/*.txt && \
sed -e s/'Hide Interview'//g -i /media/scps/*.txt && \
sed -e s/'Screenshot of'//g -i /media/scps/*.txt && \
sed -e s/'Hide  Notes'//g -i /media/scps/*.txt && \
sed -e s/'Show  Notes'//g -i /media/scps/*.txt && \
echo 'finished removing'
