let http = require('http'),
	fs = require('fs'),
	url = require('url'),
	path = require('path'),

	//объект с mime-типами позволяет загружать контент
	typeMime = {
		'.html': 'text/html',
		'.js': 'text/javascript',
		'.css': 'text/css',
		'.png': 'image/png',
	};

http.createServer(function (req, res) {
	let _url = url.parse(req.url),
		//находим имя файла, к которому был сделан http-запрос
		filename = _url.pathname.substring(1),
		extname,
		type,
		img;

	//если обращение к корню, то отдаем index.html
	if (_url.pathname === '/') {
		filename = 'index.html';
	}

	//находим расширение файла, на который поступил запрос
	extname = path.extname(filename);
	//выбираем файлу mime-тип
	type = typeMime[path.extname(filename)];

	//проверяем, пришел ли запрос на картинку
	if ((extname === '.png')) {
		//если картинка
		img = fs.readFileSync(filename);
		res.writeHead(200, {
			'Content-Type': type
		});
		//вторым параметром передаем кодировку 'hex', т.к. изображения - двоичные файлы
		res.write(img, 'hex');
		res.end();
	} else {
		//если не картинка, подгружаем файлы с учетом mime-типа
		fs.readFile(filename, 'utf8', function (err, data) {
			if (err) {
				res.writeHead(404, {
					'Content-Type': 'text/plain; charset=utf-8'
				});
				res.write(err.message);
				res.end();
			} else {
				res.writeHead(200, {
					'Content-Type': type
				});
				res.write(data);
				res.end();
			}
		})
	}
}).listen(3001);

console.log('Server running on port 3001');
