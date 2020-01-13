<?php
define('MAPSVG_PLUGIN_URL', "http".(!empty($_SERVER['HTTPS'])?"s":"")."://".$_SERVER['SERVER_NAME'].dirname($_SERVER['SCRIPT_NAME']).'/');
define('MAPSVG_PLUGIN_DIR', dirname(__FILE__) .DIRECTORY_SEPARATOR);
define('MAPSVG_BUILDER_DIR', MAPSVG_PLUGIN_DIR);
define('MAPSVG_MAPS_DIR', MAPSVG_PLUGIN_DIR.'maps');
define('MAPSVG_MAPS_UPLOADS_DIR', MAPSVG_MAPS_DIR . DIRECTORY_SEPARATOR . 'user-uploads');
define('MAPSVG_MAPS_URL', MAPSVG_PLUGIN_URL . 'maps/');
define('MAPSVG_PINS_DIR', MAPSVG_PLUGIN_DIR . 'markers'.DIRECTORY_SEPARATOR);
define('MAPSVG_PINS_URL', MAPSVG_PLUGIN_URL . 'markers/');
define('MAPSVG_VERSION', '2.2.1');
define('MAPSVG_JQUERY_VERSION', '6.2.0');


if(isset($_POST['upload_svg']) && $_FILES['svg_file']['tmp_name']){
    $target_dir = MAPSVG_MAPS_UPLOADS_DIR;
    $target_file = $target_dir . DIRECTORY_SEPARATOR .basename($_FILES["svg_file"]["name"]);

    $file_parts = pathinfo($_FILES['svg_file']['name']);
    $a = str_replace("\n"," \\n", str_replace("e\\","e \\",$js_mapsvg_options));

    if(strtolower($file_parts['extension'])!='svg'){
        $mapsvg_error = 'Wrong file format ('.$file_parts['extension'].'). Only SVG files are compatible with the plugin.';
    }else{
        if (@move_uploaded_file($_FILES["svg_file"]["tmp_name"], $target_file)) {
            $mapsvg_notice = "The file ". basename( $_FILES["svg_file"]["name"]). " has been uploaded.";

            $svg_filename = MAPSVG_MAPS_URL.'user-uploads/'.basename( $_FILES["svg_file"]["name"]);
            header('location: '.MAPSVG_PLUGIN_URL.'?map='.$svg_filename);
        } else {
            $mapsvg_error = "An error occured during upload of your file. Please check that ".MAPSVG_MAPS_UPLOADS_DIR." folder exists and it has full permissions (777).";
            header('location: '.MAPSVG_PLUGIN_URL.'?uploadError=1');
        }
    }
}

if(isset($_GET['action'])){
    if(is_callable($_GET['action'])){
        $data = isset($_GET['data']) ? $_GET['data'] : null;
        call_user_func($_GET['action'], $data);
    }
}

function check_php(){
    echo "1";
}

function get_markers_and_maps(){
    $_markers = @scandir(MAPSVG_PINS_DIR);
    if($_markers){
        array_shift($_markers);
        array_shift($_markers);
    }
    $safeMarkerImagesURL = safeURL(MAPSVG_PINS_URL);
    $markers = array();

    if(!empty($_markers))
        foreach($_markers as $m){
            $markers[] = array("url"=>$safeMarkerImagesURL.$m, "file"=>$m);
        }

    $path = realpath(MAPSVG_MAPS_DIR);
    $maps = array();
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path)) as $filename)
    {
        if(strpos($filename,'.svg')!==false){
            $file = str_replace(MAPSVG_MAPS_DIR.DIRECTORY_SEPARATOR,'',$filename);
            $maps[] = array(
                'file' => $file,
                'url'  => MAPSVG_MAPS_URL.$file
            );
        }
    }

    echo json_encode( array('markers'=>$markers, 'maps'=>$maps) );
}

function safeURL($url){
    if(strpos("http://",$url) === 0 || strpos("https://",$url) === 0){
        $a = explode("://", $url);
        $url = "//".$a[1];
    }

    return $url;
}

