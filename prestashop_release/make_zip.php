#!/usr/bin/php

<?php

$FROM="./ps_dotpayment";
$s=file_get_contents("./prestashop.txt");

$TO="/tmp/UPUPO";
$ZIP=$argv[1];

exec("rm -r \"".$TO."\"");

$s=explode("\n",$s); foreach($s as $l) {
    if(!strstr($l,'|') || strstr($l,'#') || substr($l,0,1)=='@') continue;
    list($from,$to) = explode('|',$l);
	$from=trim($from);
	if(!strstr($from,'://')) $from=$FROM.'/'.$from;
	$to=$TO.'/'.trim($to);
    if(basename($to)=='*') $to=str_replace('*',basename($from),$to);
    echo "copy: [$from] -> [$to]\n";
    $dd=explode('/',dirname($to)); if($dd[0]=='') unset($dd[0]);
    $d=''; foreach($dd as $l) { $d.='/'.$l; if(!is_dir($d)) { mkdir($d); chmod($d,0777); }  }

    if(!strstr($from,'://') && !is_file($from)) die("Error: file not found [".$from."]");

    $o=file_get_contents($from);
    if(empty($o)) die("Error: empty file [".$from."]");

    foreach($s as $l) {
	if(substr($l,0,1)!='@') continue;
	list($a,$b)=explode('|',substr($l,1)); $a=trim($a," \t"); $b=trim($b," \t");
	$o1=$o; $o=str_replace($a,$b,$o);
	if($o1!=$o) echo "   --> replaced: ($a)=>($b)\n";

    }
    file_put_contents($to,$o);
    // copy($from,$to);
    chmod($to,0666);
}

echo "create: [$ZIP]\n";
if(is_file($ZIP)) unlink($ZIP);
exec("cd \"".$TO."\"; zip -r \"../../".$ZIP."\" \"./\"");
exec("cd ../../");
chmod($ZIP,0666);
copy($ZIP,"/tmp/".$ZIP);

?>
