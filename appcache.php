<?php

	define('BASE_PATH', getcwd());
	$files = array();

	function getDirectoryContents($folder = '') {
		global $files;
		$directory = opendir(BASE_PATH . '/' . $folder);
		while ($file = readdir($directory)) {
			if (substr($file, 0, 1) != '.') {
				if (!is_dir(BASE_PATH . '/' . $folder . '/' . $file)) { 
					$files[] = array(
						'path' => $folder . '/' . $file,
						'hash' => md5_file(BASE_PATH . $folder . '/' . $file)
					);
				} else {
					getDirectoryContents($folder . '/' . $file);
				}
			}
		}
	}

	getDirectoryContents();

	header('Content-type:text/cache-manifest');
?>
CACHE MANIFEST


CACHE:
	http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
<?php foreach($files as $file):?>
	<?=$file['path']?> #<?=$file['hash']?>

<?php endforeach ?>
