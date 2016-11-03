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
