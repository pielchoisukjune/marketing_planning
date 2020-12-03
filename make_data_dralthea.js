const fs = require('fs');
const readline = require('readline');
const google = require('googleapis').google;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'token.json';

try
{
	var credentail = JSON.parse( fs.readFileSync('credentials.json' ).toString() );
}
catch(e)
{
	console.log('Error loading client secret file:', e);
	return;
}


//구글계정인증;
var  authorize = function( credentials, callback ){
	console.log( "[s] - authorize();" )
	const client_secret = credentials.installed.client_secret;
	const client_id = credentials.installed.client_id;
	const redirect_uris = credentials.installed.redirect_uris;
	const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0] );

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token){
		if (err) return getNewToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		console.log( "[e] - authorize();" )
		callback(oAuth2Client);
	});
}

//구글계정인증실패시 토큰재생성;
var getNewToken = function getNewToken( oAuth2Client, callback ){
	console.log( "[s] - getNewToken();" )
	var authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
	console.log('Authorize this app by visiting this url : ', authUrl);

	var rl = readline.createInterface({ input: process.stdin, output: process.stdout });

	rl.question('Enter the code from that page here: ', function(code){
	  rl.close();
	  oAuth2Client.getToken(code, (err, token) => {
		if (err) return console.error('Error while trying to retrieve access token', err);
		oAuth2Client.setCredentials(token);

		// Store the token to disk for later program executions
		fs.writeFileSync(TOKEN_PATH, JSON.stringify(token),{ flag : "w"} );
		console.log( "[e] - getNewToken();" )
		callback( oAuth2Client );
	  });
	});
  }

var result_path = "./brand/dralthea/";
var spreadsheetId = "18tQT4iU_ekSl7VviiM0vppPdYPwKCIqju2Cb7PCXcvc";
var OPTIONS = {
	FUNC00 : {
		spreadsheetId : spreadsheetId
		, range : '마케팅집행리스트!A:M'
	}
	, FUNC01 : {
		spreadsheetId : spreadsheetId
		, range : '페이스북 STATISTIC!A:M'
	}
	, FUNC02 : {
		spreadsheetId : spreadsheetId
		, range : '페이스북 연령 통계!A:M'
	}
	, FUNC03 : {
		spreadsheetId : spreadsheetId
		, range : '페이스북 지역별 통계!A:M'
	}
	, FUNC04 : {
		spreadsheetId : spreadsheetId
		, range : '페이스북 시간대별 통계!A:M'
	}
	, FUNC05 : {
		spreadsheetId : spreadsheetId
		, range : 'Manger Insight!A:M'
	}
	, FUNC06 : {
		spreadsheetId : spreadsheetId
		, range : '지역코드!A:M'
	}
	, FUNC07 : {
		spreadsheetId : spreadsheetId
		, range : 'KOLs!A:M'
	}
	, FUNC08 : {
		spreadsheetId : spreadsheetId
		, range : '월간진행수량!A:M'
	}
	, FUNC09 : {
		spreadsheetId : spreadsheetId
		, range : '월간진행비용!A:M'
	}
	, FUNC10 : {
		spreadsheetId : spreadsheetId
		, range : '서비스제안가!A:M'
	}
}

var d = {
	ads_list : {}
	, ads_total : {}
	, total : {}
	, ages : {}
	, location : {}
	, time : {}
	, insight : {}
	, geocode : {}
	, kols : {}
	, statistic_monthly : []
	, cost_monthly : []
	, cost_total : []
};

//-------------------------------------------------------;
// FUNCTION;
//-------------------------------------------------------;

var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var FUNC00 = function( auth ){

	var key = "FUNC00"

	console.log( "[ S ] - FUNC00();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log( key + ' -- No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					if( _header[ z ] == "타입" )
					{
						var _tzo = zo.trim();
						if( !d.ads_total[ io[0] ] )
						{
							d.ads_total[ io[0] ] = {};
							d.ads_list[ io[0] ] = {};
						}
						if( !d.ads_total[ io[0] ][ _tzo ] )
						{
							d.ads_total[ io[0] ][ _tzo ] = 1;
						}
						if( !d.ads_list[ io[0] ][ _tzo ] )
						{
							d.ads_list[ io[0] ][ _tzo ] = [];
						}
						else ++d.ads_total[ io[0] ][ _tzo ];
					}
					o[ _header[ z ] ] = zo.trim();
				}
				d.ads_list[ io[0] ][ o[ "타입" ] ].push( o )
			}
		}
		console.log( "[ E ] - FUNC00();" )

		FUNC01( auth )
	});
}

/**
 * 보고서데이터 생성함수
 * @param {*} auth
 */
var FUNC01 = function( auth ){
	var key = "FUNC01"

	console.log( "[ S ] - FUNC01();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ].trim().replace(/\r/g, "").replace(/\n/g, "") ] = zo.trim();
				}
				if( !d.total[ io[0] ] ) d.total[ io[0] ] = [];
				d.total[ io[0] ].push( o )
			}
		}
		console.log( "[ E ] - FUNC01();" )
		FUNC02( auth )
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC02 = function( auth ){
	var key = "FUNC02"

	console.log( "[ S ] - FUNC02();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ] ] = zo;
				}
				if( !d.ages[ io[0] ] ) d.ages[ io[0] ] = [];
				d.ages[ io[0] ].push( o )
			}
		}
		console.log( "[ E ] - FUNC02();" )
		FUNC03( auth )
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC03 = function( auth ){
	var key = "FUNC03"

	console.log( "[ S ] - FUNC03();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ] ] = zo;
				}
				if( !d.location[ io[0] ] ) d.location[ io[0] ] = [];
				d.location[ io[0] ].push( o );
			}
		}
		console.log( "[ E ] - FUNC03();" )
		FUNC04( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC04 = function( auth ){
	var key = "FUNC04"

	console.log( "[ S ] - FUNC04();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ] ] = zo;
				}
				if( !d.time[ io[0] ] ) d.time[ io[0] ] = [];
				d.time[ io[0] ].push( o );
			}
		}
		console.log( "[ E ] - FUNC04();" )
		FUNC05( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC05 = function( auth ){
	var key = "FUNC05"

	console.log( "[ S ] - FUNC05();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ] ] = zo;
				}
				if( !d.insight[ io[0] ] ) d.insight[ io[0] ] = [];
				d.insight[ io[0] ].push( o );
			}
		}
		console.log( "[ E ] - FUNC05();" )
		FUNC06( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC06 = function( auth ){
	var key = "FUNC06"

	console.log( "[ S ] - FUNC06();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 1,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			d.geocode[ io[ 0 ] ] = io[ 2 ];
		}
		console.log( "[ E ] - FUNC06();" )
		FUNC07( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC07 = function( auth ){
	var key = "FUNC07"

	console.log( "[ S ] - FUNC07();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');

		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
				//console.log( _header )
			}
			else
			{
				var z = 0,zLen = io.length,zo;
				var o = {};
				for(;z<zLen;++z){
					zo = io[ z ];
					o[ _header[ z ] ] = zo;
				}
				if( !d.kols[ io[0] ] ) d.kols[ io[0] ] = [];
				d.kols[ io[0] ].push( o );
			}
		}
		console.log( "[ E ] - FUNC07();" )
		FUNC08( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC08 = function( auth ){
	var key = "FUNC08"

	console.log( "[ S ] - FUNC08();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');
		var _ta = []
		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
			}

			var z = 0,zLen = _header.length,zo;
			var a = [];
			for(;z<zLen;++z){
				zo = io[ z ];
				if( !zo ) a.push( "" );
				else a.push( zo );

			}
			d.statistic_monthly.push( a );
		}

		console.log( "[ E ] - FUNC08();" )
		FUNC09( auth ); 
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC09 = function( auth ){
	var key = "FUNC09"

	console.log( "[ S ] - FUNC09();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');
		var _ta = []
		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
			}

			var z = 0,zLen = _header.length,zo;
			var a = [];
			for(;z<zLen;++z){
				zo = io[ z ];
				if( !zo ) a.push( "" );
				else a.push( zo );

			}
			d.cost_monthly.push( a );
		}

		console.log( "[ E ] - FUNC09();" )
		FUNC10( auth );
	});
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
var FUNC10 = function( auth ){
	var key = "FUNC10"

	console.log( "[ S ] - FUNC10();" )

	google.sheets({version: 'v4', auth}).spreadsheets.values.get( OPTIONS[ key ], function(err, res){
		if (err) return console.log('The API returned an error: ' + err);
		const rows = res.data.values;
		if (rows.length == 0 ) return console.log('ads list - No data found.');
		var _ta = []
		var i = 0,iLen = rows.length,io;
		var _header = [];
		for(;i<iLen;++i){
			io = rows[ i ];
			if( i == 0 )
			{
				io.forEach(function( item ){ _header.push( item ) });
			}

			var z = 0,zLen = _header.length,zo;
			var a = [];
			for(;z<zLen;++z){
				zo = io[ z ];
				if( !zo ) a.push( "" );
				else a.push( zo );

			}
			d.cost_total.push( a );
		}

		console.log( "[ E ] - FUNC10();" )
		fs.writeFileSync( result_path + "data.json", JSON.stringify( d, null, 4 ), { flag : "w"});
	});
}

authorize( credentail, FUNC00 );

//구글계정인증;