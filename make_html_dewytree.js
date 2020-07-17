//-------------------------------------------------------;
// REQUIRE;
//-------------------------------------------------------;
var fs = require( "fs" );

//-------------------------------------------------------;
// VARIABLE;
//-------------------------------------------------------;
var result_path = "./brand/dewytree/"
var FILE_PATH = result_path + "data.json";
var THTML_PATHS = {
	cards : "./THTML/card.thtml"
	, ads_total : "./THTML/ads_total.thtml"
    , insight : "./THTML/insight.thtml"
    , report : "./THTML/report.thtml"
	, statistic : "./THTML/statistic.thtml"
	, location : "./THTML/location.thtml"
	, kols : "./THTML/kols.thtml"
	, table : "./THTML/table.thtml"
};
var brand_nm = "SelfCoding";
var target_year_month = "202006";
var target_month = Number( target_year_month.substr( 4,2 ) ).toString();

//-------------------------------------------------------;
// FILEPATH;
//-------------------------------------------------------;
var data = JSON.parse( fs.readFileSync( FILE_PATH ).toString() );
var cards_thtml = fs.readFileSync( THTML_PATHS[ "cards" ] ).toString();
var insight_thtml = fs.readFileSync( THTML_PATHS[ "insight" ] ).toString();
var statistic_thtml = fs.readFileSync( THTML_PATHS[ "statistic" ] ).toString();
var report_thtml = fs.readFileSync( THTML_PATHS[ "report" ] ).toString();
var location_thtml = fs.readFileSync( THTML_PATHS[ "location" ] ).toString();
var ads_total_thtml = fs.readFileSync( THTML_PATHS[ "ads_total" ] ).toString();
var kols_thtml = fs.readFileSync( THTML_PATHS[ "kols" ] ).toString();
var statistic_monthly_thtml = fs.readFileSync( THTML_PATHS[ "table" ] ).toString();
var cost_monthly_thtml = fs.readFileSync( THTML_PATHS[ "table" ] ).toString();
var cost_total_thtml = fs.readFileSync( THTML_PATHS[ "table" ] ).toString();

//-------------------------------------------------------;
// FUNCTION;
//-------------------------------------------------------;

/*
 * 숫자에3자리마다 콤마를 직어주는 함수;
 */
var numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//-------------------------------------------------------;
//인사이트생성;
//-------------------------------------------------------;
/*
{
	"월": "6",
	"동향": "1. Marketing으로 인한 오피셜 계정의 유입 및 팔로워 증가 \n2. 오프라인 매장입점 및 판매 증가\n3. 온라인 판매자 증가 (07월 01일 shopee 기준 113업체 판매중.  ex. https://shopee.vn/search?keyword=varihope)\n4. SNS 구매 고객층 증가",
	"제품관련": "  1. 제품 파손 및 포장상태 \n- 6월 제품불량으로 인한 반품건수 (104건 : 비타민앰플 (102건) 비타민크림 (2건))\n  2. WATSONS \n- 제품불량 증가로 complaint 발생. 제품 리뉴얼 진행요청 (리뉴얼 불가시 입점관련 취소)",
	"진행상황": "해당 판매의 촉진으로 인한 complaint 증가 (1:1 맞교환으로 응대하고 있음)\nWATSONS complaint 관련 (본사요청으로 대응중)",
	"코멘트": "",
	"요청사항": "마케팅지원 (샘플링) 및 제품반품 및 불량 : 128개\n     1.뷰티유투버 및 인플루언서 : 12개\n     2.체험단 및 리뷰 : 12개\n     3. 제품파손 및 불량 : 104개 ",
	"특이사항": "\nWATSONS 오프라인 입점완료 (호치민 Aeon Celadon)\n벽면 지정매대 설치완료\n\n주소: 30 Bo bao tan thang street, Son ky Ward, tan phu district,\n오픈 시간: 7월4일\n"
}
*/
var make_insight_html = function( arr, html ){
	var r = "";
	var _html;

	var i = 0,iLen = arr.length,io;
	for(;i<iLen;++i){
		io = arr[ i ];
		var s,so;
		for( s in io ){
			so = io[ s ];

			if( s == "월" ) continue;
			if( so == "" ) continue;

			_html = html.replace( "<!=TITLE=!>", s  )
				.replace( "<!=CONTENTS=!>", so.replace(/\r/g, "<br>").replace(/\n/g, "<br>") );
			r += _html + "\n"
		}
	}
	return r;
};


//-------------------------------------------------------;
//페이스북연령통계 생성;
//-------------------------------------------------------;
var make_ages_data = function( arr ){
	var i = 0,iLen = arr.length,io;
	var r = {
        d00 : []
        , d01 : []
        , d02 : []
        , d03 : []
    };

	/*
	"연령": "18-24",
	"도달": "1030656",
	"노출 수": "1,797,895",
	"회수": "2",
	"지출 금액\n (VND)": "29,617,651",
	"페이지 참여": "236,171",
	"게시물 참여": "234,937",
	"게시물 댓글": "96",
	"게시물 반응": "8145",
	"페이지 좋아요": "1235",
	"동영상 50% 시간 보기": "142150",
	"동영상 100% 보기": "102598",
	"새로운 메시지 연결": "134"
	*/
    for(;i<iLen;i++){
		io = arr[ i ];
        var o00 = {"ages" : io[ "연령" ], value : Number( io[ "도달" ] )};
        var o01 = {"ages" : io[ "연령" ], value : Number(io[ "노출 수" ] )};
        var o02 = {"ages" : io[ "연령" ], value : Number(io[ "게시물 참여" ] )};
        var o03 = {"ages" : io[ "연령" ] , value : Number(io[ "페이지 좋아요" ] )};
        if( Number( io[ "도달" ] ) ) r.d00.push( o00 );
        if( Number( io[ "노출 수" ] ) ) r.d01.push( o01 );
        if( Number( io[ "게시물 참여" ] ) ) r.d02.push( o02 );
        if( Number( io[ "페이지 좋아요" ] ) ) r.d03.push( o03 );
	}
	return r;
};


//-------------------------------------------------------;
//페이스북시간별통계 생성;
//-------------------------------------------------------;
var make_time_data = function( arr ){
	var i = 0,iLen = arr.length,io;
	var r = [];
	/*
	"시간": "09:00:00 - 09:59:59",
	"노출 수": "155615",
	"회수": "",
	"지출 금액\n (VND)": "",
	"페이지 참여": "",
	"게시물 참여": "4019739.71",
	"게시물 댓글": "18567",
	"게시물 반응": "18460",
	"페이지 좋아요": "10",
	"동영상 50% 시간 보기": "524",
	"동영상 100% 보기": "107",
	"새로운 메시지 연결": "18",
	"새로운 메시지 한번 연결에 금액": "223,318.87"
	*/
    for(;i<iLen;i++){
		io = arr[ i ];
        var o00 = {"time" : io[ "시간" ], view : Number( io[ "노출 수" ] ), like : Number( io[ "페이지 좋아요" ] )};
        r.push( o00 );
	}
	return r;
};

//-------------------------------------------------------;
// 페이스북지역통계 생성;
//-------------------------------------------------------;
var make_location_data = function( arr, o ){

	var r = [
		['State', '도달', '노출수']
	];

	var i = 0,iLen = arr.length,io;
	/*
		"도시": "Bắc Ninh Province",
		"도달": "39,936",
		"노출 수": "",
		"회수": "",
		"지출 금액\n (VND)": "76,464",
		"페이지 참여": "1.91",
		"게시물 참여": "1,668,903.88",
		"게시물 댓글": "20,565",
		"게시물 반응": "20,455",
		"페이지 좋아요": "7",
		"동영상 50% 시간 보기": "664",
		"동영상 100% 보기": "110",
		"새로운 메시지 연결": "3"
	*/
    for(;i<iLen;i++){
		io = arr[ i ];
        var _ta = [
			{ f : io[ "도시" ], v : o[ io[ "도시" ] ] }
			, Number( io[ "도달" ] )
			, Number( io[ "노출 수" ] )
		]
		r.push( _ta );
	}
	return r;
};

var logic = function(){
    
	var d  = {};
	d.brand_nm = brand_nm;
	d.target_month = target_month;
	d.ads_list = data.ads_list[ target_month ];
	d.insight = data.insight[ target_month ]
	d.kols = data.kols[ target_month ];
	d.statistic_monthly = data.statistic_monthly;
	d.cost_monthly = data.cost_monthly;
	d.cost_total = data.cost_total;
	d.ages = make_ages_data( data.ages[ target_month ] );
	d.time = make_time_data( data.time[ target_month ] );
	d.location_data = make_location_data( data.location[ target_month ],data.geocode );


    fs.writeFileSync( result_path + target_year_month + "_data.json", JSON.stringify( d ),{ flag : "w" })
}

logic();