'use strict';

var config = require('./server/config/config')
	, app = require('./server/config/system/bootstrap')();

app.listen(config.port);