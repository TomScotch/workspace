#FIRMA
c=1 ;echo "creating database";
sudo mysql -Bse "CREATE DATABASE IF NOT EXISTS wipa;" ;
echo "creating company";sudo mysql -Bse "USE wipa;CREATE TABLE firma( firma_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255), phone_number VARCHAR(255));";
echo "generating companies to fill table";
for x in $(seq 1 30); do clear ; echo $c" from 30" ; c=$((c+1)) ; sudo mysql -Bse "USE wipa;INSERT INTO firma (name,address,phone_number) VALUES ( '$(faker company)','$(faker address | tr -d '\n')','$(faker phone_number)');" ; done;
echo "finished creating companies"

#NIEDERLASSUNG
c=1;echo "creating branches";
sudo mysql -Bse "USE wipa;CREATE TABLE niederlassung( niederlassung_id INT AUTO_INCREMENT PRIMARY KEY, address VARCHAR(255), phone_number VARCHAR(255));";
echo "generating branches to fill table";
for x in $(seq 1 30); do clear ; echo $c" from 30" ; c=$((c+1)) ; sudo mysql -Bse "USE wipa;INSERT INTO niederlassung (address,phone_number) VALUES ( '$(x=$(faker address | head -1);x=$x" "$(faker address | tail -2) ; echo $x)','$(faker phone_number)');" ; done;
echo "finished creating branches"

#FIRMA_HAT_NIEDERLASSUNG
c=0;echo "creating link from company to branches";
sudo mysql -Bse "USE wipa;CREATE TABLE firma_hat_niederlassung( firma_hat_niederlassung_id INT AUTO_INCREMENT PRIMARY KEY,firma_id INT,niederlassung_id INT);";
echo "generating branches to fill table";for x in $(seq 1 30); do clear  ; c=$((c+1)) ;sudo mysql -Bse "USE wipa;INSERT INTO firma_hat_niederlassung (firma_id,niederlassung_id) VALUES ( '$(echo $c)','$(echo $c)' );" ; echo $c" from 30" ; done
echo "finished creating branches";

#FIRMA_HAT_PRAKTIKANTEN
c=0;echo "creating link from company to practicals";
sudo mysql -Bse "USE wipa;CREATE TABLE firma_hat_praktikanten( firma_hat_praktikanten_id INT AUTO_INCREMENT PRIMARY KEY,firma_id INT,praktikant_id INT);";
echo "generating branches to fill table";for x in $(seq 1 30); do clear  ; c=$((c+1)) ;sudo mysql -Bse "USE wipa;INSERT INTO firma_hat_praktikanten (firma_id,praktikant_id) VALUES ( '$(echo $c)','$(echo $c)' );" ; echo $c" from 30" ; done
echo "finished creating branches";

#JOBS
c=0;echo "creating jobs";
sudo mysql -Bse "USE wipa;CREATE TABLE jobs( jobs_id INT AUTO_INCREMENT PRIMARY KEY,jobname VARCHAR(255));";
echo "generating branches to fill table";for x in $(seq 1 30); do clear  ; c=$((c+1)) ;sudo mysql -Bse "USE wipa;INSERT INTO jobs(jobname) VALUES ('$(faker job)' );" ; echo $c" from 30" ; done
echo "finished creating jobs";

#PRAKTIKANTEN
c=1;echo "creating practicals";
sudo mysql -Bse "USE wipa;CREATE TABLE praktikanten( praktikanten_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255),address VARCHAR(255),phone_number VARCHAR(255));";
echo "generating branches to fill table";
for x in $(seq 1 30); do clear ; echo $c" from 30" ; c=$((c+1)) ; sudo mysql -Bse "USE wipa;INSERT INTO praktikanten (name,address,phone_number) VALUES ('$(faker name)', '$(faker address | tr -d '\n')','$(faker phone_number)');" ; done;
echo "finished creating practicals"

#PRAKTIKANT_HAT_JOB
c=0;echo "creating link from practical to job";
sudo mysql -Bse "USE wipa;CREATE TABLE praktikant_hat_job( praktikant_hat_job_id INT AUTO_INCREMENT PRIMARY KEY,praktikant_id INT,job_id INT);";
echo "generating branches to fill table";for x in $(seq 1 30); do clear  ; c=$((c+1)) ;sudo mysql -Bse "USE wipa;INSERT INTO praktikant_hat_job (praktikant_id,job_id) VALUES ( '$(echo $c)','$(echo $c)' );" ; echo $c" from 30" ; done
echo "finished creating branches";

sudo mysql -Bse "USE wipa;SELECT * FROM firma;";
sudo mysql -Bse "USE wipa;SELECT * FROM niederlassung;";
sudo mysql -Bse "USE wipa;SELECT * FROM firma_hat_niederlassung;"
sudo mysql -Bse "USE wipa;SELECT * FROM praktikanten;";
sudo mysql -Bse "USE wipa;SELECT * FROM firma_hat_praktikanten;"
sudo mysql -Bse "USE wipa;SELECT * FROM jobs;"
sudo mysql -Bse "USE wipa;SELECT * FROM praktikant_hat_job;"
